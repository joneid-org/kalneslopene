import {Outlet} from 'react-router';
import {Header} from './pages/Header.tsx';
import {useLayoutEffect, useRef} from 'react';

export function Layout() {
    const headerRef = useRef<HTMLElement | null>(null);

    useLayoutEffect(() => {
        const el = headerRef.current;
        if (!el) return;

        const setVar = () => {
            const h = el.getBoundingClientRect().height;
            document.documentElement.style.setProperty('--app-header-height', `${h}px`);
        };

        setVar();

        const ro = new ResizeObserver(() => setVar());
        ro.observe(el);

        window.addEventListener('resize', setVar);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', setVar);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header ref={headerRef}/>
            <main>
                <Outlet/>
            </main>
        </div>
    );
}