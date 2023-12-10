import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { apiKeys } from "./api_keys"
import { connection } from "./connections"
import { destination } from "./destinations"
import { integration } from "./integrations"
import { organizations, organizationInvites, organizationMembers } from "./organizations"
import { source } from "./sources"
import { user } from "./users"

export type InsertSource = InferInsertModel<typeof source>
export type Source = InferSelectModel<typeof source>

export type InsertOrganization = InferInsertModel<typeof organizations>
export type Organization = InferSelectModel<typeof organizations>

export type InsertOrganizationInvite = InferInsertModel<typeof organizationInvites>
export type OrganizationInvite = InferSelectModel<typeof organizationInvites>

export type InsertOrganizationMember = InferInsertModel<typeof organizationMembers>
export type OrganizationMember = InferSelectModel<typeof organizationMembers>

export type InsertIntegration = InferInsertModel<typeof integration>
export type Integration = InferSelectModel<typeof integration>

export type InsertDestination = InferInsertModel<typeof destination>
export type Destination = InferSelectModel<typeof destination>

export type InsertConnection = InferInsertModel<typeof connection>
export type Connection = InferSelectModel<typeof connection>

export type InsertApiKey = InferInsertModel<typeof apiKeys>
export type ApiKey = InferSelectModel<typeof apiKeys>

export type InsertUser = InferInsertModel<typeof user>
export type User = InferSelectModel<typeof user>
