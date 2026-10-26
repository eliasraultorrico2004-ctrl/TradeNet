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
    const params = new URLSearchParams();
    for (const key of ["q", "categoria"]) {
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
    >
      {children}
    </form>
  );
}
