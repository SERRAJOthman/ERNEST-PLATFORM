import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, MapPin, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

// --- Types ---
type ProjectStatus = 'draft' | 'active' | 'completed' | 'archived';

interface Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    updated_at: string;
    assignee?: string; // Mock for now
    priority?: 'High' | 'Normal' | 'Low'; // Mock for now
}

const COLUMNS: { id: ProjectStatus; title: string; color: string }[] = [
    { id: 'draft', title: 'To Do / Draft', color: 'bg-white/10' },
    { id: 'active', title: 'In Progress', color: 'bg-primary/20' },
    { id: 'completed', title: 'Completed', color: 'bg-success/20' },
];

export const ProjectsPage = () => {
    const queryClient = useQueryClient();

    // 1. Fetch Projects
    const { data: projects = [] } = useQuery({
        queryKey: ['all-projects'],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from('projects')
                .select('*')
                .order('updated_at', { ascending: false });
            if (error) throw error;
            return data as Project[];
        }
    });

    // 2. Mutation for Drag & Drop
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: ProjectStatus }) => {
            const { error } = await (supabase as any)
                .from('projects')
                .update({ status })
                .eq('id', id);
            if (error) throw error;
        },
        onMutate: async ({ id, status }) => {
            // Optimistic Update
            await queryClient.cancelQueries({ queryKey: ['all-projects'] });
            const previousProjects = queryClient.getQueryData(['all-projects']);
            queryClient.setQueryData(['all-projects'], (old: Project[]) =>
                old.map(p => p.id === id ? { ...p, status } : p)
            );
            return { previousProjects };
        },
        onError: (_err, _newTodo, context: any) => {
            queryClient.setQueryData(['all-projects'], context.previousProjects);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['all-projects'] });
        }
    });

    // 3. Drag Handler
    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        const newStatus = destination.droppableId as ProjectStatus;
        updateStatusMutation.mutate({ id: draggableId, status: newStatus });
    };

    // 4. Group Projects by Column
    const getProjectsByStatus = (status: ProjectStatus) => {
        return projects.filter(p => (p.status || 'draft') === status);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Project Dispatch
                    </h1>
                    <p className="text-white/50 text-sm mt-1">Manage active sites and work orders</p>
                </div>
                <button
                    onClick={() => alert("Create Modal Placeholder")}
                    className="bg-primary hover:bg-primary/80 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(0,217,255,0.3)]"
                >
                    <Plus className="w-5 h-5" /> New Project
                </button>
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                    <div className="flex h-full gap-6 min-w-max">
                        {COLUMNS.map(col => (
                            <div key={col.id} className="w-80 flex flex-col h-full bg-[#0f172a]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
                                {/* Column Header */}
                                <div className={`p-4 border-b border-white/5 flex justify-between items-center ${col.color}`}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${col.id === 'active' ? 'bg-primary animate-pulse' : 'bg-white/20'}`}></div>
                                        <h3 className="font-bold text-white/90">{col.title}</h3>
                                        <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full text-white/70">
                                            {getProjectsByStatus(col.id).length}
                                        </span>
                                    </div>
                                </div>

                                {/* Droppable Area */}
                                <Droppable droppableId={col.id}>
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="flex-1 overflow-y-auto p-4 space-y-3"
                                        >
                                            {getProjectsByStatus(col.id).map((project, index) => (
                                                <Draggable key={project.id} draggableId={project.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                opacity: snapshot.isDragging ? 0.8 : 1
                                                            }}
                                                            className="bg-[#1e293b]/80 p-4 rounded-xl border border-white/5 shadow-sm hover:border-primary/50 group select-none transition-colors"
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide bg-white/5 text-white/60`}>
                                                                    Normal
                                                                </span>
                                                                <button className="text-white/20 hover:text-white transition-colors">
                                                                    <MoreHorizontal className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <h4 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">{project.name}</h4>
                                                            <div className="flex items-center gap-1 text-xs text-white/50 mb-3">
                                                                <MapPin className="w-3 h-3" />
                                                                {project.description || "Unscheduled"}
                                                            </div>

                                                            <div className="border-t border-white/5 pt-3 flex justify-between items-center text-xs text-white/40">
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {project.updated_at ? formatDistanceToNow(new Date(project.updated_at), { addSuffix: true }) : 'N/A'}
                                                                </div>
                                                                {/* Mock Avatar */}
                                                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                                                                    OS
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
};
