import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

type Role = 'admin' | 'administrator';

async function assertAdministrator(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', ctx.userId);
  if (error) throw new Error(error.message);
  const roles = (data || []).map((r: any) => r.role);
  if (!roles.includes('administrator')) {
    throw new Error('Forbidden: hanya administrator yang bisa mengelola user');
  }
}

export const listAdminUsers = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdministrator(context);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    if (error) throw new Error(error.message);
    const { data: roles, error: rErr } = await supabaseAdmin
      .from('user_roles')
      .select('user_id, role');
    if (rErr) throw new Error(rErr.message);
    const roleMap = new Map<string, string[]>();
    (roles || []).forEach((r: any) => {
      const arr = roleMap.get(r.user_id) || [];
      arr.push(r.role);
      roleMap.set(r.user_id, arr);
    });
    return (data.users || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      roles: roleMap.get(u.id) || [],
    }));
  });

export const createAdminUser = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { email: string; password: string; role: Role }) => {
    if (!data.email || !data.password) throw new Error('Email dan password wajib diisi');
    if (data.password.length < 6) throw new Error('Password minimal 6 karakter');
    if (!['admin', 'administrator'].includes(data.role)) throw new Error('Role tidak valid');
    return data;
  })
  .handler(async ({ data, context }) => {
    await assertAdministrator(context);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error) throw new Error(error.message);
    const userId = created.user!.id;
    const { error: rErr } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: userId, role: data.role });
    if (rErr) throw new Error(rErr.message);
    return { id: userId };
  });

export const updateUserPassword = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string; password: string }) => {
    if (!data.userId || !data.password) throw new Error('User dan password wajib diisi');
    if (data.password.length < 6) throw new Error('Password minimal 6 karakter');
    return data;
  })
  .handler(async ({ data, context }) => {
    await assertAdministrator(context);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      password: data.password,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateUserRole = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string; role: Role }) => {
    if (!['admin', 'administrator'].includes(data.role)) throw new Error('Role tidak valid');
    return data;
  })
  .handler(async ({ data, context }) => {
    await assertAdministrator(context);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    // Replace all roles for this user with the chosen one
    const { error: dErr } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', data.userId);
    if (dErr) throw new Error(dErr.message);
    const { error: iErr } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: data.userId, role: data.role });
    if (iErr) throw new Error(iErr.message);
    return { ok: true };
  });

export const deleteAdminUser = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdministrator(context);
    if (data.userId === context.userId) throw new Error('Tidak bisa menghapus akun sendiri');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    await supabaseAdmin.from('user_roles').delete().eq('user_id', data.userId);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
