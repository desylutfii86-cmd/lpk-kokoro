import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const PHONE = "+62 881-8605-759";
const EMAIL = "kokoro.brebes3@gmail.com";
const ADDRESS = "Jl. Jend. Ahmad Yani, RT.004/RW.003, Desa Tegalglagah, Kec. Bulakamba, Kabupaten Brebes, Jawa Tengah 52253";
const WA_NUMBER = "628818605759";

export const Route = createFileRoute("/kontak")({
  head: () => ({
    meta: [
      { title: "Kontak — LPK SO KOKORO BREBES" },
      { name: "description", content: "Hubungi LPK SO KOKORO BREBES untuk informasi pendaftaran" },
    ],
  }),
  component: KontakPage,
});

function KontakPage() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ nama: "", email: "", no_hp: "", pesan: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    const { error } = await supabase.from("pesan").insert({
      nama: form.nama.trim(),
      email: form.email.trim(),
      no_hp: form.no_hp.trim() || null,
      pesan: form.pesan.trim(),
    });
    setSubmitting(false);
    if (error) {
      setErrorMsg(t.common.sendFailed);
      return;
    }
    setForm({ nama: "", email: "", no_hp: "", pesan: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t.contact.title} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {[
              { icon: MapPin, text: ADDRESS },
              { icon: Phone, text: PHONE },
              { icon: Mail, text: EMAIL },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-japan flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-foreground leading-relaxed pt-2">{text}</span>
              </div>
            ))}

          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {submitted ? (
              <div className="p-8 rounded-2xl bg-accent border border-border text-center">
                <p className="text-primary font-semibold">{t.common.messageSent}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm space-y-4">
                <input type="text" placeholder={t.contact.name} required maxLength={100} value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none" />
                <input type="email" placeholder={t.contact.email} required maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none" />
                <input type="tel" placeholder={t.contact.phone} maxLength={30} value={form.no_hp} onChange={(e) => setForm({ ...form, no_hp: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none" />
                <textarea placeholder={t.contact.message} rows={4} required maxLength={2000} value={form.pesan} onChange={(e) => setForm({ ...form, pesan: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none resize-none" />
                {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
                <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl bg-gradient-japan text-primary-foreground font-semibold hover:shadow-japan transition-all disabled:opacity-60">
                  {submitting ? t.common.sending : t.contact.submit}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
