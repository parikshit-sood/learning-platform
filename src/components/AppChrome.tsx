import type { ReactNode } from "react";

interface AppChromeProps {
  actions?: ReactNode;
  children: ReactNode;
}

export function AppChrome({ actions, children }: AppChromeProps) {
  return (
    <>
      <div className="cosmos" aria-hidden="true">
        <div className="stars stars-one" />
        <div className="stars stars-two" />
        <div className="nebula nebula-a" />
        <div className="nebula nebula-b" />
        <div className="scanline" />
      </div>

      <div className="app-shell">
        <nav className="topbar" aria-label="Primary navigation">
          <a className="brand" href="#/" aria-label="Knowledge Galaxy home">
            <span className="brand-mark">✦</span>
            <span>Knowledge Galaxy</span>
          </a>
          <div className="topbar-actions">{actions}</div>
        </nav>
        {children}
      </div>
    </>
  );
}
