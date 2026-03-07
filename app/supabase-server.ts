import { createClient } from '@/utils/supabase/server';
import { cache } from 'react';

export const createServerSupabaseClient = cache(createClient);
