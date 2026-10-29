import type { FormEvent, ReactNode } from "react";
import { useNavigate } from "react-router";

export function SearchForm({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const navigate = useNavigate();

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const min = fields.get("min")?.toString();
    const max = fields.get("max")?.toString();
    if (min && max && Number(min) > Number(max)) {
      const input = event.currentTarget.elements.namedItem(
        "max",
      ) as HTMLInputElement;
      input.setCustomValidity(
        "El precio máximo debe ser mayor o igual al mínimo.",
      );
      input.reportValidity();
      return;
    }
    const params = new URLSearchParams();
    for (const key of [
      "q",
      "categoria",
      "ciudad",
      "condicion",
      "min",
      "max",
      "orden",
    ]) {
      const value = fields.get(key)?.toString().trim();
      if (value) params.set(key, value);
    }
    navigate({ pathname: "/explorar", search: params.toString() });
  }

  return (
    <form
      action="/explorar"
      method="get"
      role="search"
      className={className}
      onSubmit={submitSearch}
      onInput={(event) => {
        const max = event.currentTarget.elements.namedItem("max");
        if (max instanceof HTMLInputElement) max.setCustomValidity("");
      }}
    >
      {children}
    </form>
  );
}
