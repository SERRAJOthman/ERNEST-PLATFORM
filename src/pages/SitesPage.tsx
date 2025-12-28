import { useState } from 'react';
import { Map, List, MapPin, ExternalLink } from 'lucide-react';

export const SitesPage = () => {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    const sites = [
        { id: 1, name: 'Downtown HQ Renovation', address: '1200 Main St, Cityville', manager: 'Sarah J.', status: 'Active' },
        { id: 2, name: 'Westside Logistics Center', address: '4500 Industrial Pkwy', manager: 'Mike R.', status: 'On Hold' },
        { id: 3, name: 'North Lake Residential', address: '88 Lakeview Dr', manager: 'Othman S.', status: 'Completing' },
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        All Sites
                    </h1>
                    <p className="text-white/50 text-sm mt-1">Global view of all active locations</p>
                </div>

                <div className="flex items-center gap-4 bg-[#0f172a]/50 p-1 rounded-lg border border-white/10">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        <List className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        <Map className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                                <th className="p-6 font-medium">Site Name</th>
                                <th className="p-6 font-medium">Location</th>
                                <th className="p-6 font-medium">Manager</th>
                                <th className="p-6 font-medium">Status</th>
                                <th className="p-6 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {sites.map(site => (
                                <tr key={site.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-6 font-medium text-white">{site.name}</td>
                                    <td className="p-6 text-white/60">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary/50" />
                                            {site.address}
                                        </div>
                                    </td>
                                    <td className="p-6 text-white/60">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">
                                                {site.manager.match(/[A-Z]/g)?.join('')}
                                            </div>
                                            {site.manager}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                            ${site.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                                                site.status === 'On Hold' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-blue-500/20 text-blue-400'}`}>
                                            {site.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="text-white/20 hover:text-primary transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex-1 bg-[#0f172a] rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-74.006,40.7128,12,0/800x600?access_token=pk.mock')] bg-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700"></div>
                    <div className="relative z-10 bg-black/80 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 text-center">
                        <MapPin className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
                        <p className="text-white font-bold">Interactive Map Module</p>
                        <p className="text-white/50 text-xs">Awaiting API Key</p>
                    </div>
                </div>
            )}
        </div>
    );
};
