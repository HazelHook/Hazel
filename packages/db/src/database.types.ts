export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
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
        Relationships: [
          {
            foreignKeyName: "api_keys_workspace_id_organizations_public_id_fk"
            columns: ["workspace_id"]
            referencedRelation: "organizations"
            referencedColumns: ["public_id"]
          }
        ]
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
          {
            foreignKeyName: "connections_workspace_id_organizations_public_id_fk"
            columns: ["workspace_id"]
            referencedRelation: "organizations"
            referencedColumns: ["public_id"]
          }
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
        Relationships: [
          {
            foreignKeyName: "destinations_workspace_id_organizations_public_id_fk"
            columns: ["workspace_id"]
            referencedRelation: "organizations"
            referencedColumns: ["public_id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "integrations_workspace_id_organizations_public_id_fk"
            columns: ["workspace_id"]
            referencedRelation: "organizations"
            referencedColumns: ["public_id"]
          }
        ]
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
          }
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          organization_id: number
          public_id: string
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          organization_id: number
          public_id: string
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          organization_id?: number
          public_id?: string
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_organizations_id_fk"
            columns: ["organization_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_users_id_fk"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      organizations: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          name: string
          owner_id: string
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
          {
            foreignKeyName: "sources_workspace_id_organizations_public_id_fk"
            columns: ["workspace_id"]
            referencedRelation: "organizations"
            referencedColumns: ["public_id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          name: string | null
          onboarded: boolean
          profile_image: string | null
        }
        Insert: {
          id: string
          name?: string | null
          onboarded?: boolean
          profile_image?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          onboarded?: boolean
          profile_image?: string | null
        }
        Relationships: []
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
