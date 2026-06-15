import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Users, BookOpen, Briefcase, Image as ImageIcon, Building2, LayoutDashboard, Plus, Pencil, Trash2, Upload, X, Mail, Eye, Newspaper, FileText, Download, Search, MessagesSquare, Plane, UserCog, KeyRound } from "lucide-react";
import { jsPDF } from "jspdf";
import { listAdminUsers, createAdminUser, updateUserPassword, updateUserRole, deleteAdminUser } from "@/lib/admin-users.functions";


export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — SO KOKORO BREBES" }],
  }),
  component: AdminDashboard,
});

type TabKey = "pendaftaran" | "siswa_cv" | "wawancara" | "keberangkatan" | "pesan" | "program" | "jobs" | "galeri" | "organisasi" | "artikel" | "users";

const tableMap: Record<TabKey, string> = {
  users: "",
  pendaftaran: "pendaftaran",
  siswa_cv: "siswa_cv",
  wawancara: "data_wawancara",
  keberangkatan: "data_keberangkatan",
  pesan: "pesan",
  program: "program",
  jobs: "jobs",
  galeri: "galeri",
  organisasi: "struktur_organisasi",
  artikel: "artikel",
};

const allTabs: { key: TabKey; label: string; icon: any }[] = [
  { key: "pendaftaran", label: "Pendaftaran", icon: Users },
  { key: "siswa_cv", label: "CV Siswa", icon: FileText },
  { key: "wawancara", label: "Data Wawancara", icon: MessagesSquare },
  { key: "keberangkatan", label: "Data Keberangkatan", icon: Plane },
  { key: "pesan", label: "Pesan Masuk", icon: Mail },
  { key: "program", label: "Program", icon: BookOpen },
  { key: "jobs", label: "Jobs", icon: Briefcase },
  { key: "galeri", label: "Galeri", icon: ImageIcon },
  { key: "organisasi", label: "Organisasi", icon: Building2 },
  { key: "artikel", label: "Artikel", icon: Newspaper },
  { key: "users", label: "Kelola User", icon: UserCog },
];

// Tabs visible to "admin" role (limited access)
const ADMIN_ALLOWED_TABS: TabKey[] = ["pendaftaran", "siswa_cv", "pesan", "wawancara", "keberangkatan"];

// Field schemas per tab
type FieldDef = { key: string; label: string; type: "text" | "textarea" | "number" | "select" | "image" | "images" | "media" | "medias" | "date"; options?: string[]; required?: boolean };

const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url || "");

const fieldSchemas: Record<TabKey, FieldDef[]> = {
  users: [],
  pendaftaran: [
    { key: "nama", label: "Nama", type: "text", required: true },
    { key: "no_hp", label: "No HP", type: "text", required: true },
    { key: "program", label: "Program", type: "select", options: ["N5", "N4", "N3"], required: true },
    { key: "status", label: "Status", type: "select", options: ["baru", "diproses", "diterima", "ditolak"], required: true },
  ],
  siswa_cv: [
    { key: "status", label: "Status", type: "select", options: ["baru", "diproses", "diterima", "ditolak"], required: true },
  ],
  wawancara: [
    { key: "nama_siswa", label: "Nama Siswa", type: "text", required: true },
    { key: "tanggal_wawancara", label: "Tanggal Wawancara", type: "date", required: true },
    { key: "nama_perusahaan", label: "Nama Perusahaan", type: "text", required: true },
    { key: "catatan", label: "Catatan", type: "textarea" },
  ],
  keberangkatan: [
    { key: "nama_siswa", label: "Nama Siswa", type: "text", required: true },
    { key: "nama_perusahaan", label: "Nama Perusahaan", type: "text", required: true },
    { key: "tanggal_pelepasan", label: "Tanggal Pelepasan", type: "date" },
    { key: "tanggal_keberangkatan", label: "Tanggal Keberangkatan", type: "date" },
    { key: "status_visa", label: "Visa", type: "select", options: ["ada", "tidak"], required: true },
    { key: "status_ceo", label: "CEO", type: "select", options: ["ada", "tidak"], required: true },
    { key: "status_tiket", label: "Tiket", type: "select", options: ["ada", "tidak"], required: true },
    { key: "catatan", label: "Catatan", type: "textarea" },
  ],
  pesan: [
    { key: "nama", label: "Nama", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "no_hp", label: "No HP", type: "text" },
    { key: "pesan", label: "Pesan", type: "textarea" },
    { key: "status", label: "Status", type: "select", options: ["baru", "dibaca", "ditindaklanjuti", "selesai"] },
  ],
  program: [
    { key: "level", label: "Level (N5/N4/N3)", type: "text", required: true },
    { key: "nama", label: "Nama Program", type: "text", required: true },
    { key: "durasi", label: "Durasi", type: "text", required: true },
    { key: "deskripsi", label: "Deskripsi", type: "textarea", required: true },
    { key: "urutan", label: "Urutan", type: "number" },
    { key: "url_gambar", label: "Gambar", type: "image" },
  ],
  jobs: [
    { key: "judul", label: "Judul", type: "text", required: true },
    { key: "deskripsi", label: "Deskripsi", type: "textarea", required: true },
    { key: "emoji", label: "Emoji", type: "text" },
    { key: "url_gambar", label: "Gambar", type: "image" },
  ],
  galeri: [
    { key: "caption", label: "Caption", type: "text", required: true },
    { key: "emoji", label: "Emoji", type: "text" },
    { key: "url_gambar", label: "Gambar", type: "image", required: true },
  ],
  organisasi: [
    { key: "nama", label: "Nama", type: "text", required: true },
    { key: "jabatan", label: "Jabatan", type: "text", required: true },
    { key: "tipe", label: "Tipe (staff/pengajar)", type: "select", options: ["staff", "pengajar"], required: true },
    { key: "deskripsi", label: "Deskripsi", type: "textarea" },
    { key: "emoji", label: "Emoji", type: "text" },
    { key: "urutan", label: "Urutan", type: "number" },
    { key: "url_gambar", label: "Foto", type: "image" },
  ],
  artikel: [
    { key: "judul", label: "Judul", type: "text", required: true },
    { key: "deskripsi", label: "Deskripsi / Isi Artikel", type: "textarea", required: true },
    { key: "tanggal", label: "Tanggal", type: "date" },
    { key: "emoji", label: "Emoji", type: "text" },
    { key: "url_gambar", label: "Foto / Video Utama", type: "media" },
    { key: "gambar_tambahan", label: "Foto / Video Tambahan", type: "medias" },
  ],
};

const listColumns: Record<TabKey, string[]> = {
  users: [],
  pendaftaran: ["nama", "no_hp", "program", "status"],
  siswa_cv: ["nama_lengkap", "no_hp", "jenis_kelamin", "status"],
  wawancara: ["nama_siswa", "tanggal_wawancara", "nama_perusahaan"],
  keberangkatan: ["nama_siswa", "nama_perusahaan", "tanggal_keberangkatan", "status_visa", "status_ceo", "status_tiket"],
  pesan: ["nama", "email", "no_hp", "status"],
  program: ["level", "nama", "durasi"],
  jobs: ["judul", "emoji"],
  galeri: ["caption", "emoji"],
  organisasi: ["nama", "jabatan", "tipe"],
  artikel: ["judul", "tanggal"],
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingRole, setCheckingRole] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdministrator, setIsAdministrator] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("pendaftaran");
  const [data, setData] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Form modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Detail view for CV Siswa
  const [detailRow, setDetailRow] = useState<any | null>(null);

  // CV Siswa filters
  const [cvSearch, setCvSearch] = useState("");
  const [cvMonth, setCvMonth] = useState(""); // YYYY-MM
  const [cvStatus, setCvStatus] = useState(""); // status filter

  // Wawancara filters
  const [wwSearchNama, setWwSearchNama] = useState("");
  const [wwSearchPerusahaan, setWwSearchPerusahaan] = useState("");
  const [wwMonth, setWwMonth] = useState(""); // tanggal_wawancara YYYY-MM

  // Keberangkatan filters
  const [kbSearchNama, setKbSearchNama] = useState("");
  const [kbSearchPerusahaan, setKbSearchPerusahaan] = useState("");
  const [kbStatusField, setKbStatusField] = useState<"" | "status_visa" | "status_ceo" | "status_tiket">("");
  const [kbStatusValue, setKbStatusValue] = useState<"" | "ada" | "tidak">("");

  const displayedData = useMemo(() => {
    if (activeTab === "siswa_cv") {
      return data.filter((row: any) => {
        const matchName = cvSearch.trim() === "" || String(row.nama_lengkap || "").toLowerCase().includes(cvSearch.toLowerCase());
        let matchMonth = true;
        if (cvMonth) {
          const d = row.created_at ? new Date(row.created_at) : null;
          if (d) {
            const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            matchMonth = ym === cvMonth;
          } else matchMonth = false;
        }
        const matchStatus = cvStatus === "" || String(row.status || "") === cvStatus;
        return matchName && matchMonth && matchStatus;
      });
    }
    if (activeTab === "wawancara") {
      return data.filter((row: any) => {
        const matchNama = wwSearchNama.trim() === "" || String(row.nama_siswa || "").toLowerCase().includes(wwSearchNama.toLowerCase());
        const matchPer = wwSearchPerusahaan.trim() === "" || String(row.nama_perusahaan || "").toLowerCase().includes(wwSearchPerusahaan.toLowerCase());
        let matchMonth = true;
        if (wwMonth) {
          const d = row.tanggal_wawancara ? new Date(row.tanggal_wawancara) : null;
          if (d) {
            const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            matchMonth = ym === wwMonth;
          } else matchMonth = false;
        }
        return matchNama && matchPer && matchMonth;
      });
    }
    if (activeTab === "keberangkatan") {
      return data.filter((row: any) => {
        const matchNama = kbSearchNama.trim() === "" || String(row.nama_siswa || "").toLowerCase().includes(kbSearchNama.toLowerCase());
        const matchPer = kbSearchPerusahaan.trim() === "" || String(row.nama_perusahaan || "").toLowerCase().includes(kbSearchPerusahaan.toLowerCase());
        let matchStatus = true;
        if (kbStatusField && kbStatusValue) {
          matchStatus = String(row[kbStatusField] || "") === kbStatusValue;
        }
        return matchNama && matchPer && matchStatus;
      });
    }
    return data;
  }, [data, activeTab, cvSearch, cvMonth, cvStatus, wwSearchNama, wwSearchPerusahaan, wwMonth, kbSearchNama, kbSearchPerusahaan, kbStatusField, kbStatusValue]);

  const availableMonths = useMemo(() => {
    if (activeTab !== "siswa_cv") return [];
    const set = new Set<string>();
    data.forEach((r: any) => {
      if (r.created_at) {
        const d = new Date(r.created_at);
        set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
      }
    });
    return Array.from(set).sort().reverse();
  }, [data, activeTab]);

  const wwAvailableMonths = useMemo(() => {
    if (activeTab !== "wawancara") return [];
    const set = new Set<string>();
    data.forEach((r: any) => {
      if (r.tanggal_wawancara) {
        const d = new Date(r.tanggal_wawancara);
        set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
      }
    });
    return Array.from(set).sort().reverse();
  }, [data, activeTab]);

  const verifyAdminAccess = async (sessionUser: any | null) => {
    setUser(sessionUser);

    if (!sessionUser) {
      setIsAdmin(false);
      setIsAdministrator(false);
      setCheckingRole(false);
      setLoading(false);
      navigate({ to: "/admin/login", search: { unauthorized: undefined } });
      return;
    }

    setCheckingRole(true);
    const { data: rows, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", sessionUser.id);

    const roles = (rows || []).map((r: any) => r.role);
    const allowed = roles.includes("admin") || roles.includes("administrator");

    if (error || !allowed) {
      setIsAdmin(false);
      setIsAdministrator(false);
      setCheckingRole(false);
      setLoading(false);
      await supabase.auth.signOut();
      navigate({ to: "/admin/login", search: { unauthorized: "1" } as never });
      return;
    }

    setIsAdmin(true);
    setIsAdministrator(roles.includes("administrator"));
    setCheckingRole(false);
    setLoading(false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      void verifyAdminAccess(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      void verifyAdminAccess(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user, activeTab]);

  const fetchData = async () => {
    if (!isAdmin) return;
    if (activeTab === "users") return;
    setDataLoading(true);
    const { data: result, error } = await supabase
      .from(tableMap[activeTab] as any)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    setData(result || []);
    setDataLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus item ini?")) return;
    const { error } = await supabase.from(tableMap[activeTab] as any).delete().eq("id", id);
    if (error) {
      alert("Gagal hapus: " + error.message);
      return;
    }
    fetchData();
  };

  const openCreate = () => {
    setEditing(null);
    const init: Record<string, any> = {};
    fieldSchemas[activeTab].forEach((f) => {
      init[f.key] = f.type === "number" ? 0 : (f.type === "images" || f.type === "medias") ? [] : "";
    });
    setFormValues(init);
    setModalOpen(true);
  };

  const openEdit = (row: any) => {
    setEditing(row);
    const init: Record<string, any> = {};
    fieldSchemas[activeTab].forEach((f) => {
      init[f.key] = row[f.key] ?? (f.type === "number" ? 0 : (f.type === "images" || f.type === "medias") ? [] : "");
    });
    // Galeri: parse kategori dari caption (format: "[kategori] caption asli")
    if (activeTab === "galeri") {
      const cap = String(row.caption || "");
      const m = cap.match(/^\[(kegiatan|pembelajaran|keberangkatan)\]\s*(.*)$/i);
      if (m) {
        init.kategori = m[1].toLowerCase();
        init.caption = m[2];
      } else {
        // Tebak dari kata kunci agar item lama tetap bisa diedit kategorinya
        const low = cap.toLowerCase();
        if (low.includes("berangkat") || low.includes("kelulus") || low.includes("alumni") || low.includes("jepang")) init.kategori = "keberangkatan";
        else if (low.includes("belajar") || low.includes("kelas") || low.includes("pelatihan")) init.kategori = "pembelajaran";
        else init.kategori = "kegiatan";
      }
    }
    setFormValues(init);
    setModalOpen(true);
  };

  const handleFileUpload = async (file: File, fieldKey: string) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${activeTab}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(fileName, file, { upsert: false });
    if (error) {
      alert("Upload gagal: " + error.message);
      setUploading(false);
      return;
    }
    const { data: pub } = supabase.storage.from("media").getPublicUrl(fileName);
    setFormValues((prev) => ({ ...prev, [fieldKey]: pub.publicUrl }));
    setUploading(false);
  };

  const handleMultiFileUpload = async (files: FileList, fieldKey: string) => {
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const fileName = `${activeTab}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(fileName, file, { upsert: false });
      if (error) {
        alert("Upload gagal: " + error.message);
        continue;
      }
      const { data: pub } = supabase.storage.from("media").getPublicUrl(fileName);
      urls.push(pub.publicUrl);
    }
    setFormValues((prev) => ({
      ...prev,
      [fieldKey]: [...(Array.isArray(prev[fieldKey]) ? prev[fieldKey] : []), ...urls],
    }));
    setUploading(false);
  };

  const handleSave = async () => {
    // Validasi field wajib
    const missing = fieldSchemas[activeTab]
      .filter((f) => f.required)
      .filter((f) => {
        const v = formValues[f.key];
        return v === undefined || v === null || String(v).trim() === "";
      })
      .map((f) => f.label);
    if (missing.length > 0) {
      alert("Mohon lengkapi field wajib:\n- " + missing.join("\n- "));
      return;
    }
    setSaving(true);
    const payload: Record<string, any> = {};
    fieldSchemas[activeTab].forEach((f) => {
      if (activeTab === "galeri" && f.key === "kategori") return; // virtual field
      const v = formValues[f.key];
      if (f.type === "images" || f.type === "medias") {
        payload[f.key] = Array.isArray(v) ? v : [];
      } else if (v !== undefined && v !== "") {
        payload[f.key] = f.type === "number" ? Number(v) : v;
      }
    });
    // Galeri: gabungkan kategori sebagai prefix caption agar muncul di tab yang benar
    if (activeTab === "galeri") {
      const kat = (formValues.kategori || "").toLowerCase();
      const rawCap = String(payload.caption || "").replace(/^\[(kegiatan|pembelajaran|keberangkatan)\]\s*/i, "");
      if (kat) payload.caption = `[${kat}] ${rawCap}`.trim();
    }

    let error;
    if (editing) {
      ({ error } = await supabase.from(tableMap[activeTab] as any).update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from(tableMap[activeTab] as any).insert(payload));
    }
    setSaving(false);
    if (error) {
      const message = error.message.includes("row-level security")
        ? "Akun ini belum punya akses admin untuk menyimpan data."
        : error.message;
      alert("Gagal simpan: " + message);
      return;
    }
    setModalOpen(false);
    fetchData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", search: { unauthorized: undefined } });
  };

  const downloadCvPdf = (row: any) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    let y = margin;

    const ensureSpace = (h: number) => {
      if (y + h > pageH - margin) { doc.addPage(); y = margin; }
    };
    const writeLine = (text: string, size = 10, bold = false) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, pageW - margin * 2);
      lines.forEach((ln: string) => {
        ensureSpace(size + 4);
        doc.text(ln, margin, y);
        y += size + 4;
      });
    };
    const section = (title: string) => {
      y += 6; ensureSpace(20);
      doc.setDrawColor(200); doc.line(margin, y, pageW - margin, y); y += 14;
      writeLine(title, 12, true);
    };
    const kv = (k: string, v: any) => {
      const val = v === null || v === undefined || v === "" ? "—" : String(v);
      writeLine(`${k}: ${val}`, 10);
    };
    const repeater = (title: string, items: any[], keys: [string, string][]) => {
      section(title);
      const list = Array.isArray(items) ? items : [];
      if (list.length === 0) { writeLine("Tidak ada data", 9); return; }
      list.forEach((item, i) => {
        writeLine(`#${i + 1}`, 10, true);
        keys.forEach(([k, label]) => kv(label, item?.[k]));
        y += 4;
      });
    };

    writeLine("CV SISWA — LPK SO KOKORO BREBES", 16, true);
    writeLine(`Tanggal cetak: ${new Date().toLocaleDateString("id-ID")}`, 9);
    y += 4;

    section("Data Pribadi");
    kv("Nama Lengkap", row.nama_lengkap);
    kv("Alamat", row.alamat);
    kv("Tanggal Lahir", row.tanggal_lahir);
    kv("Jenis Kelamin", row.jenis_kelamin);
    kv("Status Pernikahan", row.status_pernikahan);
    kv("Nomor HP", row.no_hp);
    kv("Status Pendaftaran", row.status);
    if (row.created_at) kv("Tanggal Daftar", new Date(row.created_at).toLocaleDateString("id-ID"));

    repeater("Pengalaman Kerja", row.pengalaman_kerja, [["periode","Periode"],["nama_perusahaan","Perusahaan"],["jenis_pekerjaan","Jenis Pekerjaan"],["upah_bulanan","Upah Bulanan"]]);
    repeater("Keluarga (Satu KK)", row.keluarga_satu_kk, [["hubungan","Hubungan"],["nama","Nama"],["tanggal_lahir","Tgl Lahir"],["usia","Usia"],["pekerjaan","Pekerjaan"],["upah_bulanan","Upah"]]);
    repeater("Keluarga (Pisah KK)", row.keluarga_pisah_kk, [["hubungan","Hubungan"],["nama","Nama"],["tanggal_lahir","Tgl Lahir"],["usia","Usia"],["pekerjaan","Pekerjaan"],["alamat_saat_ini","Alamat"],["status","Status"]]);
    repeater("Keluarga (Meninggal)", row.keluarga_meninggal, [["hubungan","Hubungan"],["nama","Nama"],["tanggal_lahir","Tgl Lahir"],["tahun_meninggal","Tahun Meninggal"],["usia_meninggal","Usia"],["keterangan","Keterangan"]]);

    section("Tujuan ke Jepang");
    kv("Alasan", row.tujuan_alasan);
    kv("Target setelah kembali", row.tujuan_target);

    section("Appeal (Penilaian Diri)");
    kv("Kelebihan", row.appeal_kelebihan);
    kv("Kekurangan", row.appeal_kekurangan);

    const safeName = String(row.nama_lengkap || "cv").replace(/[^a-z0-9]+/gi, "_");
    doc.save(`CV_${safeName}.pdf`);
  };

  const downloadNamesPdf = () => {
    const rows = displayedData;
    if (rows.length === 0) { alert("Tidak ada data untuk diunduh."); return; }
    const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
    const margin = 30;
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    let y = margin;

    doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text("DAFTAR NAMA SISWA", margin, y); y += 18;

    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    const statusLabel = cvStatus ? cvStatus : "semua status";
    const monthLabel = cvMonth ? (() => {
      const [yr, mo] = cvMonth.split("-");
      return new Date(Number(yr), Number(mo) - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    })() : "semua bulan";
    doc.text(`Status: ${statusLabel}  •  Bulan: ${monthLabel}  •  Total: ${rows.length}`, margin, y); y += 12;
    doc.text(`Tanggal cetak: ${new Date().toLocaleDateString("id-ID")}`, margin, y); y += 14;

    doc.setFont("helvetica", "bold"); doc.setFontSize(9);
    const cNo = margin;
    const cNama = margin + 28;
    const cLp = margin + 170;
    const cAlamat = margin + 210;
    const cHp = margin + 440;
    const cStatus = margin + 530;
    const cTgl = margin + 610;
    doc.text("No", cNo, y);
    doc.text("Nama", cNama, y);
    doc.text("L/P", cLp, y);
    doc.text("Alamat", cAlamat, y);
    doc.text("No HP", cHp, y);
    doc.text("Status", cStatus, y);
    doc.text("Tgl Daftar", cTgl, y);
    y += 6; doc.setDrawColor(180); doc.line(margin, y, pageW - margin, y); y += 12;

    doc.setFont("helvetica", "normal");
    rows.forEach((r: any, i: number) => {
      if (y > pageH - margin) { doc.addPage(); y = margin; }
      const tgl = r.created_at ? new Date(r.created_at).toLocaleDateString("id-ID") : "—";
      doc.text(String(i + 1), cNo, y);
      doc.text(String(r.nama_lengkap || "—").slice(0, 32), cNama, y);
      doc.text(String(r.jenis_kelamin || "—").slice(0, 10), cLp, y);
      doc.text(String(r.alamat || "—").slice(0, 55), cAlamat, y);
      doc.text(String(r.no_hp || "—").slice(0, 18), cHp, y);
      doc.text(String(r.status || "—"), cStatus, y);
      doc.text(tgl, cTgl, y);
      y += 14;
    });

    const tag = cvStatus || "semua";
    doc.save(`Daftar_Nama_Siswa_${tag}.pdf`);
  };

  const fmtDate = (v: any) => v ? new Date(v).toLocaleDateString("id-ID") : "—";

  const downloadWawancaraPdf = () => {
    const rows = displayedData;
    if (rows.length === 0) { alert("Tidak ada data untuk diunduh."); return; }
    const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
    const margin = 30;
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    let y = margin;
    doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text("DATA WAWANCARA SISWA", margin, y); y += 18;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.text(`Total: ${rows.length}  •  Tanggal cetak: ${new Date().toLocaleDateString("id-ID")}`, margin, y); y += 14;
    doc.setFont("helvetica", "bold"); doc.setFontSize(9);
    const cNo = margin, cNama = margin + 28, cTgl = margin + 220, cPer = margin + 330, cCat = margin + 530;
    doc.text("No", cNo, y); doc.text("Nama Siswa", cNama, y); doc.text("Tgl Wawancara", cTgl, y); doc.text("Nama Perusahaan", cPer, y); doc.text("Catatan", cCat, y);
    y += 6; doc.setDrawColor(180); doc.line(margin, y, pageW - margin, y); y += 12;
    doc.setFont("helvetica", "normal");
    rows.forEach((r: any, i: number) => {
      if (y > pageH - margin) { doc.addPage(); y = margin; }
      doc.text(String(i + 1), cNo, y);
      doc.text(String(r.nama_siswa || "—").slice(0, 32), cNama, y);
      doc.text(fmtDate(r.tanggal_wawancara), cTgl, y);
      doc.text(String(r.nama_perusahaan || "—").slice(0, 32), cPer, y);
      doc.text(String(r.catatan || "—").slice(0, 40), cCat, y);
      y += 14;
    });
    doc.save(`Data_Wawancara.pdf`);
  };

  const downloadKeberangkatanPdf = () => {
    const rows = displayedData;
    if (rows.length === 0) { alert("Tidak ada data untuk diunduh."); return; }
    const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
    const margin = 24;
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    let y = margin;
    doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text("DATA KEBERANGKATAN SISWA", margin, y); y += 18;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    const filterLabel = kbStatusField && kbStatusValue ? `${kbStatusField.replace("status_","")}: ${kbStatusValue}` : "semua status";
    doc.text(`Filter: ${filterLabel}  •  Total: ${rows.length}  •  Tanggal cetak: ${new Date().toLocaleDateString("id-ID")}`, margin, y); y += 14;
    doc.setFont("helvetica", "bold"); doc.setFontSize(9);
    const cNo = margin, cNama = margin + 24, cPer = margin + 180, cPel = margin + 360, cBer = margin + 450, cV = margin + 540, cC = margin + 590, cT = margin + 640;
    doc.text("No", cNo, y); doc.text("Nama Siswa", cNama, y); doc.text("Perusahaan", cPer, y);
    doc.text("Tgl Pelepasan", cPel, y); doc.text("Tgl Berangkat", cBer, y);
    doc.text("Visa", cV, y); doc.text("CEO", cC, y); doc.text("Tiket", cT, y);
    y += 6; doc.setDrawColor(180); doc.line(margin, y, pageW - margin, y); y += 12;
    doc.setFont("helvetica", "normal");
    rows.forEach((r: any, i: number) => {
      if (y > pageH - margin) { doc.addPage(); y = margin; }
      doc.text(String(i + 1), cNo, y);
      doc.text(String(r.nama_siswa || "—").slice(0, 28), cNama, y);
      doc.text(String(r.nama_perusahaan || "—").slice(0, 28), cPer, y);
      doc.text(fmtDate(r.tanggal_pelepasan), cPel, y);
      doc.text(fmtDate(r.tanggal_keberangkatan), cBer, y);
      doc.text(String(r.status_visa || "—"), cV, y);
      doc.text(String(r.status_ceo || "—"), cC, y);
      doc.text(String(r.status_tiket || "—"), cT, y);
      y += 14;
    });
    const tag = kbStatusField && kbStatusValue ? `${kbStatusField.replace("status_","")}_${kbStatusValue}` : "semua";
    doc.save(`Data_Keberangkatan_${tag}.pdf`);
  };


  if (loading || checkingRole) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Top bar */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:inline">{user.email}</span>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {allTabs
            .filter((t) => isAdministrator || ADMIN_ALLOWED_TABS.includes(t.key))
            .map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${activeTab === key ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
        </div>

        {activeTab === "users" && isAdministrator ? (
          <UsersPanel currentUserId={user.id} />
        ) : (
        <>
        {/* Data Table */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h2 className="font-bold text-foreground capitalize">{activeTab}</h2>
              <span className="text-xs text-muted-foreground">
                {activeTab === "siswa_cv" ? `${displayedData.length} dari ${data.length} item` : `${data.length} item`}
              </span>
            </div>
            {activeTab !== "pendaftaran" && activeTab !== "pesan" && activeTab !== "siswa_cv" && (
              <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                <Plus className="w-4 h-4" /> Tambah
              </button>
            )}
            {(activeTab === "pendaftaran" || activeTab === "pesan") && (
              <span className="text-xs text-muted-foreground">Data masuk dari form publik</span>
            )}
          </div>

          {activeTab === "siswa_cv" && (
            <div className="p-4 border-b border-border bg-muted/30 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari nama siswa..."
                  value={cvSearch}
                  onChange={(e) => setCvSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <select
                value={cvMonth}
                onChange={(e) => setCvMonth(e.target.value)}
                className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
              >
                <option value="">Semua bulan pendaftaran</option>
                {availableMonths.map((m) => {
                  const [y, mo] = m.split("-");
                  const label = new Date(Number(y), Number(mo) - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
                  return <option key={m} value={m}>{label}</option>;
                })}
              </select>
              <select
                value={cvStatus}
                onChange={(e) => setCvStatus(e.target.value)}
                className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
              >
                <option value="">Semua status</option>
                <option value="baru">baru</option>
                <option value="diproses">diproses</option>
                <option value="diterima">diterima</option>
                <option value="ditolak">ditolak</option>
              </select>
              <button
                onClick={downloadNamesPdf}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
              >
                <Download className="w-4 h-4" /> Daftar Nama
              </button>
              {(cvSearch || cvMonth || cvStatus) && (
                <button onClick={() => { setCvSearch(""); setCvMonth(""); setCvStatus(""); }} className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted">
                  Reset
                </button>
              )}
            </div>
          )}

          {activeTab === "wawancara" && (
            <div className="p-4 border-b border-border bg-muted/30 flex flex-col sm:flex-row gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Cari nama siswa..." value={wwSearchNama} onChange={(e) => setWwSearchNama(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Cari nama perusahaan..." value={wwSearchPerusahaan} onChange={(e) => setWwSearchPerusahaan(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <select value={wwMonth} onChange={(e) => setWwMonth(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm">
                <option value="">Semua bulan wawancara</option>
                {wwAvailableMonths.map((m) => {
                  const [y, mo] = m.split("-");
                  const label = new Date(Number(y), Number(mo) - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
                  return <option key={m} value={m}>{label}</option>;
                })}
              </select>
              <button onClick={downloadWawancaraPdf} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              {(wwSearchNama || wwSearchPerusahaan || wwMonth) && (
                <button onClick={() => { setWwSearchNama(""); setWwSearchPerusahaan(""); setWwMonth(""); }} className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted">Reset</button>
              )}
            </div>
          )}

          {activeTab === "keberangkatan" && (
            <div className="p-4 border-b border-border bg-muted/30 flex flex-col sm:flex-row gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Cari nama siswa..." value={kbSearchNama} onChange={(e) => setKbSearchNama(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Cari nama perusahaan..." value={kbSearchPerusahaan} onChange={(e) => setKbSearchPerusahaan(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <select value={kbStatusField} onChange={(e) => setKbStatusField(e.target.value as any)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm">
                <option value="">Pilih kategori status</option>
                <option value="status_visa">Visa</option>
                <option value="status_ceo">CEO</option>
                <option value="status_tiket">Tiket</option>
              </select>
              <select value={kbStatusValue} onChange={(e) => setKbStatusValue(e.target.value as any)} disabled={!kbStatusField} className="px-3 py-2 rounded-lg border border-input bg-background text-sm disabled:opacity-50">
                <option value="">Semua</option>
                <option value="ada">ada</option>
                <option value="tidak">tidak</option>
              </select>
              <button onClick={downloadKeberangkatanPdf} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              {(kbSearchNama || kbSearchPerusahaan || kbStatusField || kbStatusValue) && (
                <button onClick={() => { setKbSearchNama(""); setKbSearchPerusahaan(""); setKbStatusField(""); setKbStatusValue(""); }} className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted">Reset</button>
              )}
            </div>
          )}


          {dataLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : displayedData.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {data.length > 0 ? "Tidak ada hasil sesuai filter" : "Belum ada data"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    {listColumns[activeTab].map((col) => (
                      <th key={col} className="text-left p-3 font-medium text-muted-foreground capitalize">{col.replace("_", " ")}</th>
                    ))}
                    <th className="p-3 text-right font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedData.map((row: any) => (
                    <tr key={row.id} className="border-b border-border/50 hover:bg-muted/30">
                      {listColumns[activeTab].map((col) => (
                        <td key={col} className="p-3 max-w-[200px] truncate">{String(row[col] ?? "-")}</td>
                      ))}
                      <td className="p-3 text-right whitespace-nowrap">
                        {activeTab !== "pendaftaran" && activeTab !== "pesan" && activeTab !== "siswa_cv" && (
                          <button onClick={() => openEdit(row)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mr-3">
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                        )}
                        {activeTab === "siswa_cv" && (
                          <>
                            <button onClick={() => setDetailRow(row)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mr-3">
                              <Eye className="w-3 h-3" /> Lihat
                            </button>
                            <button onClick={() => downloadCvPdf(row)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mr-3">
                              <Download className="w-3 h-3" /> PDF
                            </button>
                            <button onClick={() => openEdit(row)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mr-3">
                              <Pencil className="w-3 h-3" /> Status
                            </button>
                          </>
                        )}
                        {activeTab === "pendaftaran" && (
                          <button onClick={() => openEdit(row)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mr-3">
                            <Pencil className="w-3 h-3" /> Update
                          </button>
                        )}
                        {activeTab === "pesan" && (
                          <button onClick={() => openEdit(row)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mr-3">
                            <Eye className="w-3 h-3" /> Lihat
                          </button>
                        )}
                        <button onClick={() => handleDelete(row.id)} className="inline-flex items-center gap-1 text-xs text-destructive hover:underline">
                          <Trash2 className="w-3 h-3" /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </>
        )}

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Kembali ke Website</Link>
        </div>
      </div>

      {/* CV Siswa Detail Modal */}
      {detailRow && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setDetailRow(null)}>
          <div className="bg-card rounded-2xl border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-foreground">Detail CV — {detailRow.nama_lengkap}</h3>
              <button onClick={() => setDetailRow(null)} className="p-1 rounded hover:bg-muted"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-6 text-sm">
              <CVSection title="Data Pribadi">
                {detailRow.foto_url && <img src={detailRow.foto_url} alt="foto" className="w-32 h-32 rounded-lg object-cover border border-border mb-3" />}
                <KV k="Nama Lengkap" v={detailRow.nama_lengkap} />
                <KV k="Alamat" v={detailRow.alamat} />
                <KV k="Tanggal Lahir" v={detailRow.tanggal_lahir} />
                <KV k="Jenis Kelamin" v={detailRow.jenis_kelamin} />
                <KV k="Status Pernikahan" v={detailRow.status_pernikahan} />
                <KV k="Nomor HP" v={detailRow.no_hp} />
                <KV k="Status" v={detailRow.status} />
              </CVSection>
              <RepeaterView title="Pengalaman Kerja" items={detailRow.pengalaman_kerja} keys={[["periode","Periode"],["nama_perusahaan","Nama Perusahaan"],["jenis_pekerjaan","Jenis Pekerjaan"],["upah_bulanan","Upah Bulanan"]]} />
              <RepeaterView title="Keluarga (Satu KK)" items={detailRow.keluarga_satu_kk} keys={[["hubungan","Hubungan"],["nama","Nama"],["tanggal_lahir","Tanggal Lahir"],["usia","Usia"],["pekerjaan","Pekerjaan"],["upah_bulanan","Upah Bulanan"]]} />
              <RepeaterView title="Keluarga (Pisah KK / Sudah Menikah)" items={detailRow.keluarga_pisah_kk} keys={[["hubungan","Hubungan"],["nama","Nama"],["tanggal_lahir","Tanggal Lahir"],["usia","Usia"],["pekerjaan","Pekerjaan"],["alamat_saat_ini","Alamat Saat Ini"],["status","Status"]]} />
              <RepeaterView title="Keluarga (Meninggal Dunia)" items={detailRow.keluarga_meninggal} keys={[["hubungan","Hubungan"],["nama","Nama"],["tanggal_lahir","Tanggal Lahir"],["tahun_meninggal","Tahun Meninggal"],["usia_meninggal","Usia Saat Meninggal"],["keterangan","Keterangan"]]} />
              <CVSection title="Tujuan ke Jepang">
                <KV k="Alasan" v={detailRow.tujuan_alasan} />
                <KV k="Target setelah kembali" v={detailRow.tujuan_target} />
              </CVSection>
              <CVSection title="Appeal (Penilaian Diri)">
                <KV k="Kelebihan" v={detailRow.appeal_kelebihan} />
                <KV k="Kekurangan" v={detailRow.appeal_kekurangan} />
              </CVSection>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => !saving && setModalOpen(false)}>
          <div className="bg-card rounded-2xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h3 className="font-bold text-foreground capitalize">{editing ? "Edit" : "Tambah"} {activeTab}</h3>
              <button onClick={() => !saving && setModalOpen(false)} className="p-1 rounded hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {fieldSchemas[activeTab].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {f.label} {f.required && <span className="text-destructive">*</span>}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      value={formValues[f.key] ?? ""}
                      onChange={(e) => setFormValues({ ...formValues, [f.key]: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : f.type === "select" ? (
                    <select
                      value={formValues[f.key] ?? ""}
                      onChange={(e) => setFormValues({ ...formValues, [f.key]: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                    >
                      <option value="">-- Pilih --</option>
                      {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (f.type === "image" || f.type === "media") ? (
                    <div className="space-y-2">
                      {formValues[f.key] && (
                        <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted">
                          {isVideoUrl(formValues[f.key]) ? (
                            <video src={formValues[f.key]} controls className="w-full h-full object-cover" />
                          ) : (
                            <img src={formValues[f.key]} alt="preview" className="w-full h-full object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => setFormValues({ ...formValues, [f.key]: "" })}
                            className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-border cursor-pointer hover:bg-muted/50 text-sm text-muted-foreground">
                        <Upload className="w-4 h-4" />
                        {uploading ? "Mengunggah..." : (f.type === "media" ? "Pilih Gambar / Video" : "Pilih Gambar")}
                        <input
                          type="file"
                          accept={f.type === "media" ? "image/*,video/*" : "image/*"}
                          className="hidden"
                          disabled={uploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, f.key);
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        placeholder={f.type === "media" ? "Atau tempel URL gambar/video" : "Atau tempel URL gambar"}
                        value={formValues[f.key] ?? ""}
                        onChange={(e) => setFormValues({ ...formValues, [f.key]: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-xs"
                      />
                    </div>
                  ) : (f.type === "images" || f.type === "medias") ? (
                    <div className="space-y-2">
                      {Array.isArray(formValues[f.key]) && formValues[f.key].length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {formValues[f.key].map((url: string, idx: number) => (
                            <div key={idx} className="relative w-full h-24 rounded-lg overflow-hidden bg-muted">
                              {isVideoUrl(url) ? (
                                <video src={url} className="w-full h-full object-cover" muted />
                              ) : (
                                <img src={url} alt={`media-${idx}`} className="w-full h-full object-cover" />
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  setFormValues({
                                    ...formValues,
                                    [f.key]: formValues[f.key].filter((_: any, i: number) => i !== idx),
                                  })
                                }
                                className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-border cursor-pointer hover:bg-muted/50 text-sm text-muted-foreground">
                        <Upload className="w-4 h-4" />
                        {uploading ? "Mengunggah..." : (f.type === "medias" ? "Pilih Beberapa Gambar / Video" : "Pilih Beberapa Gambar")}
                        <input
                          type="file"
                          accept={f.type === "medias" ? "image/*,video/*" : "image/*"}
                          multiple
                          className="hidden"
                          disabled={uploading}
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) handleMultiFileUpload(files, f.key);
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                      value={formValues[f.key] ?? ""}
                      onChange={(e) => setFormValues({ ...formValues, [f.key]: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-2 justify-end">
              <button onClick={() => setModalOpen(false)} disabled={saving} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">
                Batal
              </button>
              <button onClick={handleSave} disabled={saving || uploading} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CVSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-bold text-foreground mb-2 pb-1 border-b border-border">{title}</h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
      <div className="text-xs text-muted-foreground">{k}</div>
      <div className="sm:col-span-2 text-foreground whitespace-pre-wrap break-words">{v ? String(v) : <span className="text-muted-foreground italic">—</span>}</div>
    </div>
  );
}

function RepeaterView({ title, items, keys }: { title: string; items: any[]; keys: [string, string][] }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <CVSection title={title}>
      {list.length === 0 ? (
        <p className="text-muted-foreground italic text-xs">Tidak ada data</p>
      ) : (
        <div className="space-y-3">
          {list.map((item, i) => (
            <div key={i} className="p-3 rounded-lg bg-muted/40 border border-border/50 space-y-1">
              {keys.map(([k, label]) => <KV key={k} k={label} v={item?.[k]} />)}
            </div>
          ))}
        </div>
      )}
    </CVSection>
  );
}

function UsersPanel({ currentUserId }: { currentUserId: string }) {
  const listFn = useServerFn(listAdminUsers);
  const createFn = useServerFn(createAdminUser);
  const pwdFn = useServerFn(updateUserPassword);
  const roleFn = useServerFn(updateUserRole);
  const delFn = useServerFn(deleteAdminUser);

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // Add form
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "administrator">("admin");

  // Change password modal
  const [pwdTarget, setPwdTarget] = useState<any | null>(null);
  const [pwdValue, setPwdValue] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listFn();
      setUsers(res as any[]);
    } catch (e: any) {
      alert("Gagal memuat user: " + e.message);
    }
    setLoading(false);
  }, [listFn]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleAdd = async () => {
    if (!newEmail || !newPassword) { alert("Email & password wajib diisi"); return; }
    setBusy(true);
    try {
      await createFn({ data: { email: newEmail, password: newPassword, role: newRole } });
      setNewEmail(""); setNewPassword(""); setNewRole("admin");
      await refresh();
    } catch (e: any) { alert("Gagal: " + e.message); }
    setBusy(false);
  };

  const handleRoleChange = async (userId: string, role: "admin" | "administrator") => {
    setBusy(true);
    try { await roleFn({ data: { userId, role } }); await refresh(); }
    catch (e: any) { alert("Gagal ubah role: " + e.message); }
    setBusy(false);
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!confirm(`Hapus user ${email}?`)) return;
    setBusy(true);
    try { await delFn({ data: { userId } }); await refresh(); }
    catch (e: any) { alert("Gagal hapus: " + e.message); }
    setBusy(false);
  };

  const handleChangePassword = async () => {
    if (!pwdTarget || !pwdValue) return;
    if (pwdValue.length < 6) { alert("Password minimal 6 karakter"); return; }
    setBusy(true);
    try {
      await pwdFn({ data: { userId: pwdTarget.id, password: pwdValue } });
      setPwdTarget(null); setPwdValue("");
      alert("Password berhasil diubah");
    } catch (e: any) { alert("Gagal: " + e.message); }
    setBusy(false);
  };

  return (
    <div className="space-y-6">
      {/* Add user */}
      <div className="bg-card rounded-2xl border border-border/50 p-4">
        <h2 className="font-bold text-foreground mb-3 flex items-center gap-2"><Plus className="w-4 h-4" /> Tambah User</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
          <input type="text" placeholder="Password (min 6 karakter)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value as any)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm">
            <option value="admin">admin (akses terbatas)</option>
            <option value="administrator">administrator (akses penuh)</option>
          </select>
          <button onClick={handleAdd} disabled={busy} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {busy ? "Memproses..." : "Tambah User"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          <strong>admin</strong>: hanya bisa akses Pendaftaran, CV Siswa, Pesan Masuk, Data Wawancara, Data Keberangkatan. <br />
          <strong>administrator</strong>: akses penuh termasuk kelola user.
        </p>
      </div>

      {/* List users */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-foreground">Daftar User ({users.length})</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Memuat...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Belum ada user</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Role</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Dibuat</th>
                  <th className="p-3 text-right font-medium text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u.id === currentUserId;
                  const role = u.roles.includes("administrator") ? "administrator" : (u.roles.includes("admin") ? "admin" : "");
                  return (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="p-3">{u.email} {isSelf && <span className="text-xs text-primary">(Anda)</span>}</td>
                      <td className="p-3">
                        <select
                          value={role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                          disabled={busy || isSelf}
                          className="px-2 py-1 rounded border border-input bg-background text-xs"
                        >
                          <option value="admin">admin</option>
                          <option value="administrator">administrator</option>
                        </select>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">{u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID") : "—"}</td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button onClick={() => { setPwdTarget(u); setPwdValue(""); }} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mr-3">
                          <KeyRound className="w-3 h-3" /> Ubah Password
                        </button>
                        {!isSelf && (
                          <button onClick={() => handleDelete(u.id, u.email)} className="inline-flex items-center gap-1 text-xs text-destructive hover:underline">
                            <Trash2 className="w-3 h-3" /> Hapus
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pwdTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => !busy && setPwdTarget(null)}>
          <div className="bg-card rounded-2xl border border-border w-full max-w-sm p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-foreground">Ubah Password — {pwdTarget.email}</h3>
            <input type="text" placeholder="Password baru (min 6 karakter)" value={pwdValue} onChange={(e) => setPwdValue(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setPwdTarget(null)} disabled={busy} className="px-3 py-2 rounded-lg border border-border text-sm">Batal</button>
              <button onClick={handleChangePassword} disabled={busy} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                {busy ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
