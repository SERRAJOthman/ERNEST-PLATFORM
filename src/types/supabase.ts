export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    role: 'admin' | 'office_manager' | 'field_technician' | 'client'
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    role?: 'admin' | 'office_manager' | 'field_technician' | 'client'
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    role?: 'admin' | 'office_manager' | 'field_technician' | 'client'
                    created_at?: string
                }
            }
            projects: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    status: 'draft' | 'active' | 'completed' | 'archived'
                    client_id: string | null
                    created_at: string
                    updated_at: string
                    hero_image?: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    status?: 'draft' | 'active' | 'completed' | 'archived'
                    client_id?: string | null
                    created_at?: string
                    updated_at?: string
                    hero_image?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    status?: 'draft' | 'active' | 'completed' | 'archived'
                    client_id?: string | null
                    created_at?: string
                    updated_at?: string
                    hero_image?: string
                }
            }
            chrono_threads: {
                Row: {
                    id: string
                    project_id: string
                    entity_type: string
                    entity_id: string | null
                    title: string
                    current_state: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    project_id: string
                    entity_type: string
                    entity_id?: string | null
                    title: string
                    current_state?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string
                    entity_type?: string
                    entity_id?: string | null
                    title?: string
                    current_state?: Json | null
                    created_at?: string
                }
            }
            chrono_events: {
                Row: {
                    id: string
                    thread_id: string
                    event_type: string
                    payload: Json
                    actor_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    thread_id: string
                    event_type: string
                    payload: Json
                    actor_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    thread_id?: string
                    event_type?: string
                    payload?: Json
                    actor_id?: string | null
                    created_at?: string
                }
            }
        }
    }
}
