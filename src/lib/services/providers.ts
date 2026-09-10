import { supabase } from '@/lib/supabase/client';
import { Provider, Repair, AuthorityCase } from '@/types';

export async function getProviders(): Promise<Provider[]> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching providers:', error);
    return [];
  }

  return data || [];
}

export async function getRepairs(): Promise<Repair[]> {
  const { data, error } = await supabase
    .from('repairs')
    .select(`
      *,
      issue:issues(*),
      provider:providers(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching repairs:', error);
    return [];
  }

  return data || [];
}

export async function getAuthorityCases(): Promise<AuthorityCase[]> {
  const { data, error } = await supabase
    .from('authority_cases')
    .select(`
      *,
      issue:issues(*),
      department:authority_departments(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching authority cases:', error);
    return [];
  }

  return data || [];
}
