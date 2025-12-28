import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';

export const FinancialsPage = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Financial Performance
                </h1>
                <p className="text-white/50 text-sm mt-1">Real-time budget tracking and forecasting</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-white/90">Total Budget</h3>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">$4,250,000</p>
                    <div className="flex items-center text-xs text-emerald-400">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>On Track</span>
                    </div>
                </div>

                <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                            <PieChart className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-white/90">Spent YTD</h3>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">$1,850,000</p>
                    <div className="flex items-center text-xs text-white/40">
                        <span>43.5% Utilized</span>
                    </div>
                </div>

                <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-white/90">Variance</h3>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">-$12,500</p>
                    <div className="flex items-center text-xs text-rose-400">
                        <span>Over Budget in Material</span>
                    </div>
                </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 h-96 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-white/30 font-medium">Detailed Cash Flow Visuals Coming Soon</p>
            </div>
        </div>
    );
};
