import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { adminSupabase } from '@/lib/supabase/admin';

export async function DELETE(request: Request) {
  try {
    const supabaseServerClient = await createSupabaseClient();
    const { data: { user }, error: userError } = await supabaseServerClient.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the user from auth.users. 
    // This will cascade and delete their public.users record and other associated data if foreign keys are set up with ON DELETE CASCADE.
    const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Error deleting user account:', deleteError);
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Account deletion exception:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
