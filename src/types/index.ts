import { Database } from './database';

export * from './database';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

export type Issue = Tables<'issues'>;
export type IssueCategory = Tables<'issue_categories'>;
export type IssueImage = Tables<'issue_images'>;
export type Profile = Tables<'profiles'>;
export type Provider = Tables<'providers'>;
export type Repair = Tables<'repairs'>;
export type Contribution = Tables<'contributions'>;
export type Verification = Tables<'verifications'>;
export type AuthorityDepartment = Tables<'authority_departments'>;
export type AuthorityCase = Tables<'authority_cases'>;
export type Notification = Tables<'notifications'>;
export type AuditLog = Tables<'audit_logs'>;

export type IssueStatus = Enums<'issue_status'>;
export type ResolutionType = Enums<'resolution_type'>;
export type IssueSeverity = Enums<'issue_severity'>;
export type UserRole = Enums<'user_role'>;
export type RepairStatus = Enums<'repair_status'>;
export type AuthorityCaseStatus = Enums<'authority_case_status'>;
export type SimulatedPayoutStatus = Enums<'simulated_payout_status'>;

export interface IssueWithDetails extends Issue {
  category?: IssueCategory | null;
  reporter?: Profile | null;
  images?: IssueImage[];
  contributions?: (Contribution & { contributor?: { full_name?: string | null; avatar_url?: string | null } | null })[];
  repair?: (Repair & { provider?: (Provider & { profile?: Profile | null }) | null }) | null;
  authority_case?: (AuthorityCase & { department?: AuthorityDepartment | null }) | null;
  verifications?: Verification[];
}
