// Header.tsx -- the simplest possible component: it owns no state at
// all, and just renders whatever props it's handed. "Props down" in its
// purest form.

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
