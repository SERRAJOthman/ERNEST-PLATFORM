import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Github, ArrowRight, ShieldCheck, Zap, Globe, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
    const { signInWithGithub, signInWithEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await signInWithEmail(email, password);
        } catch (err: any) {
            console.error('Login failed:', err);
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGithubLogin = async () => {
        try {
            await signInWithGithub();
        } catch (err: any) {
            console.error('Login failed:', err);
            setError('GitHub connection failed. Check your configuration.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 mb-6 group hover:border-primary/50 transition-colors"
                    >
                        <Hexagon className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(0,217,255,0.5)] group-hover:scale-110 transition-transform" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2">ERNEST</h1>
                    <p className="text-primary font-medium tracking-[0.3em] uppercase text-xs">Context-Aware Core</p>
                </div>

                {/* Login Card */}
                <div className="glass rounded-[2rem] p-8 md:p-10 shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-2 text-center">Authentication</h2>
                        <p className="text-white/50 text-center text-sm mb-8">Secure access to the Command Center</p>

                        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                                        placeholder="agent@ernest.platform"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-rose-400 text-xs font-medium px-1"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-primary text-[#0a1628] rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(0,217,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initiate Login"}
                                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px flex-1 bg-white/5"></div>
                            <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">OR</span>
                            <div className="h-px flex-1 bg-white/5"></div>
                        </div>

                        <button
                            onClick={handleGithubLogin}
                            className="w-full h-12 bg-white/5 border border-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95 group mb-8"
                        >
                            <Github className="w-5 h-5" />
                            <span className="text-sm">Continue with GitHub</span>
                        </button>

                        {/* Feature Highlights */}
                        <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
                            <FeatureMini icon={ShieldCheck} label="Secure" />
                            <FeatureMini icon={Zap} label="Realtime" />
                            <FeatureMini icon={Globe} label="Global" />
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <p className="mt-10 text-center text-white/30 text-sm">
                    Protected by ERNEST Security Protocol v2.5
                </p>
            </motion.div>
        </div>
    );
};

const FeatureMini = ({ icon: Icon, label }: any) => (
    <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
            <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-medium text-white/30 uppercase tracking-tighter">{label}</span>
    </div>
);
