import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';



export const useActiveProjects = () => {
    return useQuery({
        queryKey: ['active-projects'],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from('projects')
                .select(`
          *,
          chrono_threads(count)
        `)
                .eq('status', 'active')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });
};

export const usePulseStream = () => {
    return useQuery({
        queryKey: ['pulse-stream'],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from('chrono_events')
                .select(`
          *,
          profiles:actor_id(full_name),
          chrono_threads:thread_id(
            title,
            projects:project_id(name)
          )
        `)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;

            // Flatten for UI
            return data.map((evt: any) => ({
                ...evt,
                actor_name: evt.profiles?.full_name || 'Unknown',
                project_name: evt.chrono_threads?.projects?.name || 'Unknown',
                thread_title: evt.chrono_threads?.title || 'Unknown'
            }));
        }
    });
};

export const useMetrics = () => {
    return useQuery({
        queryKey: ['dashboard-metrics'],
        queryFn: async () => {
            // 1. Active Projects Count
            const { count: projectCount } = await (supabase as any)
                .from('projects')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');

            // 2. Financial Pulse
            const { data: financials } = await (supabase as any)
                .from('financials')
                .select('status');

            const onTrackCount = financials?.filter((f: any) => f.status === 'on_track').length || 0;
            const healthPercent = financials?.length ? (onTrackCount / financials.length) * 100 : 100;

            return {
                activeProjects: projectCount || 0,
                financialHealth: Math.round(healthPercent),
                complianceRisk: 'Low'
            };
        }
    });
};

export const useRealtimeSubscription = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const channel = supabase
            .channel('dashboard-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chrono_events' },
                (payload) => {
                    console.log('New Event:', payload);
                    queryClient.invalidateQueries({ queryKey: ['pulse-stream'] });
                    // Optionally trigger toast here
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'projects' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['active-projects'] });
                    queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);
};
