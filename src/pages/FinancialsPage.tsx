import { DollarSign, TrendingUp, TrendingDown, PieChart, ArrowUpRight, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export const FinancialsPage = () => {
    // 1. Fetch Financial Data
    const { data: financials = [], isLoading } = useQuery({
        queryKey: ['financials'],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from('financials')
                .select(`
                    *,
                    projects:project_id(name)
                `);
            if (error) throw error;
            return data;
        }
    });

    // 2. Aggregate Totals
    const totalBudget = financials.reduce((acc: number, f: any) => acc + Number(f.total_budget), 0);
    const totalSpent = financials.reduce((acc: number, f: any) => acc + Number(f.spent_ytd), 0);
    const totalVariance = financials.reduce((acc: number, f: any) => acc + Number(f.variance), 0);
    const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    if (isLoading) return <div className="animate-pulse space-y-8">
        <div className="h-20 bg-white/5 rounded-2xl w-1/3"></div>
        <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white/5 rounded-2xl"></div>)}
        </div>
    </div>;

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Financial Performance
                </h1>
                <p className="text-white/50 text-sm mt-1">Real-time budget tracking and forecasting across all sites</p>
            </motion.div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FinancialCard
                    title="Total Group Budget"
                    value={`$${totalBudget.toLocaleString()}`}
                    sub={`${financials.length} Projects Tracked`}
                    icon={DollarSign}
                    color="text-emerald-500"
                    trend="On Track"
                    isPositive={true}
                />
                <FinancialCard
                    title="Utilized YTD"
                    value={`$${totalSpent.toLocaleString()}`}
                    sub={`${utilization.toFixed(1)}% of total`}
                    icon={PieChart}
                    color="text-amber-500"
                    trend="Normal Velocity"
                />
                <FinancialCard
                    title="Net Variance"
                    value={`$${totalVariance.toLocaleString()}`}
                    sub="Across categories"
                    icon={totalVariance < 0 ? TrendingDown : TrendingUp}
                    color={totalVariance < 0 ? "text-rose-500" : "text-emerald-500"}
                    trend={totalVariance < 0 ? "Over Budget" : "Under Budget"}
                    isPositive={totalVariance >= 0}
                />
            </div>

            {/* Project Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#0f172a]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" /> Project Allocations
                        </h3>
                    </div>
                    <div className="p-6">
                        {financials.length === 0 ? (
                            <div className="text-center py-12 text-white/30 italic">No financial data available. Add entries to the ledger.</div>
                        ) : (
                            <div className="space-y-6">
                                {financials.map((f: any) => (
                                    <div key={f.id} className="group">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{f.projects?.name}</p>
                                                <p className="text-[10px] text-white/40 uppercase tracking-widest">{f.status}</p>
                                            </div>
                                            <p className="text-sm font-mono text-white/80">${Number(f.spent_ytd).toLocaleString()} / ${Number(f.total_budget).toLocaleString()}</p>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(Number(f.spent_ytd) / Number(f.total_budget)) * 100}%` }}
                                                className={`h-full ${f.status === 'over_budget' ? 'bg-rose-500' : 'bg-primary'}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 text-center">
                        <BarChart3 className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <h4 className="text-lg font-bold mb-2">Financial Insights</h4>
                        <p className="text-sm text-white/50 leading-relaxed">
                            Based on current velocity, you are projected to finish the quarter
                            <span className="text-emerald-400 font-bold mx-1">2.4% under budget</span>.
                        </p>
                        <button className="mt-8 text-xs font-bold text-primary flex items-center gap-2 mx-auto hover:text-white transition-colors group">
                            Download Ledger Report <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FinancialCard = ({ title, value, sub, icon: Icon, color, trend, isPositive }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-[#0f172a]/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon className="w-16 h-16" />
        </div>
        <div className="flex items-center gap-4 mb-4">
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-white/60 tracking-tight">{title}</h3>
        </div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <div className="flex items-center justify-between">
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{sub}</p>
            <div className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {trend}
            </div>
        </div>
    </motion.div>
);
