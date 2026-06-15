import { createContext, useContext, useState, type ReactNode } from "react";

type Lang = "id" | "jp";

const translations = {
  id: {
    nav: {
      beranda: "Beranda",
      profil: "Profil",
      program: "Program",
      job: "Informasi Job",
      organisasi: "Struktur Organisasi",
      galeri: "Galeri",
      kontak: "Kontak",
      artikel: "Artikel",
      berita: "Berita",
    },
    hero: {
      brand: "SO KOKORO BREBES",
      tagline: "Sending Organization",
      subtitle: "Lembaga Pelatihan Kerja Pendidikan Bahasa Jepang",
      cta: "Daftar Sekarang",
      learn: "Pelajari Lebih Lanjut",
    },
    video: {
      title: "Kenal Lebih Dekat SO KOKORO BREBES",
    },
    advantages: {
      title: "Keunggulan Kami",
      items: [
        { title: "Penyaluran Resmi", desc: "Penyaluran tenaga kerja resmi ke Jepang melalui jalur legal dan terpercaya" },
        { title: "Pelatihan Intensif", desc: "Program pelatihan bahasa Jepang intensif dengan kurikulum terstruktur" },
        { title: "Pembimbing Berpengalaman", desc: "Tenaga pengajar bersertifikat dengan pengalaman tinggal di Jepang" },
        { title: "Sertifikat Resmi", desc: "Sertifikat JLPT yang diakui secara internasional" },
      ],
    },
    register: {
      title: "Pendaftaran Cepat",
      name: "Nama Lengkap",
      phone: "No. HP",
      program: "Pilihan Program",
      submit: "Daftar Sekarang",
      success: "Pendaftaran berhasil! Kami akan menghubungi Anda segera.",
    },
    profile: {
      title: "Lembaga Sending Organization Kokoro Brebes",
      historyTitle: "Sejarah",
      historyText: "Lembaga Pelatihan Kerja (LPK) SO Kokoro Brebes didirikan pada tahun 2018 sebagai lembaga pelatihan kerja yang berfokus pada pendidikan Bahasa Jepang serta pengiriman tenaga kerja terampil ke Jepang. Pada tahap awal, LPK SO Kokoro Brebes menjalin kerja sama resmi dengan IM Japan untuk program magang teknis, sekaligus memulai proses perekrutan dan pelatihan peserta angkatan pertama. Sejak saat itu, lembaga ini berhasil mencatat pencapaian besar dengan mengirimkan lebih dari 200 peserta magang ke Jepang melalui program IM Japan.\n\nPada tahun 2021, LPK SO Kokoro Brebes semakin berkembang dengan dibukanya jalur penempatan melalui IM Japan dan jalur swasta. Langkah ini memperluas kesempatan bagi peserta magang, sekaligus memperkuat kerja sama dengan berbagai mitra resmi di Jepang guna menjamin kualitas penempatan tenaga kerja.\n\nPuncaknya, pada Agustus 2023, LPK SO Kokoro Brebes memperoleh pengakuan resmi sebagai Sending Organization (SO) yang terdaftar. Pencapaian ini menjadi tonggak penting yang menunjukkan komitmen lembaga dalam menyediakan layanan pelatihan dan penempatan tenaga kerja ke Jepang sesuai dengan standar internasional.",
      visiTitle: "Visi",
      visiItems: [
        "Mengembangkan peserta pelatihan dengan keterampilan tinggi dan memiliki tujuan yang jelas yang dapat berkontribusi pada pembangunan Indonesia sekembalinya dari Jepang.",
        "Menyediakan peserta magang dengan cepat dan membimbing untuk terus maju ke tingkat profesional sebagai pekerja berketerampilan khusus setelah masa magang mereka berakhir.",
        "Bertindak sebagai Sending Organization yang dinamis dan eksis serta mempertahankan kehadirannya secara konstan dalam menanggapi perubahan zaman.",
        "Mengembangkan tenaga kerja yang kompeten untuk bersaing dengan peserta magang dari negara lain di Jepang dan meningkatkan reputasi Indonesia di Negara Internasional.",
        "Membentuk lembaga yang dapat merespon secara fleksibel terhadap perubahan dalam program pemagangan dan program tenaga kerja berketerampilan khusus di Jepang.",
      ],
      misiTitle: "Misi",
      misiItems: [
        "Meskipun lokasinya berada di daerah perdesaan, namun lembaga ini hadir sebagai satu-satunya lembaga yang memiliki kompetensi luar biasa di bidang Nasional dan Internasional.",
        "Mengembangkan insan yang selalu berjiwa patriotik dan memiliki etos kerja yang tinggi di Negara Internasional.",
        "Bergerak sebagai Sending Organization yang secara konstan bekerja sama, memantau dan memberikan bimbingan kepada pemagang serta alumni lulusannya.",
      ],
      ownerTitle: "Pemilik",
      directorName: "Sayim — Direktur Utama SO KOKORO BREBES",
      directorBio: "Direktur Sayım, sebelumnya adalah seorang pemagang kerja teknis di Prefektur Chiba, dan istri Direktur yaitu Sri Mulyani, juga seorang pemagang kerja teknis di Prefektur Ibaraki. Setelah kembali ke Indonesia, beliau mendirikan sekolah Bahasa Jepang dan Lembaga Penyaluran Independen untuk membalas kebaikan yang beliau terima di Jepang. Hingga saat ini beliau telah berhasil mengirimkan sekitar 300 peserta pelatihan dari sekolah tersebut.",
      wifeName: "Sri Mulyani — General Manager SO KOKORO BREBES",
      wifeBio: "Seorang wanita yang berperan sebagai Business Manager di LPK SO Kokoro Brebes, dengan dedikasi tinggi dalam mengembangkan kualitas pelatihan kerja ke Jepang. Selain menjalankan tanggung jawab profesional, ia juga berperan sebagai pendukung utama pemilik LPK dalam membangun dan membesarkan lembaga.",
      videoCaption: "Profil Perusahaan — LPK SO KOKORO BREBES",
      videoFallback: "Browser Anda tidak mendukung tag video.",
    },
    programs: {
      title: "Program Pelatihan",
      subtitle: "Pilih program yang sesuai dengan kemampuan dan target Anda",
      items: [
        { level: "N5", name: "Dasar", duration: "3 Bulan", desc: "Pengenalan huruf Hiragana, Katakana, kosa kata dasar, dan percakapan sehari-hari sederhana." },
        { level: "N4", name: "Menengah", duration: "6 Bulan", desc: "Pemahaman kalimat kompleks, Kanji dasar, dan kemampuan berkomunikasi dalam situasi kerja." },
        { level: "N3", name: "Lanjutan", duration: "9 Bulan", desc: "Penguasaan Kanji tingkat menengah, membaca artikel, dan percakapan bisnis." },
      ],
    },
    jobs: {
      title: "Informasi Lowongan Kerja",
      subtitle: "Peluang kerja di Jepang untuk Anda",
      items: [
        { title: "Tokutei Ginou", desc: "Program visa kerja spesifik untuk tenaga terampil di bidang manufaktur, pertanian, perawatan, konstruksi, dan lainnya. Gaji kompetitif dan jaminan kerja." },
        { title: "Magang Jepang (Ginou Jisshusei)", desc: "Program magang teknis di Jepang selama 3-5 tahun. Kesempatan belajar teknologi Jepang sambil bekerja dan mendapatkan penghasilan." },
        { title: "Internship", desc: "Program Internship merupakan program kerja sama antara LPK dengan beberapa universitas di Indonesia dalam rangka pemberangkatan mahasiswa ke Jepang untuk melaksanakan kegiatan Kuliah Kerja Nyata (KKN) internasional selama 6 bulan. Program ini dirancang untuk memberikan pengalaman kerja, pembelajaran budaya, serta pengembangan keterampilan profesional mahasiswa melalui praktik langsung di lingkungan industri dan masyarakat Jepang. Selama program berlangsung, peserta akan mendapatkan pendampingan, pelatihan dasar bahasa dan budaya Jepang, serta pengalaman internasional yang dapat meningkatkan kompetensi akademik maupun karier di masa depan." },
      ],
    },
    organization: {
      title: "Struktur Organisasi",
      staff: "Staff",
      teachers: "Pengajar",
    },
    gallery: {
      title: "Galeri",
      subtitle: "Dokumentasi kegiatan dan alumni SO KOKORO BREBES",
      photoCount: "foto",
      view: "Lihat",
      back: "Kembali ke kategori",
      categories: [
        { title: "Kegiatan Siswa di LPK So Kokoro Brebes", description: "Dokumentasi aktivitas harian siswa di lingkungan LPK" },
        { title: "Proses Pembelajaran Siswa", description: "Dokumentasi Siswa LPK So Kokoro Brebes saat belajar" },
        { title: "Kegiatan & Keberangkatan Siswa", description: "Momen keberangkatan siswa menuju Jepang" },
      ],
    },
    jobTypes: {
      title: "Jenis-Jenis Pekerjaan",
      subtitle: "Bidang pekerjaan siswa-siswa kami yang berhasil ditempatkan di Jepang",
      items: ["Pertanian", "Perhotelan", "Perawat", "Pengecatan", "Perakitan Besi Tulangan", "Scaffolding", "Waterproof", "Pengelasan", "Pekerja Sipil", "Pengolahan Makanan"],
      description: "Peserta didik kami berasal dari berbagai latar belakang, dilatih dengan kurikulum bergaya Jepang yang ketat. Mereka mengenakan seragam rapi dan mengikuti disiplin pembelajaran ala Jepang. Dengan pengajar berpengalaman, murid kami siap menghadapi tantangan kerja di berbagai prefektur dan industri di Jepang.",
      prefecturesLabel: "Sebagian besar mereka saat ini berada di prefektur:",
      prefectures: ["Hokkaido", "Chiba", "Tokyo", "Aichi", "Osaka", "Nagasaki", "Shimane", "Ibaraki", "dan lain-lain"],
    },
    processFlow: {
      title: "Alur Proses Pembelajaran Program Magang Jepang",
      subtitle: "Perjalanan lengkap dari belajar di tanah air hingga sukses berkarier di Jepang",
      stageLabel: "Tahap",
      branchNote: "Jika tidak lolos, kembali ke tahap belajar",
      finalTitle: "Sukses Berkarier di Jepang",
      finalDesc: "Setelah menyelesaikan magang 3 tahun, peserta dapat melanjutkan ke program Tokutei Ginou untuk masa kerja yang lebih panjang dan jenjang karier yang lebih tinggi di Jepang.",
      steps: [
        { title: "Belajar 1–3 Bulan", desc: "Pembelajaran bahasa & budaya Jepang dasar" },
        { title: "Interview User Jepang", desc: "Seleksi langsung oleh perusahaan Jepang" },
        { title: "MCU Full", desc: "Pemeriksaan kesehatan menyeluruh" },
        { title: "TTD Kontrak & Pendokumenan", desc: "Penandatanganan kontrak & dokumen lengkap" },
        { title: "Pemantapan Bahasa & Budaya", desc: "Pendalaman selama 1–3 bulan" },
        { title: "Pengurusan COE & Visa", desc: "Proses dokumen keberangkatan" },
        { title: "Berangkat ke Jepang", desc: "Kontrak kerja 3 tahun" },
        { title: "1 Bulan di Pusat Center", desc: "Orientasi di pusat pembelajaran Jepang" },
        { title: "Bulan ke-2 Pindah ke Tempat Kerja", desc: "Mulai bekerja di perusahaan penempatan" },
        { title: "Tahun Pertama: Ujian Praktek & Bahasa", desc: "Uji kompetensi kerja & bahasa Jepang" },
        { title: "3 Tahun Lulus Magang", desc: "Menyelesaikan masa magang" },
        { title: "Lanjut Program Tokutei Ginou", desc: "Naik level ke pekerja terampil spesifik" },
      ],
    },
    certificates: [
      "Pengesahan Badan Hukum (2020)",
      "Sertifikat Akreditasi LPK",
      "Izin Penyelenggaraan Latihan — Disnaker Kab. Brebes (2020)",
    ],
    common: {
      sending: "Mengirim...",
      sendFailed: "Gagal mengirim pesan. Silakan coba lagi.",
      messageSent: "✅ Pesan terkirim!",
      loadingShort: "⏳...",
    },
    contact: {
      title: "Hubungi Kami",
      name: "Nama Lengkap",
      email: "Email",
      phone: "No. HP",
      message: "Pesan",
      submit: "Kirim Pesan",
      address: "Brebes, Jawa Tengah, Indonesia",
    },
    articles: {
      title: "Artikel & Berita",
      subtitle: "Informasi terbaru seputar peluang kerja di Jepang",
      readMore: "Baca Selengkapnya",
    },
    footer: {
      desc: "Lembaga Pelatihan Kerja Pendidikan Bahasa Jepang — Jembatan Anda menuju karir di Jepang.",
      quickLinks: "Menu",
      social: "Sosial Media",
      copyright: "© 2026 LPK SO KOKORO BREBES. Hak Cipta Dilindungi.",
    },
  },
  jp: {
    nav: {
      beranda: "ホーム",
      profil: "プロフィール",
      program: "プログラム",
      job: "求人情報",
      organisasi: "組織構造",
      galeri: "ギャラリー",
      kontak: "お問い合わせ",
      artikel: "記事",
      berita: "ニュース",
    },
    hero: {
      brand: "ココロブルブス送出機関",
      tagline: "送出機関",
      subtitle: "日本語教育 職業訓練機関",
      cta: "今すぐ登録",
      learn: "詳しく見る",
    },
    video: {
      title: "SO KOKORO BREBESをもっと知る",
    },
    advantages: {
      title: "私たちの強み",
      items: [
        { title: "公式派遣", desc: "合法的で信頼できるルートを通じた日本への公式労働者派遣" },
        { title: "集中研修", desc: "体系的なカリキュラムによる集中日本語研修プログラム" },
        { title: "経験豊富な指導者", desc: "日本での生活経験を持つ認定講師" },
        { title: "公式認定証", desc: "国際的に認められたJLPT認定証" },
      ],
    },
    register: {
      title: "クイック登録",
      name: "氏名",
      phone: "電話番号",
      program: "プログラム選択",
      submit: "今すぐ登録",
      success: "登録成功！すぐにご連絡いたします。",
    },
    profile: {
      title: "ココロ・ブルブス送出機関",
      historyTitle: "沿革",
      historyText: "LPK SO ココロ・ブルブスは、2018年に日本語教育および日本への熟練労働者派遣に特化した職業訓練機関として設立されました。設立当初、LPK SO ココロ・ブルブスは技能実習プログラムのためにIM Japanと正式な協力関係を結び、第一期生の募集および研修を開始しました。それ以来、IM Japanのプログラムを通じて200名を超える技能実習生を日本へ送り出すという大きな成果を達成してまいりました。\n\n2021年には、IM Japanのルートに加えて民間ルートによる派遣も開始し、技能実習生の機会を一層拡大するとともに、日本国内の各正式パートナーとの協力関係を強化し、人材派遣の質を確保しています。\n\nそして、2023年8月、LPK SO ココロ・ブルブスは正式に登録送出機関 (Sending Organization / SO) として認定されました。この認定は、国際基準に準拠した日本向け人材育成および派遣サービスを提供するという当機関の取り組みを示す重要な節目となりました。",
      visiTitle: "ビジョン",
      visiItems: [
        "高い技能と明確な目標を持つ研修生を育成し、日本から帰国後にインドネシアの発展に貢献できる人材を育てます。",
        "研修生を迅速に派遣し、研修期間終了後は特定技能労働者としてプロのレベルへと前進できるよう指導します。",
        "時代の変化に応じて常に存在感を維持する、ダイナミックで活気ある送出機関として行動します。",
        "日本における他国の研修生と競争できる有能な労働力を育成し、国際社会におけるインドネシアの評価を高めます。",
        "日本の技能実習制度および特定技能制度の変化に柔軟に対応できる機関を構築します。",
      ],
      misiTitle: "ミッション",
      misiItems: [
        "地方に位置しながらも、国内および国際分野において卓越した能力を有する唯一無二の機関として存在します。",
        "国際社会において常に愛国心と高い労働倫理を持つ人材を育成します。",
        "送出機関として、研修生および卒業生に対し継続的に協力・監督・指導を行います。",
      ],
      ownerTitle: "オーナー",
      directorName: "サユム — ココロ・ブルブス 代表取締役（社長）",
      directorBio: "サユム代表は、千葉県で技能実習生として勤務した経験を持ち、夫人のスリ・ムリヤニも茨城県で技能実習を行いました。帰国後、日本で受けた恩に報いるため、日本語学校と独立した送出機関を設立。これまでに約300名の研修生を送り出しています。",
      wifeName: "スリ・ムリヤニ — ココロ・ブルブス ゼネラルマネージャー",
      wifeBio: "ココロ・ブルブス送出機関のビジネスマネージャーとして、日本への技能実習の質の向上に高い熱意を持って取り組んでいます。専門的な責任を果たすとともに、機関の設立と発展においてオーナーを支える重要な役割を担っています。",
      videoCaption: "会社案内 — LPK SO KOKORO BREBES",
      videoFallback: "お使いのブラウザは動画タグをサポートしていません。",
    },
    programs: {
      title: "研修プログラム",
      subtitle: "あなたの能力と目標に合ったプログラムを選んでください",
      items: [
        { level: "N5", name: "初級", duration: "3ヶ月", desc: "ひらがな、カタカナ、基本語彙、簡単な日常会話の紹介。" },
        { level: "N4", name: "中級", duration: "6ヶ月", desc: "複雑な文の理解、基本漢字、職場でのコミュニケーション能力。" },
        { level: "N3", name: "上級", duration: "9ヶ月", desc: "中級漢字の習得、記事の読解、ビジネス会話。" },
      ],
    },
    jobs: {
      title: "求人情報",
      subtitle: "日本での就労機会",
      items: [
        { title: "特定技能", desc: "製造業、農業、介護、建設業などの分野における熟練労働者向けの特定就労ビザプログラム。" },
        { title: "技能実習生", desc: "3～5年間の日本での技術研修プログラム。日本の技術を学びながら働き、収入を得る機会。" },
        { title: "インターンシップ", desc: "インターンシッププログラムは、LPKとインドネシア国内の複数の大学との協力により、学生を日本へ派遣し、6か月間の国際的な実地研修（KKN）を行うプログラムです。本プログラムは、日本の産業現場や地域社会での実践を通じて、就労経験、異文化学習、そして学生の専門的スキルの向上を目的としています。期間中、参加者は指導・サポート、日本語および日本文化の基礎研修を受け、学術的にも将来のキャリアにも役立つ国際経験を得ることができます。" },
      ],
    },
    organization: {
      title: "組織構造",
      staff: "スタッフ",
      teachers: "講師",
    },
    gallery: {
      title: "ギャラリー",
      subtitle: "SO KOKORO BREBESの活動と卒業生の記録",
      photoCount: "枚",
      view: "見る",
      back: "カテゴリーに戻る",
      categories: [
        { title: "LPK So Kokoro Brebesでの生徒の活動", description: "LPK内での生徒の日常活動の記録" },
        { title: "生徒の学習プロセス", description: "LPK So Kokoro Brebesの生徒の学習風景" },
        { title: "生徒の活動と出発", description: "日本へ向かう生徒の出発の瞬間" },
      ],
    },
    jobTypes: {
      title: "職種一覧",
      subtitle: "日本に派遣された当校生徒の職種分野",
      items: ["農業", "ホテル業", "介護", "塗装", "鉄筋組立", "足場", "防水", "溶接", "土木作業員", "食品加工"],
      description: "当校の生徒は様々な背景から集まり、厳格な日本式カリキュラムで訓練されています。整った制服を着用し、日本式の学習規律に従っています。経験豊富な講師陣により、生徒たちは日本の各都道府県・各産業での就労に備えています。",
      prefecturesLabel: "現在、多くの生徒が以下の都道府県で活躍しています：",
      prefectures: ["北海道", "千葉", "東京", "愛知", "大阪", "長崎", "島根", "茨城", "その他"],
    },
    processFlow: {
      title: "日本研修プログラム学習プロセスの流れ",
      subtitle: "国内での学習から日本でのキャリア成功までの完全な道のり",
      stageLabel: "ステップ",
      branchNote: "不合格の場合は学習段階に戻ります",
      finalTitle: "日本でのキャリア成功",
      finalDesc: "3年間の技能実習を修了後、特定技能プログラムに進み、より長期間の就労とより高いキャリアステップを日本で築くことができます。",
      steps: [
        { title: "学習 1〜3ヶ月", desc: "日本語と基本的な日本文化の学習" },
        { title: "日本企業面接", desc: "日本企業による直接選考" },
        { title: "健康診断（MCU フル）", desc: "総合的な健康診断" },
        { title: "契約署名と書類整備", desc: "契約署名と書類一式の整備" },
        { title: "言語と文化の強化", desc: "1〜3ヶ月の集中研修" },
        { title: "COE・ビザ手続き", desc: "渡航書類の手続き" },
        { title: "日本へ出発", desc: "3年間の労働契約" },
        { title: "センターで1ヶ月", desc: "日本の研修センターでオリエンテーション" },
        { title: "2ヶ月目に勤務先へ", desc: "配属先企業での就労開始" },
        { title: "1年目：実技・言語試験", desc: "業務技能と日本語の試験" },
        { title: "3年間の実習修了", desc: "技能実習期間の完了" },
        { title: "特定技能プログラムへ", desc: "特定技能労働者へステップアップ" },
      ],
    },
    certificates: [
      "法人認可証（2020年）",
      "LPK認定証",
      "研修実施許可証 — ブレベス県労働局（2020年）",
    ],
    common: {
      sending: "送信中...",
      sendFailed: "送信に失敗しました。もう一度お試しください。",
      messageSent: "✅ メッセージを送信しました！",
      loadingShort: "⏳...",
    },
    contact: {
      title: "お問い合わせ",
      name: "氏名",
      email: "メール",
      phone: "電話番号",
      message: "メッセージ",
      submit: "送信",
      address: "ブレベス、中部ジャワ、インドネシア",
    },
    articles: {
      title: "記事・ニュース",
      subtitle: "日本での就労機会に関する最新情報",
      readMore: "続きを読む",
    },
    footer: {
      desc: "日本語教育職業訓練機関 — 日本でのキャリアへの架け橋。",
      quickLinks: "メニュー",
      social: "ソーシャルメディア",
      copyright: "© 2026 LPK SO KOKORO BREBES. All rights reserved.",
    },
  },
} as const;

type Translations = (typeof translations)["id"] | (typeof translations)["jp"];

const I18nContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}>({
  lang: "id",
  setLang: () => {},
  t: translations.id,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("id");
  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
