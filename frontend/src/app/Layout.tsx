import { useRef } from "react";
import { Outlet } from "react-router";
import { Header } from "./pages/Header.tsx";

export function Layout() {
	const headerRef = useRef<HTMLElement | null>(null);

	return (
		<div className="min-h-screen bg-gray-50">
			<Header ref={headerRef} />
			<main>
				<Outlet />
			</main>
		</div>
	);
}
