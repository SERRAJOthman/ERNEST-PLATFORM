import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle, AlertTriangle, Calendar, Zap, Clock, TrendingUp, Building, ShieldCheck } from 'lucide-react';
import { useActiveProjects, useMetrics, usePulseStream, useRealtimeSubscription } from '../hooks/useSupabaseData';
import { formatDistanceToNow } from 'date-fns';

export const Dashboard: React.FC = () => {
    // 1. Hook into Real-time Supabase Data
    useRealtimeSubscription();

    // 2. Fetch Data
    const { data: projects, isLoading: projectsLoading } = useActiveProjects();
    const { data: metrics, isLoading: metricsLoading } = useMetrics();
    const { data: pulses, isLoading: pulsesLoading } = usePulseStream();

    // 3. Fallback / Loading States would go here, but for smooth UI we render skeletons or defaults
    const activeCount = metrics?.activeProjects ?? 0;
    const health = metrics?.financialHealth ?? 96;
    const risk = metrics?.complianceRisk ?? 'Low';

    return (
        <div className="space-y-8 pb-10">
            {/* Header Text */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent mb-2">
                    Proactive Office View
                </h2>
                <p className="text-text-secondary flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                    Context: Financials & Safety Compliance
                </p>
            </motion.div>

            {/* Hero Section */}
            <HeroSection />

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Active Projects"
                    value={metricsLoading ? "..." : activeCount.toString()}
                    subtitle="Across all sites"
                    icon={Building}
                    color="text-primary"
                    delay={0.2}
                />
                <MetricCard
                    title="Financial Health"
                    value={metricsLoading ? "..." : `${health}%`}
                    subtitle="Near ideal Chronic Index"
                    icon={TrendingUp}
                    color="text-success"
                    delay={0.3}
                />
                <MetricCard
                    title="Compliance Risk"
                    value={metricsLoading ? "..." : risk}
                    subtitle="Based on recent inspections"
                    icon={ShieldCheck}
                    color="text-primary"
                    delay={0.4}
                />
            </div>

            {/* Live Feeds Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
            >
                <div className="flex justify-between items-end">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-danger"></span>
                        </span>
                        Live Project Feeds
                    </h3>
                    <button className="text-xs font-semibold text-primary hover:text-white transition-colors uppercase tracking-wider">View All Sites</button>
                </div>

                {/* Dynamic Projects Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {projectsLoading && <div className="text-white/50">Loading live sites...</div>}

                    {projects?.slice(0, 3).map((project: any, idx: number) => (
                        <ProjectCard
                            key={project.id}
                            image={project.hero_image || `/assets/project_${idx % 2 === 0 ? 'alpha' : 'beta'}.png`}
                            title={project.name}
                            location={project.description || "Active Site"}
                            status="On Schedule" // dynamic calculation in a real app
                            progress={Math.floor(Math.random() * 40) + 40} // mock progress for demo if not in DB
                        />
                    ))}

                    {/* Fallback if no projects */}
                    {!projectsLoading && (!projects || projects.length === 0) && (
                        <div className="col-span-3 text-center py-10 glass rounded-xl text-white/50">
                            No active projects found. Initialize database to see live data.
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Pulse Stream */}
            <div className="glass rounded-2xl p-6 md:p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-warning" />
                    Pulse Stream
                </h3>
                <div className="space-y-6 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-white/10"></div>

                    {pulsesLoading && <div className="pl-10 text-white/50">Listening for events...</div>}

                    {pulses?.map((evt: any) => (
                        <PulseItem
                            key={evt.id}
                            time={formatDistanceToNow(new Date(evt.created_at), { addSuffix: true })}
                            title={`${evt.thread_title}: ${JSON.stringify(evt.payload).slice(0, 50)}...`}
                            tag={evt.event_type}
                            color="text-primary"
                            icon={evt.event_type === 'alert' ? AlertTriangle : CheckCircle}
                        />
                    ))}

                    {/* Show Mock items only if DB is empty to showcase UI */}
                    {!pulsesLoading && (!pulses || pulses.length === 0) && (
                        <>
                            <PulseItem
                                time="Just now"
                                title="System: Connected to Supabase Realtime"
                                tag="System"
                                color="text-success"
                                icon={Zap}
                            />
                            <div className="pl-10 text-sm text-white/30 italic">
                                Waiting for new events...
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Sub-components ---

const HeroSection = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="relative h-80 rounded-3xl overflow-hidden group shadow-2xl shadow-black/50"
    >
        <img
            src="/assets/hero_bg.png"
            alt="Hero Construction"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent opacity-90"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end">
            <div>
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl font-bold text-white mb-2"
                >
                    Morning, Superintendent!
                </motion.h2>
                <div className="flex items-center gap-6 text-sm font-medium text-white/80">
                    <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                        <CheckCircle className="w-4 h-4 text-success" /> All systems nominal
                    </span>
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" /> Dec 28, 2025
                    </span>
                </div>
            </div>
            <div className="hidden md:block text-right">
                <div className="text-4xl font-bold text-white">72°F</div>
                <div className="text-white/60 text-sm">Partly Cloudy</div>
            </div>
        </div>
    </motion.div>
);

const MetricCard = ({ title, value, subtitle, icon: Icon, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -5, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)' }}
        className="glass p-6 rounded-2xl relative overflow-hidden group cursor-pointer"
    >
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500"></div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
            </div>
            <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 mb-1">
                {value}
            </div>
            <div className="text-sm text-text-secondary font-medium">{title}</div>
            <div className="text-xs text-white/40 mt-1">{subtitle}</div>
        </div>
    </motion.div>
);

const ProjectCard = ({ image, title, location, status, progress }: any) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-white/5"
    >
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent"></div>

        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-success border border-success/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
            {status}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <div className="text-xs text-primary uppercase tracking-wider font-bold mb-1">{location}</div>
            <h4 className="text-xl font-bold text-white mb-3">{title}</h4>

            <div className="space-y-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                <div className="flex justify-between text-xs text-white/70">
                    <span>Construct. Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-primary to-blue-500"
                    ></motion.div>
                </div>
            </div>
        </div>
    </motion.div>
);

const PulseItem = ({ time, title, tag, color, icon: IconComponent }: any) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative flex gap-4 items-start pl-2 group"
    >
        <div className="absolute left-[11px] top-1 w-2.5 h-2.5 rounded-full bg-[#0a1628] border-2 border-white/20 group-hover:border-primary group-hover:scale-125 transition-all z-10"></div>
        <div className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-xl transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-2">
                <div className={`flex items-center gap-2 text-xs font-mono opacity-60`}>
                    {IconComponent ? <IconComponent className="w-3 h-3" /> : <Clock className="w-3 h-3" />} {time}
                </div>
                <div className={`text-xs font-bold px-2 py-0.5 rounded-md bg-white/5 ${color} border border-white/5`}>
                    {tag}
                </div>
            </div>
            <p className="font-medium text-sm leading-snug">{title}</p>
        </div>
    </motion.div>
);
