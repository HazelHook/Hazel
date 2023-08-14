export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
	public: {
		Tables: {
			api_keys: {
				Row: {
					created_at: string
					deleted_at: string | null
					expires: string | null
					id: number
					name: string | null
					owner_id: string | null
					public_id: string
					updated_at: string
					workspace_id: string
				}
				Insert: {
					created_at?: string
					deleted_at?: string | null
					expires?: string | null
					id?: number
					name?: string | null
					owner_id?: string | null
					public_id: string
					updated_at?: string
					workspace_id: string
				}
				Update: {
					created_at?: string
					deleted_at?: string | null
					expires?: string | null
					id?: number
					name?: string | null
					owner_id?: string | null
					public_id?: string
					updated_at?: string
					workspace_id?: string
				}
				Relationships: []
			}
			connections: {
				Row: {
					created_at: string
					delay: number | null
					deleted_at: string | null
					destination_id: number
					enabled: boolean
					flux_config: Json | null
					id: number
					name: string
					public_id: string
					retry_count: number | null
					retry_delay: number | null
					retry_type: string | null
					source_id: number
					updated_at: string
					workspace_id: string
				}
				Insert: {
					created_at?: string
					delay?: number | null
					deleted_at?: string | null
					destination_id: number
					enabled?: boolean
					flux_config?: Json | null
					id?: number
					name: string
					public_id: string
					retry_count?: number | null
					retry_delay?: number | null
					retry_type?: string | null
					source_id: number
					updated_at?: string
					workspace_id: string
				}
				Update: {
					created_at?: string
					delay?: number | null
					deleted_at?: string | null
					destination_id?: number
					enabled?: boolean
					flux_config?: Json | null
					id?: number
					name?: string
					public_id?: string
					retry_count?: number | null
					retry_delay?: number | null
					retry_type?: string | null
					source_id?: number
					updated_at?: string
					workspace_id?: string
				}
				Relationships: [
					{
						foreignKeyName: "connections_destination_id_destinations_id_fk"
						columns: ["destination_id"]
						referencedRelation: "destinations"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "connections_source_id_sources_id_fk"
						columns: ["source_id"]
						referencedRelation: "sources"
						referencedColumns: ["id"]
					},
				]
			}
			destinations: {
				Row: {
					created_at: string
					deleted_at: string | null
					id: number
					name: string
					public_id: string
					updated_at: string
					url: string
					websocket_connection: boolean
					workspace_id: string
				}
				Insert: {
					created_at?: string
					deleted_at?: string | null
					id?: number
					name: string
					public_id: string
					updated_at?: string
					url: string
					websocket_connection?: boolean
					workspace_id: string
				}
				Update: {
					created_at?: string
					deleted_at?: string | null
					id?: number
					name?: string
					public_id?: string
					updated_at?: string
					url?: string
					websocket_connection?: boolean
					workspace_id?: string
				}
				Relationships: []
			}
			integrations: {
				Row: {
					config: Json | null
					created_at: string
					deleted_at: string | null
					id: number
					name: string
					public_id: string
					tool: string | null
					updated_at: string
					workspace_id: string
				}
				Insert: {
					config?: Json | null
					created_at?: string
					deleted_at?: string | null
					id?: number
					name: string
					public_id: string
					tool?: string | null
					updated_at?: string
					workspace_id: string
				}
				Update: {
					config?: Json | null
					created_at?: string
					deleted_at?: string | null
					id?: number
					name?: string
					public_id?: string
					tool?: string | null
					updated_at?: string
					workspace_id?: string
				}
				Relationships: []
			}
			organization_invites: {
				Row: {
					created_at: string
					email: string
					id: number
					organization_id: number
					public_id: string
					revoked_at: string | null
					role: string | null
				}
				Insert: {
					created_at?: string
					email: string
					id?: number
					organization_id: number
					public_id: string
					revoked_at?: string | null
					role?: string | null
				}
				Update: {
					created_at?: string
					email?: string
					id?: number
					organization_id?: number
					public_id?: string
					revoked_at?: string | null
					role?: string | null
				}
				Relationships: [
					{
						foreignKeyName: "organization_invites_organization_id_organizations_id_fk"
						columns: ["organization_id"]
						referencedRelation: "organizations"
						referencedColumns: ["id"]
					},
				]
			}
			organization_members: {
				Row: {
					created_at: string
					customer_id: string
					deleted_at: string | null
					id: number
					organization_id: number
					public_id: string
					role: string | null
					updated_at: string
				}
				Insert: {
					created_at?: string
					customer_id: string
					deleted_at?: string | null
					id?: number
					organization_id: number
					public_id: string
					role?: string | null
					updated_at?: string
				}
				Update: {
					created_at?: string
					customer_id?: string
					deleted_at?: string | null
					id?: number
					organization_id?: number
					public_id?: string
					role?: string | null
					updated_at?: string
				}
				Relationships: [
					{
						foreignKeyName: "organization_members_organization_id_organizations_id_fk"
						columns: ["organization_id"]
						referencedRelation: "organizations"
						referencedColumns: ["id"]
					},
				]
			}
			organizations: {
				Row: {
					created_at: string
					deleted_at: string | null
					id: number
					name: string
					owner_id: string
					personal: boolean
					plan: string | null
					public_id: string
					updated_at: string
				}
				Insert: {
					created_at?: string
					deleted_at?: string | null
					id?: number
					name: string
					owner_id: string
					personal?: boolean
					plan?: string | null
					public_id: string
					updated_at?: string
				}
				Update: {
					created_at?: string
					deleted_at?: string | null
					id?: number
					name?: string
					owner_id?: string
					personal?: boolean
					plan?: string | null
					public_id?: string
					updated_at?: string
				}
				Relationships: []
			}
			sources: {
				Row: {
					created_at: string
					deleted_at: string | null
					id: number
					integration_id: number | null
					name: string
					public_id: string
					updated_at: string
					url: string | null
					workspace_id: string
				}
				Insert: {
					created_at?: string
					deleted_at?: string | null
					id?: number
					integration_id?: number | null
					name: string
					public_id: string
					updated_at?: string
					url?: string | null
					workspace_id: string
				}
				Update: {
					created_at?: string
					deleted_at?: string | null
					id?: number
					integration_id?: number | null
					name?: string
					public_id?: string
					updated_at?: string
					url?: string | null
					workspace_id?: string
				}
				Relationships: [
					{
						foreignKeyName: "sources_integration_id_integrations_id_fk"
						columns: ["integration_id"]
						referencedRelation: "integrations"
						referencedColumns: ["id"]
					},
				]
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}
