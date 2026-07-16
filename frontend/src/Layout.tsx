import { useRef } from "react";
import { Outlet } from "react-router";
import { BottomNavBar } from "./components/Navbar/BottomNavBar.tsx";
import { Header } from "./pages/Header.tsx";
import HomeFooter from "./pages/HomeFooter.tsx";

export function Layout() {
  const headerRef = useRef<HTMLElement | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
      <Header ref={headerRef} />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <HomeFooter />
      <BottomNavBar />
    </div>
  );
}
