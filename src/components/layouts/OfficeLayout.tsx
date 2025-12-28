import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Briefcase, ChartLine, ShieldCheck, Hexagon, Bell, Search, Menu, Map } from 'lucide-react';

export const OfficeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#0a1628] text-white selection:bg-primary/30">
            {/* Sidebar (Desktop) */}
            <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-72 bg-[#0f172a]/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-20 hidden md:flex"
            >
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-1">
                        <Hexagon className="w-8 h-8 text-primary drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]" strokeWidth={1.5} />
                        <h1 className="text-2xl font-bold tracking-tight">ERNEST</h1>
                    </div>
                    <p className="text-xs text-primary font-medium tracking-[0.2em] uppercase pl-11">Proactive Office</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavItem to="/" icon={LayoutGrid} label="Dashboard" active={location.pathname === '/'} />
                    <NavItem to="/projects" icon={Briefcase} label="Projects" active={location.pathname === '/projects'} />
                    <NavItem to="/financials" icon={ChartLine} label="Financials" active={location.pathname === '/financials'} />
                    <NavItem to="/compliance" icon={ShieldCheck} label="Compliance" active={location.pathname === '/compliance'} />
                    <NavItem to="/sites" icon={Map} label="View All Sites" active={location.pathname === '/sites'} />
                </nav>

                <div className="p-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center font-bold text-sm">
                            OS
                        </div>
                        <div>
                            <div className="text-sm font-medium">Othman Serraj</div>
                            <div className="text-xs text-white/50">Superintendent</div>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Sidebar (Slide-over) */}
            <div className={`fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}>
                <div className={`w-64 h-full bg-[#0f172a] p-4 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
                    <nav className="space-y-4 mt-12">
                        <NavItem to="/" icon={LayoutGrid} label="Dashboard" active={location.pathname === '/'} />
                        <NavItem to="/projects" icon={Briefcase} label="Projects" active={location.pathname === '/projects'} />
                        <NavItem to="/financials" icon={ChartLine} label="Financials" active={location.pathname === '/financials'} />
                        <NavItem to="/compliance" icon={ShieldCheck} label="Compliance" active={location.pathname === '/compliance'} />
                        <NavItem to="/sites" icon={Map} label="View All Sites" active={location.pathname === '/sites'} />
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_70%,transparent_100%)] pointer-events-none"></div>

                {/* Top Bar */}
                <header className="h-20 flex items-center justify-between px-8 z-10">
                    <div className="md:hidden">
                        <button onClick={() => setIsSidebarOpen(true)}>
                            <Menu className="w-6 h-6 text-white/70" />
                        </button>
                    </div>

                    {/* Page Title / Breadcrumb (Left aligned on Desktop) */}
                    <div className="hidden md:block">
                        <h2 className="text-sm font-medium text-white/50 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                            Pages / <span className="text-white">{location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2)}</span>
                        </h2>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center gap-4 bg-white/5 rounded-full px-4 py-2 border border-white/10 focus-within:border-primary/50 transition-colors w-96">
                        <Search className="w-4 h-4 text-white/50" />
                        <input
                            type="text"
                            placeholder="Search projects, documents, or insights..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-white/30"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative group">
                            <Bell className="w-5 h-5 text-white/70 group-hover:text-primary transition-colors" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full animate-pulse"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 z-10 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
};

const NavItem = ({ icon: Icon, label, active, to }: { icon: any, label: string, active?: boolean, to: string }) => (
    <Link to={to} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${active
        ? 'bg-primary/10 text-primary border-l-2 border-primary'
        : 'text-text-secondary hover:text-white hover:bg-white/5 hover:translate-x-1'
        }`}>
        <Icon className={`w-5 h-5 ${active ? 'drop-shadow-[0_0_8px_rgba(0,217,255,0.5)]' : 'group-hover:text-primary'}`} />
        <span className="font-medium text-sm">{label}</span>
    </Link>
);
