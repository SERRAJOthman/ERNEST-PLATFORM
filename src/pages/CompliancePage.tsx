import { ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

export const CompliancePage = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Compliance & Safety
                </h1>
                <p className="text-white/50 text-sm mt-1">Audit logs, certifications, and safety reports</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Certifications */}
                <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" /> Certifications
                        </h3>
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">All Valid</span>
                    </div>
                    <div className="p-6 space-y-4">
                        {[
                            { name: 'ISO 9001:2015', expiry: 'Dec 2026' },
                            { name: 'OSHA 30-Hour', expiry: 'Aug 2025' },
                            { name: 'Electrical Safety v4', expiry: 'Mar 2025' }
                        ].map((cert, i) => (
                            <div key={i} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors">
                                <span className="text-sm text-white/80">{cert.name}</span>
                                <span className="text-xs text-white/40">Expires {cert.expiry}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Incidents */}
                <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" /> Recent Reports
                        </h3>
                        <button className="text-xs text-primary hover:text-primary/80">View All</button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex gap-4 items-start p-3 bg-white/5 rounded-lg border-l-2 border-amber-500">
                            <FileText className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-white">Minor Safety Hazard</h4>
                                <p className="text-xs text-white/50 mt-1">Reported by Field Team A at Site 4. Loose cabling in corridor.</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">Pending Review</span>
                                    <span className="text-[10px] text-white/30">2h ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
