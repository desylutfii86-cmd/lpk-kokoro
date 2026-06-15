import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const bootstrapAdmin = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }).parse(data)
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Only allow if no admin exists yet
    const { data: existing, error: checkErr } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("role", "admin")
      .limit(1);
    if (checkErr) throw new Error(checkErr.message);
    if (existing && existing.length > 0) {
      throw new Error("Admin sudah ada. Silakan login.");
    }

    // Try to create user; if already exists, fetch
    let userId: string | null = null;
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (createErr) {
      // Maybe user exists — find by listing
      const { data: list } = await supabaseAdmin.auth.admin.listUsers();
      const found = list?.users.find((u) => u.email === data.email);
      if (!found) throw new Error(createErr.message);
      userId = found.id;
      // Update password to provided
      await supabaseAdmin.auth.admin.updateUserById(found.id, { password: data.password });
    } else {
      userId = created.user?.id ?? null;
    }
    if (!userId) throw new Error("Gagal membuat user");

    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (roleErr) throw new Error(roleErr.message);

    return { ok: true };
  });
