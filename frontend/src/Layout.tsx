import { useRef } from "react";
import { Outlet } from "react-router";
import HomeFooter from "./components/HomeFooter.tsx";
import { Header } from "./pages/Header.tsx";

export function Layout() {
  const headerRef = useRef<HTMLElement | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header ref={headerRef} />
      <main className="flex-1">
        <Outlet />
      </main>
      <HomeFooter />
    </div>
  );
}
