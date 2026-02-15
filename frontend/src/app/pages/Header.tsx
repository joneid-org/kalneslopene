import {Link} from "react-router";
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import {Button} from '@mui/material';
import {forwardRef} from 'react';

export const Header = forwardRef<HTMLElement>(function Header(_props, ref) {
    return (
        <header ref={ref} className="border-b bg-white sticky top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between container mx-auto px-4 py-4">
                <div>
                    <Link to="/" className="flex items-center gap-2">
                        <DirectionsRunIcon fontSize={'large'} color={'primary'}/>
                        <div>
                            <h1 className="font-bold text-xl">Torsdagsløpet</h1>
                            <p className="text-sm text-gray-600">Kalnesskogen | Torsdag kl 18:00</p>
                        </div>
                    </Link>
                </div>
                <nav className="flex gap-1">
                    <Link to="/"><Button>Hjem</Button></Link>
                    <Link to="/Resultater"><Button>Resultater</Button></Link>
                    <Link to="/Bilder"><Button>Bilder</Button></Link>
                    <Link to="/Statistikk"><Button>Statistikk</Button></Link>
                    <Link to="/Lopskalender"><Button>Løpskalender</Button></Link>
                    <Link to="/OmOss"><Button>Om oss</Button></Link>
                </nav>
            </div>
        </header>
    );
});