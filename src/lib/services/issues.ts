import { supabase } from '@/lib/supabase/client';
import { IssueWithDetails, Issue, IssueCategory } from '@/types';

export async function getIssues(): Promise<IssueWithDetails[]> {
  const { data, error } = await supabase
    .from('issues')
    .select(`
      *,
      category:issue_categories(*),
      reporter:profiles(*),
      repair:repairs(
        *,
        provider:providers(*)
      ),
      authority_case:authority_cases(
        *,
        department:authority_departments(*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching issues:', error);
    return [];
  }

  return (data as unknown as IssueWithDetails[]) || [];
}

export async function getIssueById(id: string): Promise<IssueWithDetails | null> {
  const { data, error } = await supabase
    .from('issues')
    .select(`
      *,
      category:issue_categories(*),
      reporter:profiles(*),
      images:issue_images(*),
      contributions:contributions(
        *,
        contributor:profiles(full_name, avatar_url)
      ),
      repair:repairs(
        *,
        provider:providers(*)
      ),
      authority_case:authority_cases(
        *,
        department:authority_departments(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching issue by id:', error);
    return null;
  }

  // Also fetch verifications if repair exists
  const issue = data as unknown as IssueWithDetails;
  if (issue.repair?.id) {
    const { data: verifications } = await supabase
      .from('verifications')
      .select('*')
      .eq('repair_id', issue.repair.id);
    issue.verifications = verifications || [];
  }

  return issue;
}

export async function getCategories(): Promise<IssueCategory[]> {
  const { data, error } = await supabase
    .from('issue_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export async function createIssueReport(params: {
  title: string;
  description: string;
  category_id?: string;
  latitude: number;
  longitude: number;
  address?: string;
  reporter_id: string;
}): Promise<Issue | null> {
  // PostGIS location from lat/lon
  const pointWkt = `POINT(${params.longitude} ${params.latitude})`;

  const { data, error } = await supabase
    .from('issues')
    .insert({
      title: params.title,
      description: params.description,
      category_id: params.category_id || null,
      location: pointWkt,
      address: params.address || null,
      reporter_id: params.reporter_id,
      status: 'REPORTED',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating issue:', error);
    throw error;
  }

  return data;
}
