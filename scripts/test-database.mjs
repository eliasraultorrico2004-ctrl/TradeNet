import { PGlite } from "@electric-sql/pglite";
import { readFile, readdir } from "node:fs/promises";
import assert from "node:assert/strict";

const db = new PGlite();
let checks = 0;
const uid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const [seller, buyer, stranger, admin, unconfirmed] = [1, 2, 3, 4, 5].map(uid);
async function as(role, user, sql, params = []) {
  await db.exec(`set role ${role};`);
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
    user ?? "",
  ]);
  try {
    return await db.query(sql, params);
  } finally {
    await db.exec("reset role");
  }
}
async function pass(label, work) {
  await work();
  checks++;
  console.log(`OK ${label}`);
}
async function denied(role, user, sql, params, code) {
  await assert.rejects(
    as(role, user, sql, params),
    (e) => !code || e.code === code,
  );
}
const scalar = (result) => Number(Object.values(result.rows[0])[0]);
try {
  await db.exec(
    await readFile(
      new URL("../supabase/tests/bootstrap.sql", import.meta.url),
      "utf8",
    ),
  );
  const dir = new URL("../supabase/migrations/", import.meta.url);
  for (const file of (await readdir(dir))
    .filter((f) => f.endsWith(".sql"))
    .sort())
    await db.exec(await readFile(new URL(file, dir), "utf8"));
  for (const user of [seller, buyer, stranger, admin, unconfirmed])
    await db.query(
      "insert into auth.users(id,email_confirmed_at,raw_user_meta_data) values($1,$2,$3)",
      [
        user,
        user === unconfirmed ? null : new Date().toISOString(),
        JSON.stringify({ display_name: "Persona de prueba", role: "admin" }),
      ],
    );
  await db.query("insert into tradenet_private.admins(user_id) values($1)", [
    admin,
  ]);
  await pass("catálogo de referencia público y perfil automático", async () => {
    assert.equal(
      scalar(await as("anon", null, "select count(*) from public.categories")),
      6,
    );
    assert.equal(
      scalar(await as("anon", null, "select count(*) from public.cities")),
      10,
    );
    assert.equal(
      scalar(await as("anon", null, "select count(*) from public.profiles")),
      5,
    );
  });
  await pass("RLS activado en todas las tablas del marketplace", async () => {
    const tables = await db.query(
      "select relname,relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r'",
    );
    assert.equal(tables.rows.length, 9);
    assert(tables.rows.every((t) => t.relrowsecurity));
  });
  await pass("metadatos de usuario no conceden administración", async () => {
    assert.equal(
      (
        await as(
          "authenticated",
          buyer,
          "select tradenet_private.is_admin() as admin",
        )
      ).rows[0].admin,
      false,
    );
    await denied(
      "authenticated",
      buyer,
      "insert into tradenet_private.admins(user_id) values($1)",
      [buyer],
      "42501",
    );
    await denied(
      "authenticated",
      buyer,
      "select public.restore_product($1,$2)",
      [uid(99), "Motivo de prueba"],
      "42501",
    );
  });
  const productSql =
    "insert into public.products(title,description,category_id,city_id,price,condition) values('Artículo de prueba','Una descripción de prueba suficientemente larga','tecnologia','la-paz',450,'Usado') returning id";
  let product;
  await pass("solo cuenta confirmada crea borradores", async () => {
    await denied("anon", null, productSql, [], "42501");
    await denied("authenticated", unconfirmed, productSql, [], "42501");
    product = (await as("authenticated", seller, productSql)).rows[0].id;
    assert.equal(
      scalar(await as("anon", null, "select count(*) from public.products")),
      0,
    );
    assert.equal(
      scalar(
        await as(
          "authenticated",
          stranger,
          "select count(*) from public.products",
        ),
      ),
      0,
    );
  });
  await pass(
    "precio positivo, BOB y columnas de propiedad protegidos",
    async () => {
      await denied(
        "authenticated",
        seller,
        "update public.products set price = 0 where id=$1",
        [product],
        "23514",
      );
      await denied(
        "authenticated",
        seller,
        "update public.products set currency='USD' where id=$1",
        [product],
        "42501",
      );
      await denied(
        "authenticated",
        seller,
        "update public.products set seller_id=$2 where id=$1",
        [product, buyer],
        "42501",
      );
      await denied(
        "authenticated",
        seller,
        "update public.products set hidden_at=now() where id=$1",
        [product],
        "42501",
      );
      await denied(
        "authenticated",
        seller,
        "delete from public.products where id=$1",
        [product],
        "42501",
      );
    },
  );
  await pass("publicación ajena no se modifica", async () => {
    assert.equal(
      (
        await as(
          "authenticated",
          stranger,
          "update public.products set title='Intento no permitido' where id=$1 returning id",
          [product],
        )
      ).rows.length,
      0,
    );
  });
  await pass("no se publica sin una foto real en Storage", async () => {
    await denied(
      "authenticated",
      seller,
      "update public.products set status='activa' where id=$1",
      [product],
      "23514",
    );
    await denied(
      "authenticated",
      seller,
      "insert into public.product_images(product_id,storage_path,position) values($1,$2,0)",
      [product, `${seller}/${product}/${uid(20)}.png`],
      "23514",
    );
  });
  const imagePath = `${seller}/${product}/${uid(21)}.png`;
  await pass("carpetas de Storage aisladas por propietario", async () => {
    await denied(
      "authenticated",
      stranger,
      "insert into storage.objects(bucket_id,name) values('product-images',$1)",
      [imagePath],
      "42501",
    );
    await as(
      "authenticated",
      seller,
      "insert into storage.objects(bucket_id,name) values('product-images',$1)",
      [imagePath],
    );
    await as(
      "authenticated",
      seller,
      "insert into public.product_images(product_id,storage_path,position) values($1,$2,0)",
      [product, imagePath],
    );
    assert.equal(
      scalar(await as("anon", null, "select count(*) from storage.objects")),
      0,
    );
    await as(
      "authenticated",
      seller,
      "update public.products set status='activa' where id=$1",
      [product],
    );
    assert.equal(
      scalar(await as("anon", null, "select count(*) from public.products")),
      1,
    );
    assert.equal(
      scalar(await as("anon", null, "select count(*) from storage.objects")),
      1,
    );
  });
  await pass(
    "foto activa no se borra ni se reemplaza por fuera del catálogo",
    async () => {
      await denied(
        "authenticated",
        seller,
        "delete from public.product_images where product_id=$1",
        [product],
        "23514",
      );
      assert.equal(
        (
          await as(
            "authenticated",
            seller,
            "delete from storage.objects where name=$1 returning id",
            [imagePath],
          )
        ).rows.length,
        0,
      );
      assert.equal(
        (
          await as(
            "authenticated",
            seller,
            "update storage.objects set name=name||'.png' where name=$1 returning id",
            [imagePath],
          )
        ).rows.length,
        0,
      );
    },
  );
  await pass(
    "máximo cinco fotos, portada y reordenamiento sin duplicados",
    async () => {
      for (let position = 1; position < 5; position++) {
        const path = `${seller}/${product}/${uid(21 + position)}.png`;
        await as(
          "authenticated",
          seller,
          "insert into storage.objects(bucket_id,name) values('product-images',$1)",
          [path],
        );
        await as(
          "authenticated",
          seller,
          "insert into public.product_images(product_id,storage_path,position) values($1,$2,$3)",
          [product, path, position],
        );
      }
      const extra = `${seller}/${product}/${uid(26)}.png`;
      await as(
        "authenticated",
        seller,
        "insert into storage.objects(bucket_id,name) values('product-images',$1)",
        [extra],
      );
      await denied(
        "authenticated",
        seller,
        "insert into public.product_images(product_id,storage_path,position) values($1,$2,5)",
        [product, extra],
        "23514",
      );
      const images = (
        await as(
          "authenticated",
          seller,
          "select id from public.product_images where product_id=$1 order by position",
          [product],
        )
      ).rows
        .map((row) => row.id)
        .reverse();
      await as(
        "authenticated",
        seller,
        "select public.reorder_product_images($1,$2::uuid[])",
        [product, images],
      );
      assert.deepEqual(
        (
          await as(
            "authenticated",
            seller,
            "select id from public.product_images where product_id=$1 order by position",
            [product],
          )
        ).rows.map((row) => row.id),
        images,
      );
      await denied(
        "authenticated",
        stranger,
        "select public.reorder_product_images($1,$2::uuid[])",
        [product, images],
        "42501",
      );
      await denied(
        "authenticated",
        seller,
        "select public.reorder_product_images($1,$2::uuid[])",
        [product, [images[0], images[0]]],
        "23514",
      );
      assert.equal(
        scalar(await as("anon", null, "select count(*) from storage.objects")),
        5,
      );
    },
  );
  await pass("pausar retira fotos y reactivar recupera el acceso", async () => {
    await as(
      "authenticated",
      seller,
      "update public.products set status='pausada' where id=$1",
      [product],
    );
    assert.equal(
      scalar(await as("anon", null, "select count(*) from public.products")),
      0,
    );
    assert.equal(
      scalar(await as("anon", null, "select count(*) from storage.objects")),
      0,
    );
    await as(
      "authenticated",
      seller,
      "update public.products set status='activa' where id=$1",
      [product],
    );
    assert.equal(
      scalar(await as("anon", null, "select count(*) from storage.objects")),
      5,
    );
  });
  await pass("favoritos privados y sin duplicados", async () => {
    await as(
      "authenticated",
      buyer,
      "insert into public.favorites(product_id) values($1)",
      [product],
    );
    await denied(
      "authenticated",
      buyer,
      "insert into public.favorites(product_id) values($1)",
      [product],
      "23505",
    );
    assert.equal(
      scalar(
        await as(
          "authenticated",
          stranger,
          "select count(*) from public.favorites",
        ),
      ),
      0,
    );
    await denied("anon", null, "select * from public.favorites", [], "42501");
  });
  let conversation;
  await pass("conversación solo entre comprador y vendedor", async () => {
    await denied(
      "authenticated",
      seller,
      "insert into public.conversations(product_id) values($1)",
      [product],
      "42501",
    );
    conversation = (
      await as(
        "authenticated",
        buyer,
        "insert into public.conversations(product_id) values($1) returning id",
        [product],
      )
    ).rows[0].id;
    await denied(
      "authenticated",
      buyer,
      "insert into public.conversations(product_id) values($1)",
      [product],
      "23505",
    );
    assert.equal(
      scalar(
        await as(
          "authenticated",
          stranger,
          "select count(*) from public.conversations",
        ),
      ),
      0,
    );
  });
  await pass(
    "mensajes privados, remitente protegido y texto limitado",
    async () => {
      await as(
        "authenticated",
        buyer,
        "insert into public.messages(conversation_id,body) values($1,'Mensaje ficticio')",
        [conversation],
      );
      assert.equal(
        scalar(
          await as(
            "authenticated",
            seller,
            "select count(*) from public.messages",
          ),
        ),
        1,
      );
      assert.equal(
        scalar(
          await as(
            "authenticated",
            stranger,
            "select count(*) from public.messages",
          ),
        ),
        0,
      );
      assert.equal(
        scalar(
          await as(
            "authenticated",
            admin,
            "select count(*) from public.messages",
          ),
        ),
        0,
      );
      await denied(
        "authenticated",
        stranger,
        "insert into public.messages(conversation_id,body) values($1,'Intruso')",
        [conversation],
        "42501",
      );
      await denied(
        "authenticated",
        buyer,
        "insert into public.messages(conversation_id,sender_id,body) values($1,$2,'Suplantación')",
        [conversation, seller],
        "42501",
      );
      await denied(
        "authenticated",
        buyer,
        "insert into public.messages(conversation_id,body) values($1,$2)",
        [conversation, "x".repeat(2001)],
        "23514",
      );
    },
  );
  let report;
  await pass("reportes limitados y privados", async () => {
    report = (
      await as(
        "authenticated",
        buyer,
        "insert into public.reports(product_id,reason) values($1,'other') returning id",
        [product],
      )
    ).rows[0].id;
    await denied(
      "authenticated",
      buyer,
      "insert into public.reports(product_id,reason) values($1,'other')",
      [product],
      "23505",
    );
    await denied(
      "authenticated",
      seller,
      "insert into public.reports(product_id,reason) values($1,'other')",
      [product],
      "42501",
    );
    assert.equal(
      scalar(
        await as(
          "authenticated",
          stranger,
          "select count(*) from public.reports",
        ),
      ),
      0,
    );
    await denied(
      "authenticated",
      buyer,
      "update public.reports set status='descartado' where id=$1",
      [report],
      "42501",
    );
  });
  await pass("moderación oculta también los archivos", async () => {
    await denied(
      "authenticated",
      buyer,
      "select public.moderate_report($1,'oculto','Motivo de prueba')",
      [report],
      "42501",
    );
    await as(
      "authenticated",
      admin,
      "select public.moderate_report($1,'oculto','Motivo de prueba')",
      [report],
    );
    assert.equal(
      scalar(await as("anon", null, "select count(*) from public.products")),
      0,
    );
    assert.equal(
      scalar(
        await as("anon", null, "select count(*) from public.product_images"),
      ),
      0,
    );
    assert.equal(
      scalar(await as("anon", null, "select count(*) from storage.objects")),
      0,
    );
    assert.equal(
      scalar(
        await as(
          "authenticated",
          seller,
          "select count(*) from public.products",
        ),
      ),
      1,
    );
    await denied(
      "authenticated",
      seller,
      "update public.products set status='pausada' where id=$1",
      [product],
      "42501",
    );
    await denied(
      "authenticated",
      seller,
      "update public.products set hidden_at=null where id=$1",
      [product],
      "42501",
    );
    await as(
      "authenticated",
      seller,
      "update public.products set title='Título corregido por el vendedor' where id=$1",
      [product],
    );
    assert.equal(
      scalar(await as("anon", null, "select count(*) from public.products")),
      0,
    );
  });
  await pass(
    "restauración solo administrativa y registro de auditoría",
    async () => {
      await as(
        "authenticated",
        admin,
        "select public.restore_product($1,'Revisión completada')",
        [product],
      );
      assert.equal(
        scalar(await as("anon", null, "select count(*) from public.products")),
        1,
      );
      assert.equal(
        scalar(
          await db.query(
            "select count(*) from tradenet_private.moderation_events",
          ),
        ),
        2,
      );
    },
  );
  await pass(
    "venta conserva historial pero bloquea nuevas conversaciones",
    async () => {
      await as(
        "authenticated",
        seller,
        "update public.products set status='vendida' where id=$1",
        [product],
      );
      await denied(
        "authenticated",
        stranger,
        "insert into public.conversations(product_id) values($1)",
        [product],
        "42501",
      );
      await as(
        "authenticated",
        buyer,
        "insert into public.messages(conversation_id,body) values($1,'Seguimiento de compra')",
        [conversation],
      );
      await denied(
        "authenticated",
        seller,
        "update public.products set status='activa' where id=$1",
        [product],
        "23514",
      );
    },
  );
  await pass(
    "borrado lógico retira archivos sin borrar el historial",
    async () => {
      await as(
        "authenticated",
        seller,
        "update public.products set deleted_at=now() where id=$1",
        [product],
      );
      assert.equal(
        scalar(await as("anon", null, "select count(*) from public.products")),
        0,
      );
      assert.equal(
        scalar(await as("anon", null, "select count(*) from storage.objects")),
        0,
      );
      assert.equal(
        scalar(
          await as(
            "authenticated",
            buyer,
            "select count(*) from public.messages",
          ),
        ),
        2,
      );
      assert.equal(
        (
          await as(
            "authenticated",
            seller,
            "update public.products set deleted_at=null where id=$1 returning id",
            [product],
          )
        ).rows.length,
        0,
      );
    },
  );
  await pass(
    "avatar público solo después de vincularlo al perfil",
    async () => {
      const path = `${buyer}/${uid(30)}.png`;
      await as(
        "authenticated",
        buyer,
        "insert into storage.objects(bucket_id,name) values('avatars',$1)",
        [path],
      );
      assert.equal(
        scalar(
          await as(
            "anon",
            null,
            "select count(*) from storage.objects where bucket_id='avatars'",
          ),
        ),
        0,
      );
      await as(
        "authenticated",
        buyer,
        "update public.profiles set avatar_path=$1 where id=$2",
        [path, buyer],
      );
      assert.equal(
        scalar(
          await as(
            "anon",
            null,
            "select count(*) from storage.objects where bucket_id='avatars'",
          ),
        ),
        1,
      );
      await denied(
        "authenticated",
        seller,
        "update public.profiles set avatar_path=$1 where id=$2",
        [path, seller],
        "23514",
      );
      assert.equal(
        (
          await as(
            "authenticated",
            stranger,
            "update public.profiles set display_name='Nombre ajeno' where id=$1 returning id",
            [buyer],
          )
        ).rows.length,
        0,
      );
    },
  );
  console.log(
    `\n${checks} comprobaciones de PostgreSQL correctas. Los contratos de Auth y Storage se simulan solo en esta base aislada.`,
  );
} finally {
  await db.close();
}
