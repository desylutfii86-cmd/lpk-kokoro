import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/pendaftaran")({
  head: () => ({
    meta: [
      { title: "Formulir CV Siswa — SO KOKORO BREBES" },
      { name: "description", content: "Isi data diri lengkap untuk program magang/kerja ke Jepang." },
      { property: "og:title", content: "Formulir CV Siswa — SO KOKORO BREBES" },
      { property: "og:description", content: "Isi data diri lengkap untuk program magang/kerja ke Jepang." },
    ],
  }),
  component: PendaftaranPage,
});

type PengalamanKerja = { periode: string; nama_perusahaan: string; jenis_pekerjaan: string; upah_bulanan: string };
type KeluargaSatuKK = { hubungan: string; nama: string; tanggal_lahir: string; usia: string; pekerjaan: string; upah_bulanan: string };
type KeluargaPisahKK = { hubungan: string; nama: string; tanggal_lahir: string; usia: string; pekerjaan: string; alamat_saat_ini: string; status: string };
type KeluargaMeninggal = { hubungan: string; nama: string; tanggal_lahir: string; tahun_meninggal: string; usia_meninggal: string; keterangan: string };

const inputCls = "w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none";
const labelCls = "block text-xs font-medium text-foreground mb-1";

function PendaftaranPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Data Pribadi
  const [fotoUrl, setFotoUrl] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [alamat, setAlamat] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [statusPernikahan, setStatusPernikahan] = useState("");
  const [noHp, setNoHp] = useState("");

  // Repeaters
  const [pengalaman, setPengalaman] = useState<PengalamanKerja[]>([]);
  const [satuKK, setSatuKK] = useState<KeluargaSatuKK[]>([]);
  const [pisahKK, setPisahKK] = useState<KeluargaPisahKK[]>([]);
  const [meninggal, setMeninggal] = useState<KeluargaMeninggal[]>([]);

  // Tujuan & Appeal
  const [tujuanAlasan, setTujuanAlasan] = useState("");
  const [tujuanTarget, setTujuanTarget] = useState("");
  const [appealKelebihan, setAppealKelebihan] = useState("");
  const [appealKekurangan, setAppealKekurangan] = useState("");

  const handleFotoUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `siswa-cv/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setFotoUrl(data.publicUrl);
    } catch (e: any) {
      alert("Upload foto gagal: " + (e?.message ?? "unknown"));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("siswa_cv").insert({
        foto_url: fotoUrl || null,
        nama_lengkap: namaLengkap,
        alamat,
        tanggal_lahir: tanggalLahir,
        jenis_kelamin: jenisKelamin,
        status_pernikahan: statusPernikahan,
        no_hp: noHp,
        pengalaman_kerja: pengalaman,
        keluarga_satu_kk: satuKK,
        keluarga_pisah_kk: pisahKK,
        keluarga_meninggal: meninggal,
        tujuan_alasan: tujuanAlasan,
        tujuan_target: tujuanTarget,
        appeal_kelebihan: appealKelebihan,
        appeal_kekurangan: appealKekurangan,
      });
      if (error) throw error;
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      alert("Gagal mengirim: " + (err?.message ?? "silakan coba lagi"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
        <SectionHeading title="Formulir CV Siswa" subtitle="Lengkapi data diri Anda untuk pendaftaran program magang/kerja ke Jepang." />
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 rounded-2xl bg-accent border border-border"
          >
            <p className="text-primary font-semibold text-lg">
              Terima kasih! CV Anda berhasil dikirim.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Tim kami akan menghubungi Anda segera.</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Data Pribadi */}
            <Section title="Data Pribadi">
              <div>
                <label className={labelCls}>Foto Diri</label>
                <div className="flex items-center gap-3">
                  {fotoUrl && (
                    <img src={fotoUrl} alt="foto" className="w-20 h-20 rounded-lg object-cover border border-border" />
                  )}
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-border cursor-pointer hover:bg-muted/50 text-sm text-muted-foreground">
                    <Upload className="w-4 h-4" />
                    {uploading ? "Mengunggah..." : fotoUrl ? "Ganti Foto" : "Unggah Foto"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFotoUpload(f);
                      }}
                    />
                  </label>
                </div>
              </div>
              <Field label="Nama Lengkap" required>
                <input type="text" required value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Alamat" required>
                <textarea required value={alamat} onChange={(e) => setAlamat(e.target.value)} rows={2} className={inputCls} />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Tanggal Lahir" required>
                  <input type="date" required value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Jenis Kelamin" required>
                  <select required value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)} className={inputCls}>
                    <option value="">-- Pilih --</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </Field>
                <Field label="Status Pernikahan" required>
                  <select required value={statusPernikahan} onChange={(e) => setStatusPernikahan(e.target.value)} className={inputCls}>
                    <option value="">-- Pilih --</option>
                    <option value="Belum Menikah">Belum Menikah</option>
                    <option value="Menikah">Menikah</option>
                    <option value="Cerai">Cerai</option>
                  </select>
                </Field>
                <Field label="Nomor HP" required>
                  <input type="tel" required value={noHp} onChange={(e) => setNoHp(e.target.value)} className={inputCls} />
                </Field>
              </div>
            </Section>

            {/* Pengalaman Kerja */}
            <Section title="Pengalaman Kerja">
              {pengalaman.map((p, i) => (
                <RepeaterItem key={i} onRemove={() => setPengalaman(pengalaman.filter((_, idx) => idx !== i))}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Periode"><input className={inputCls} value={p.periode} onChange={(e) => updateAt(pengalaman, setPengalaman, i, { periode: e.target.value })} placeholder="2020 - 2022" /></Field>
                    <Field label="Nama Perusahaan"><input className={inputCls} value={p.nama_perusahaan} onChange={(e) => updateAt(pengalaman, setPengalaman, i, { nama_perusahaan: e.target.value })} /></Field>
                    <Field label="Jenis Pekerjaan"><input className={inputCls} value={p.jenis_pekerjaan} onChange={(e) => updateAt(pengalaman, setPengalaman, i, { jenis_pekerjaan: e.target.value })} /></Field>
                    <Field label="Upah Bulanan"><input className={inputCls} value={p.upah_bulanan} onChange={(e) => updateAt(pengalaman, setPengalaman, i, { upah_bulanan: e.target.value })} placeholder="Rp 3.000.000" /></Field>
                  </div>
                </RepeaterItem>
              ))}
              <AddButton label="Tambah Pengalaman" onClick={() => setPengalaman([...pengalaman, { periode: "", nama_perusahaan: "", jenis_pekerjaan: "", upah_bulanan: "" }])} />
            </Section>

            {/* Keluarga Satu KK */}
            <Section title="Data Keluarga (Satu KK)">
              {satuKK.map((p, i) => (
                <RepeaterItem key={i} onRemove={() => setSatuKK(satuKK.filter((_, idx) => idx !== i))}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Hubungan"><input className={inputCls} value={p.hubungan} onChange={(e) => updateAt(satuKK, setSatuKK, i, { hubungan: e.target.value })} /></Field>
                    <Field label="Nama"><input className={inputCls} value={p.nama} onChange={(e) => updateAt(satuKK, setSatuKK, i, { nama: e.target.value })} /></Field>
                    <Field label="Tanggal Lahir"><input type="date" className={inputCls} value={p.tanggal_lahir} onChange={(e) => updateAt(satuKK, setSatuKK, i, { tanggal_lahir: e.target.value })} /></Field>
                    <Field label="Usia"><input className={inputCls} value={p.usia} onChange={(e) => updateAt(satuKK, setSatuKK, i, { usia: e.target.value })} /></Field>
                    <Field label="Pekerjaan"><input className={inputCls} value={p.pekerjaan} onChange={(e) => updateAt(satuKK, setSatuKK, i, { pekerjaan: e.target.value })} /></Field>
                    <Field label="Upah Bulanan"><input className={inputCls} value={p.upah_bulanan} onChange={(e) => updateAt(satuKK, setSatuKK, i, { upah_bulanan: e.target.value })} /></Field>
                  </div>
                </RepeaterItem>
              ))}
              <AddButton label="Tambah Anggota Keluarga" onClick={() => setSatuKK([...satuKK, { hubungan: "", nama: "", tanggal_lahir: "", usia: "", pekerjaan: "", upah_bulanan: "" }])} />
            </Section>

            {/* Keluarga Pisah KK */}
            <Section title="Data Keluarga (Pisah KK / Sudah Menikah)">
              {pisahKK.map((p, i) => (
                <RepeaterItem key={i} onRemove={() => setPisahKK(pisahKK.filter((_, idx) => idx !== i))}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Hubungan"><input className={inputCls} value={p.hubungan} onChange={(e) => updateAt(pisahKK, setPisahKK, i, { hubungan: e.target.value })} /></Field>
                    <Field label="Nama"><input className={inputCls} value={p.nama} onChange={(e) => updateAt(pisahKK, setPisahKK, i, { nama: e.target.value })} /></Field>
                    <Field label="Tanggal Lahir"><input type="date" className={inputCls} value={p.tanggal_lahir} onChange={(e) => updateAt(pisahKK, setPisahKK, i, { tanggal_lahir: e.target.value })} /></Field>
                    <Field label="Usia"><input className={inputCls} value={p.usia} onChange={(e) => updateAt(pisahKK, setPisahKK, i, { usia: e.target.value })} /></Field>
                    <Field label="Pekerjaan"><input className={inputCls} value={p.pekerjaan} onChange={(e) => updateAt(pisahKK, setPisahKK, i, { pekerjaan: e.target.value })} /></Field>
                    <Field label="Status"><input className={inputCls} value={p.status} onChange={(e) => updateAt(pisahKK, setPisahKK, i, { status: e.target.value })} /></Field>
                  </div>
                  <Field label="Alamat Saat Ini"><textarea className={inputCls} rows={2} value={p.alamat_saat_ini} onChange={(e) => updateAt(pisahKK, setPisahKK, i, { alamat_saat_ini: e.target.value })} /></Field>
                </RepeaterItem>
              ))}
              <AddButton label="Tambah Anggota Keluarga" onClick={() => setPisahKK([...pisahKK, { hubungan: "", nama: "", tanggal_lahir: "", usia: "", pekerjaan: "", alamat_saat_ini: "", status: "" }])} />
            </Section>

            {/* Keluarga Meninggal */}
            <Section title="Data Keluarga (Meninggal Dunia)">
              {meninggal.map((p, i) => (
                <RepeaterItem key={i} onRemove={() => setMeninggal(meninggal.filter((_, idx) => idx !== i))}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Hubungan"><input className={inputCls} value={p.hubungan} onChange={(e) => updateAt(meninggal, setMeninggal, i, { hubungan: e.target.value })} /></Field>
                    <Field label="Nama"><input className={inputCls} value={p.nama} onChange={(e) => updateAt(meninggal, setMeninggal, i, { nama: e.target.value })} /></Field>
                    <Field label="Tanggal Lahir"><input type="date" className={inputCls} value={p.tanggal_lahir} onChange={(e) => updateAt(meninggal, setMeninggal, i, { tanggal_lahir: e.target.value })} /></Field>
                    <Field label="Tahun Meninggal"><input className={inputCls} value={p.tahun_meninggal} onChange={(e) => updateAt(meninggal, setMeninggal, i, { tahun_meninggal: e.target.value })} /></Field>
                    <Field label="Usia Saat Meninggal"><input className={inputCls} value={p.usia_meninggal} onChange={(e) => updateAt(meninggal, setMeninggal, i, { usia_meninggal: e.target.value })} /></Field>
                    <Field label="Keterangan"><input className={inputCls} value={p.keterangan} onChange={(e) => updateAt(meninggal, setMeninggal, i, { keterangan: e.target.value })} /></Field>
                  </div>
                </RepeaterItem>
              ))}
              <AddButton label="Tambah Anggota Keluarga" onClick={() => setMeninggal([...meninggal, { hubungan: "", nama: "", tanggal_lahir: "", tahun_meninggal: "", usia_meninggal: "", keterangan: "" }])} />
            </Section>

            {/* Tujuan ke Jepang */}
            <Section title="Tujuan ke Jepang">
              <Field label="Alasan mengikuti program magang/kerja ke Jepang">
                <textarea className={inputCls} rows={4} value={tujuanAlasan} onChange={(e) => setTujuanAlasan(e.target.value)} />
              </Field>
              <Field label="Target setelah kembali ke Indonesia">
                <textarea className={inputCls} rows={4} value={tujuanTarget} onChange={(e) => setTujuanTarget(e.target.value)} />
              </Field>
            </Section>

            {/* Appeal */}
            <Section title="Appeal (Penilaian Diri)">
              <Field label="Kelebihan">
                <textarea className={inputCls} rows={3} value={appealKelebihan} onChange={(e) => setAppealKelebihan(e.target.value)} />
              </Field>
              <Field label="Kekurangan">
                <textarea className={inputCls} rows={3} value={appealKekurangan} onChange={(e) => setAppealKekurangan(e.target.value)} />
              </Field>
            </Section>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-3.5 rounded-xl bg-gradient-japan text-primary-foreground font-semibold hover:shadow-japan transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "Mengirim..." : "Kirim Formulir"}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
}

function updateAt<T>(arr: T[], setter: (v: T[]) => void, i: number, patch: Partial<T>) {
  setter(arr.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 space-y-4">
      <h3 className="font-bold text-foreground text-lg">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label} {required && <span className="text-destructive">*</span>}</label>
      {children}
    </div>
  );
}

function RepeaterItem({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="relative p-4 rounded-xl border border-border bg-muted/30 space-y-3">
      <button type="button" onClick={onRemove} className="absolute top-2 right-2 p-1.5 rounded-lg text-destructive hover:bg-destructive/10">
        <Trash2 className="w-4 h-4" />
      </button>
      {children}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
      <Plus className="w-4 h-4" /> {label}
    </button>
  );
}
