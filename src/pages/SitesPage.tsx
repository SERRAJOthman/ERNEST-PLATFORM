import { useState } from 'react';
import { Map, List, MapPin, ExternalLink, Users, Satellite, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export const SitesPage = () => {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    // 1. Fetch Real Sites Data
    const { data: sites = [], isLoading } = useQuery({
        queryKey: ['sites'],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from('sites')
                .select(`
                    *,
                    profiles:manager_id(full_name)
                `);
            if (error) throw error;
            return data;
        }
    });

    if (isLoading) return <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Operational Site Grid
                    </h1>
                    <p className="text-white/50 text-sm mt-1">Global site intelligence and manager dispatch</p>
                </motion.div>

                <div className="flex items-center gap-4 bg-[#0f172a]/50 p-1.5 rounded-2xl border border-white/10 shadow-inner">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-primary text-black shadow-[0_0_15px_rgba(0,217,255,0.4)]' : 'text-white/40 hover:text-white'}`}
                    >
                        <List className="w-4 h-4" /> List
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-primary text-black shadow-[0_0_15px_rgba(0,217,255,0.4)]' : 'text-white/40 hover:text-white'}`}
                    >
                        <Map className="w-4 h-4" /> Map
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl"
                    >
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-white/30 text-[10px] uppercase tracking-[0.2em] font-black">
                                    <th className="p-8">Identification</th>
                                    <th className="p-8">Geographic Data</th>
                                    <th className="p-8">Assigned Lead</th>
                                    <th className="p-8 text-center">Telemetry Status</th>
                                    <th className="p-8 text-right">Dispatch</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {sites.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center text-white/20 italic font-medium">
                                            No site entries detected in core database.
                                        </td>
                                    </tr>
                                ) : (
                                    sites.map((site: any) => (
                                        <tr key={site.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-colors">
                                                        <Activity className="w-6 h-6 text-primary group-hover:animate-pulse" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-lg">{site.name}</p>
                                                        <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold">UID: {site.id.slice(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
                                                        <MapPin className="w-4 h-4 text-primary" />
                                                        {site.address}
                                                    </div>
                                                    <p className="text-xs text-white/30 ml-6">{site.city || 'Satellite Locked'}</p>
                                                </div>
                                            </td>
                                            <td className="p-8 text-white/60">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-white/10 to-white/5 flex items-center justify-center text-xs font-black text-white border border-white/10">
                                                        {(site.profiles?.full_name || 'OS').match(/[A-Z]/g)?.join('')}
                                                    </div>
                                                    <span className="font-medium">{site.profiles?.full_name || 'Unassigned'}</span>
                                                </div>
                                            </td>
                                            <td className="p-8 text-center">
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 shadow-inner">
                                                    <span className={`w-2 h-2 rounded-full ${site.status === 'active' ? 'bg-success animate-pulse' : site.status === 'on_hold' ? 'bg-warning' : 'bg-blue-500'}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{site.status}</span>
                                                </div>
                                            </td>
                                            <td className="p-8 text-right">
                                                <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary hover:text-black flex items-center justify-center transition-all group/btn">
                                                    <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </motion.div>
                ) : (
                    <motion.div
                        key="map"
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="flex-1 min-h-[500px] bg-[#0f172a] rounded-[3rem] border border-white/5 flex items-center justify-center relative overflow-hidden group shadow-2xl"
                    >
                        {/* High-Fidelity Static Map Mock with dynamic markers */}
                        <div className="absolute inset-0 bg-[#0a1628]">
                            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-74.006,40.7128,4,0/1200x800?access_token=pk.mock')] bg-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-1000"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-[#0a1628]/80"></div>

                            {/* Scanning Ray effect */}
                            <motion.div
                                animate={{ y: ['0%', '100%', '0%'] }}
                                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                                className="absolute top-0 left-0 right-0 h-px bg-primary/20 shadow-[0_0_15px_rgba(0,217,255,0.5)] z-10"
                            />

                            {/* Dynamic Markers */}
                            <div className="relative w-full h-full">
                                {sites.slice(0, 5).map((site: any, i: number) => (
                                    <motion.div
                                        key={site.id}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        style={{
                                            position: 'absolute',
                                            left: `${20 + (i * 15)}%`,
                                            top: `${30 + (i * 10)}%`
                                        }}
                                        className="group/marker cursor-pointer z-20"
                                    >
                                        <div className="relative">
                                            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-0 group-hover/marker:opacity-100 transition-opacity" />
                                            <div className="w-4 h-4 bg-white rounded-full border-4 border-primary shadow-[0_0_10px_rgba(0,217,255,0.8)] relative z-10" />

                                            {/* Label */}
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-all translate-x-2 group-hover/marker:translate-x-0">
                                                <p className="text-[10px] font-black text-white uppercase tracking-tighter">{site.name}</p>
                                                <p className="text-[8px] text-primary font-bold">LOCKED • LIVE</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 p-8 flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
                                <Satellite className="w-10 h-10 text-primary animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-black text-white tracking-tighter mb-2">SAT-COMM INTERFACE</h3>
                            <p className="text-white/40 text-sm font-medium max-w-xs text-center leading-relaxed">
                                Real-time site telemetry is currently being mapped via secure orbital links.
                            </p>

                            <div className="mt-10 flex gap-10">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-white">{sites.length}</p>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Nodes Online</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-emerald-400">99.8%</p>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Signal Quality</p>
                                </div>
                            </div>
                        </div>

                        {/* HUD Elements */}
                        <div className="absolute top-8 left-8 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 space-y-2 pointer-events-none">
                            <div className="flex items-center gap-2">
                                <Activity className="w-3 h-3 text-primary" />
                                <span className="text-[8px] font-black uppercase text-white/70">Global Telemetry On</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-3 h-3 text-primary" />
                                <span className="text-[8px] font-black uppercase text-white/70">Lead Agent: SYSTEM</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
