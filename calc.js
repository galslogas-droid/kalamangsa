/* Kalamangsa — mesin petungan Jawa-Islam
 * Kabeh rumus ing kene ditandhani level kapercayan:
 *   [SOLID]   sumber cocog across referensi, aman dienggo.
 *   [USULAN]  sumber during cocog / during ana rujukan primer — WAJIB tashih Gus Fi
 *             sadurunge dianggep final. Ditampilake ing UI kanthi tandha "USULAN".
 */

// ================= WETON / NEPTU [SOLID] =================
const PASARAN = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
const PASARAN_NEPTU = { Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8 };
const HARI_NAMA = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const HARI_NEPTU = [5, 4, 3, 7, 8, 6, 9]; // urut miturut Date.getDay()

// Anchor dikalibrasi ganda lan dicek konsisten sacara matematis:
//  - 1 Jan 2026 = Kamis Pon (cocog: detik.com, kompas.com, idntimes.com, liputan6.com)
//  - 17 Agustus 1945 = Jumat Legi (fakta umum, dicek: selisih 29357 dina, mod 5 = 2,
//    pas karo selisih index Legi(0) -> Pon(2))
const ANCHOR_UTC = Date.UTC(2026, 0, 1);
const ANCHOR_PASARAN_INDEX = 2; // Pon

function dayDiffUTC(dateUTCms) {
  return Math.round((dateUTCms - ANCHOR_UTC) / 86400000);
}

function toUTCms(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function pasaranOf(date) {
  const diff = dayDiffUTC(toUTCms(date));
  const idx = (((ANCHOR_PASARAN_INDEX + diff) % 5) + 5) % 5;
  return PASARAN[idx];
}

function wetonOf(date) {
  const hari = HARI_NAMA[date.getDay()];
  const pasaran = pasaranOf(date);
  const neptu = HARI_NEPTU[date.getDay()] + PASARAN_NEPTU[pasaran];
  return { hari, pasaran, neptu };
}

// ================= WUKU / PAWUKON [SOLID — urutan dicek nganggo riset web, dikalibrasi anchor ki-demang.com] =================
// 30 wuku, saben wuku 7 dina, 1 siklus pawukon lengkap = 210 dina.
// Urutan dicek nganggo riset web (padha ing pirang-pirang sumber: detik.com,
// javanesetime.org, kalenderindo.id). Dikalibrasi karo anchor saka
// ki-demang.com/almanak_jawa (konverter tanggal): 16 Agustus 2026 (Minggu/
// Radite, dadi wiwitan wuku) = wuku Medangkungan.
const WUKU = [
  "Sinta", "Landep", "Wukir", "Kurantil", "Tolu", "Gumbreg", "Warigalit",
  "Warigagung", "Julungwangi", "Sungsang", "Galungan", "Kuningan", "Langkir",
  "Mandasiya", "Julungpujut", "Pahang", "Kuruwelut", "Marakeh", "Tambir",
  "Medangkungan", "Maktal", "Wuye", "Manahil", "Prangbakat", "Bala", "Wugu",
  "Wayang", "Kulawu", "Dukut", "Watugunung",
];
const WUKU_ANCHOR_UTC = Date.UTC(2026, 7, 16); // Minggu, wiwitan wuku Medangkungan
const WUKU_ANCHOR_INDEX = 19; // Medangkungan (0-based)

function wukuOf(date) {
  const diffDays = Math.floor((toUTCms(date) - WUKU_ANCHOR_UTC) / 86400000);
  const weekIdx = Math.floor(diffDays / 7);
  const idx = (((WUKU_ANCHOR_INDEX + weekIdx) % 30) + 30) % 30;
  return { nama: WUKU[idx], urutan: idx + 1, ...WUKU_DETAIL[idx] };
}

// Dewa/watak/lambang/pantangan saben wuku [USULAN — during ditashih Gus Fi,
// PERLU EKSTRA ngati-ati amarga wis liwat 2 lapis pangolahan: (1) situs asline
// (ki-demang.com/almanak_jawa, basa Indonesia, 30 tanggal beda diakses siji
// per wuku, riset 16 Agustus 2026) → (2) diringkes dening AI liyane (agent
// riset) dadi basa Indonesia → (3) DITERJEMAHAKE DEWEK dening Dul menyang
// basa Jawa ngoko ing ngisor iki, ben jinis basane padha karo keterangan
// liyane sak app (BURUJ, PRANATA_MANGSA). Tegese iki DUDU kutipan langsung
// tanpa owahan — isih rawan luntur tliti nalika ditejemahake, senajan isine
// wis diusahakke padha. Tashih Gus Fi kudu mriksa isi TENAN (bandhingake
// karo situs asline yen perlu), dudu mung mriksa basa Jawane wae.
// Katrangan sing during lengkap ing sumber asline (lambang during ana jeneng
// pohon/burung tekstual) dijarno kosong, dudu ditebak. "-" tegese ora ana
// katrangan arah pantangan ing sumber. Siji katrangan penting: nama wuku #7
// ing sumber ki-demang tetep "Warigalit" — cocog persis karo array WUKU ing
// ndhuwur (dudu bola-bali "Wariga"), dadi ora ana konflik jeneng.
const WUKU_DETAIL = [
  { // 0 Sinta
    dewa: "Bethara Yamadipati",
    lambang: "Pohon Gendhayakan (mayungi wong lara); Manuk Gagak (nampa pituduh ilahi)",
    watak: "Seneng mamerake kasugihane; kurang sabar; nanging luhur budine.",
    baik: "Nambani/nyuwun srana, nyuwun udan, prekara sing sesambungan karo alam ghaib",
    tidakBaik: "Tanem tuwuh, mbukak pekarangan",
    arah: "Wetan Laut (Timur Laut)",
    catatan: "Kurang loman nalika kacukupan bisa nekakake kacilakan.",
  },
  { // 1 Landep
    dewa: "Bethara Maha Dewa",
    lambang: "",
    watak: "Madhangi atine wong akeh; seneng mamerake kasugihan; dhawuhe alus ing njaba nanging keras ing njero.",
    baik: "Ngasah pedhang, gawe pager, gawe wisaya iwak (kolam)",
    tidakBaik: "Pindhah omah, hajat mantenan, miwiti usaha, gawe lawang",
    arah: "-",
    catatan: "Sasuwene 7 dina aja marani Kala.",
  },
  { // 2 Wukir
    dewa: "Bethara Mahayekti",
    lambang: "Gunung (endah dideleng seka adoh, mbebayani yen didekati); Pohon Nagasari (watak pandhita); Manuk Manyar (seneng saingan); kewan alas (pengaruh alon-alon)",
    watak: "Ora ketara isi atine, seneng mrentah; wawasane jembar, dadi sumber ilmu kanggo wong liya.",
    baik: "Mantu, mbenerake apa wae, kekancan kanthi tulus",
    tidakBaik: "Tirakat/tetirah, nambani lara, masang tumbal, ngedegake omah",
    arah: "Kidul Wetan (Tenggara)",
    catatan: "Papan sial ing tenggara, madhep menyang barat laut.",
  },
  { // 3 Kurantil
    dewa: "Bethara Langsur",
    lambang: "",
    watak: "Tansah kesusu nanging atine sabar; ora seneng nganggur; boros, ora bisa nyimpen bandha; seneng selingkuh; bisa urip mulya.",
    baik: "Golek jodho",
    tidakBaik: "Mantu, nglumpukake wong, tanem tuwuh; pertemanan kerep tukaran",
    arah: "-",
    catatan: "Ngedohi kegiyatan menyang ngisor sasuwene wuku iki.",
  },
  { // 4 Tolu
    dewa: "Bethara Bayu (Dewa Angin)",
    lambang: "Manuk Branjangan — seneng gawe perkara",
    watak: "Gumedhe lan angel dilayani karepe; seneng mamerake kasugihan; begja teka mburi, dudu ing wiwitan.",
    baik: "Golek pangupa jiwa, nambani wong lara, tanem/pindhah panggonan, mantu",
    tidakBaik: "Cidra, main judi, ngunduh woh saka wit sing dhuwur",
    arah: "Kulon Laut (Barat Laut)",
    catatan: "",
  },
  { // 5 Gumbreg
    dewa: "Bethara Cakra",
    lambang: "Pohon Beringin — dadi papan pangayoman",
    watak: "Duwe wibawa lan pengaruh, dhawuhe dituruti anak buah; alus ing ngarep, keras/kenceng ing mburi; lambang kuwasa lan wewenang donya.",
    baik: "Rembugan babagan besanan, golek pangupa jiwa (nemu begja)",
    tidakBaik: "Tanem kebon, ngedegake omah, miwiti pakaryan apa wae, lelungan",
    arah: "Kidul (Selatan)",
    catatan: "Kala Jaya Bumi ana ing kidul.",
  },
  { // 6 Warigalit
    dewa: "Bethara Asmara",
    lambang: "(ana gambar manuk, jeneng manuke during kacathet cetha ing sumber)",
    watak: "Wataké gampang nesu; tansah kurang sandhang-pangane.",
    baik: "Kenalan lan sedulur-seduluran, ngajeni leluhur, ngedalake banyu, lelungan sowan sanak sedulur",
    tidakBaik: "Cidra, lelungan adoh, perang",
    arah: "-",
    catatan: "Becike ngedohi kegiyatan manjat.",
  },
  { // 7 Warigagung
    dewa: "Bethara Maharesi — akeh omong",
    lambang: "Macan Kêtawan (macan totol) — mantep bandhane senajan batin ora tentrem; Pohon Cemara (gumedhe, seneng usil); Manuk Bethet (mandiri)",
    watak: "Setengah irit anggone nyimpen; begjane teka mburi; setiti banget marang sandhang-pangane dhewe.",
    baik: "Ngedegake omah, tetanen, besanan, ngangsu kawruh kabatinan",
    tidakBaik: "Lelungan nyamar, pindhah panggonan, nyiksa raja kaya",
    arah: "Lor (Utara)",
    catatan: "Kala Jaya Bumi ana ing lor madhep kidul.",
  },
  { // 8 Julungwangi
    dewa: "Bethara Sambo",
    lambang: "Pohon Cempaka; Manuk Kutilang; kewan Banteng (lumpuh); wadhah banyu (pasu)",
    watak: "Ikhlas, becik budine, ora seneng nyimpen bandha; disenengi wong sing duwe pangkat/gedhe.",
    baik: "Laku/tirakat kanthi disiplin, nampa wewarah kabatinan, nggarap lahan, mulang ilmu sing bakal digugu",
    tidakBaik: "Lelungan adoh, pindhah panggonan, duwe hajat, ngedegake apa wae, nambani lara, golek pangupa jiwa",
    arah: "Wetan Laut (Timur Laut)",
    catatan: "",
  },
  { // 9 Sungsang
    dewa: "Bethara Gana",
    lambang: "Geni/kobaran geni — madhangi lan makarya wibawa nanging gawe ora kepenak; Pohon Tangan; Manuk Nori",
    watak: "Seneng makarya, ora seneng nganggur; boros nanging loman, rejeki teka saka adoh, atine bisa dursila lan srakah; \"peteng atine\" — wani, sanggup tumindak kejem; nggawa wibawa lan cahya nanging gawe wong liya ora tentrem.",
    baik: "Golek pangupa jiwa, pindhah panggonan, kekancan/sedulur-seduluran, hajat mantenan, mbatik, tetanen",
    tidakBaik: "Manjat, negor kayu alas/kebon, lelungan adoh, seneng-seneng, kumpulan gedhe, perang",
    arah: "Wetan (Timur)",
    catatan: "Kala Jaya Bumi ana ing wetan madhep kulon.",
  },
  { // 10 Galungan
    dewa: "Bethara Kamajaya",
    lambang: "Lambang tresna lan setya",
    watak: "Loman nanging boros; seneng padu.",
    baik: "Tirakat, sowan sanak sedulur, ngangsu kawruh/pendhidhikan",
    tidakBaik: "Tanem pring, lelungan adoh, nambani lara, hajat mantenan, ngedegake omah, ngoyak drajat/pangkat",
    arah: "-",
    catatan: "",
  },
  { // 11 Kuningan
    dewa: "Bethara Indra",
    lambang: "",
    watak: "Padhang atine, slamet (prekara donya lan begja).",
    baik: "Sedulur-seduluran, golek pangupa jiwa, nulungi wong",
    tidakBaik: "Tanem tuwuh, mbenakake omah, mantu",
    arah: "Kulon (Barat)",
    catatan: "Kala Jaya Bumi ana ing kulon madhep wetan; aja tanem wit sing dijupuk kayune.",
  },
  { // 12 Langkir
    dewa: "Bethara Kala",
    lambang: "Pohon Cemara Sol lan Ingas (energi panas, ora cocog kanggo pangayoman); Manuk Gemak (lambang wani nanging ngarah ala)",
    watak: "Kurang becik wataké lan seneng gawe ala; atine kaku, gawe rekasa awake dhewe; cenderung nyolong lan gawe padu.",
    baik: "Tanem tuwuh, lelungan, hajat mantenan, njamasi gaman, nambani lara",
    tidakBaik: "Cidra, kepekso perkara, padu",
    arah: "Kidul Wetan (Tenggara)",
    catatan: "",
  },
  { // 13 Mandasiya
    dewa: "Bethara Brama",
    lambang: "Pohon Asem (papan pangayoman); Manuk Platuk Bawang (energine kuwat); wangunan lawang tertutup (lambang irit)",
    watak: "Seneng ngayomi lan loman, senajan ngarep-arep diakoni; ngati-ati babagan bandha lan rada gumedhe; bisa menehi dhukungan wong liya.",
    baik: "Paseduluran, nambani lara, hajat mantu lsp.",
    tidakBaik: "Lelungan, golek pangupa jiwa, gawe sumur, mbukak pekarangan",
    arah: "-",
    catatan: "Kegiyatan sing ngarah ngisor (kaya gawe sumur) becike diedohi.",
  },
  { // 14 Julungpujut
    dewa: "Bethara Guritno",
    lambang: "Pohon Rembuyut; Manuk Emprit Tondhang; kewan Sapi Gumarang Tumurun (lambang bungah lan energi aktif)",
    watak: "Wataké ora tau tenanan (sembrana); mangane akeh lan kebak vitalitas; lambang wit nandhakake penampilan apik lan digoleki wong; lambang manuk nandhakake panguripan mandiri lan komunikasi becik.",
    baik: "Golek pangupa jiwa, ngingu raja kaya (kebo, sapi, jaran), tanem palakirna (woh-wohan)",
    tidakBaik: "Ngrancang lunga golek srana/ikhtiar; gampang kena santet",
    arah: "Kulon Laut (Barat Laut)",
    catatan: "",
  },
  { // 15 Pahang
    dewa: "Bethara Tantra",
    lambang: "Pohon (mayungi wong lara); Manuk Cocak (pinter guneman, seneng ing kutha); lawang candi kebuka (ikhlas, loman)",
    watak: "Omongane panas; kurang becik budi pekertine; gampang tersinggung.",
    baik: "Nambani lara, tanem apa wae, mantenan",
    tidakBaik: "Lelungan adoh, golek pangupa jiwa, ngrancang lan mbenakake apa wae",
    arah: "-",
    catatan: "",
  },
  { // 16 Kuruwelut
    dewa: "Bethara Wisnu",
    lambang: "Banyu bening ing pasu/jembangan — lambang ati kebak rasa slamet; kaya \"kapas garing\" (ringkih lan gerahen)",
    watak: "Cekatan nanging nakal (seneng ngganggu wong); tansah prihatin.",
    baik: "Ndeleng-ndeleng calon mantu, ngrancang gawe/mbenakake omah",
    tidakBaik: "Lelungan, mbenakake apa wae, nambani lara, tanem jujutan (tanduran kaya jagung)",
    arah: "-",
    catatan: "Ngedohi manjat sasuwene 7 dina wuku iki.",
  },
  { // 17 Marakeh
    dewa: "Bethara Surenggana",
    lambang: "Pohon Trengguli — kembange kurang migunani nanging wohe endah",
    watak: "Kuwat pangeling-elinge; dalan tumuju kasuksesan cepet; seneng nduduhake berkah Gusti; ora bisa diutus lelungan adoh, dadi pusat perhatian ing kumpulan.",
    baik: "Tanem pari, masang tumbal, mbenakake omah, gawe pekarangan",
    tidakBaik: "Kerja sambilan, kasmaran/pacaran, pindhah panggonan",
    arah: "Lor (Utara)",
    catatan: "",
  },
  { // 18 Tambir
    dewa: "Bethara Siwah — \"kabecikan njaba mêngku pamrih ing njero\"",
    lambang: "Pohon Upas (ora cocog kanggo pangayoman); Manuk Prenjak (cita-cita dhuwur)",
    watak: "Seneng umuk; batine ora slamet; kerep dijahili wong; kerep ilang semangat.",
    baik: "Golek pangupa jiwa, tanem wit woh-wohan (palakina), nancepake turus (patok tanduran), ngangsu kawruh kabatinan, perang",
    tidakBaik: "(sumber ora nyebutake dhaftar 'ora becik' kanthi cetha, mung pituduh ngedohi arah ing ngisor)",
    arah: "Kidul Kulon (Barat Daya)",
    catatan: "",
  },
  { // 19 Medangkungan
    dewa: "Bethara Basuki",
    lambang: "Pohon Plasa; Manuk Pelung (seneng papan banyu)",
    watak: "Rame lan akeh omong; sopan; nampa katetepane Gusti kanthi legawa.",
    baik: "Mantenan, ngedegake omah, golek srana (ikhtiar tamba)",
    tidakBaik: "Padu lan cidra",
    arah: "Wetan (Timur)",
    catatan: "Rawan \"disalahake ing wayah bengi\"; rawan sial amarga kahanan.",
  },
  { // 20 Maktal
    dewa: "Bethara Sakri",
    lambang: "Pohon Nagasari; Manuk Ayam Alas; wangunan kanthi umbul-umbul ing ndhuwure",
    watak: "Akeh sing simpati; omongane mikat; pinter ngabdi; olehe bandha lan kaurmatan bebarengan; jembar atine.",
    baik: "Hajat mantenan, ngundang sanak sedulur kanggo prekara penting, mbenakake, ngibadah",
    tidakBaik: "Lelungan (mligine mengalor-ngetan), pindhah papan, ngutangi dhuwit",
    arah: "Wetan Laut (Timur Laut)",
    catatan: "",
  },
  { // 21 Wuye
    dewa: "Bethara Kuwera",
    lambang: "Pohon Tal; Manuk Gogik; keris; wangunan lawang kebuka; sikil ana ing banyu",
    watak: "Gedhe pepenginane lan kaku atine; pangrasane landhep; loman; seneng menehi pangayoman wong liya; landhep pandelenge marang kabecikan; gampang tersinggung; pinter siasat.",
    baik: "Nyekel manuk, tanem tuwuh, sedulur-seduluran, golek rejeki",
    tidakBaik: "Lelungan adoh, ngapusi",
    arah: "Kulon (Barat)",
    catatan: "",
  },
  { // 22 Manahil
    dewa: "Bethara Gatra",
    lambang: "Pohon Tigaron (Telu Godhong, tandha kesèd); Manuk Sepahan (begja ing pangupa jiwa)",
    watak: "Welas asih lan akeh simpatine; landhep pangrasa batine; adhem atine (tentrem); gampang meri; \"kena besi\" (kapengaruh unsur logam).",
    baik: "Golek tamba/srana, gawe bendungan, mbukak kuburan, mungkasi padu",
    tidakBaik: "Nyebar wiji, mantu, golek kerja sambilan",
    arah: "Kidul Wetan (Tenggara)",
    catatan: "",
  },
  { // 23 Prangbakat
    dewa: "Bethara Bisma",
    lambang: "",
    watak: "Dawa umure lan kajamin pangupa jiwane, nanging gumedhe; cekatan; sikil ngarep ing banyu — dhemenane alus ing ngarep panas ing mburi; kaku atine; seneng manjat.",
    baik: "Golek pangupa jiwa sambilan, ngrumat pangan simpenan, dadi lantaran dagang, njatuhake paukuman",
    tidakBaik: "Lelungan, tanem kebon, golek pakaryan, nambani lara",
    arah: "-",
    catatan: "",
  },
  { // 24 Bala
    dewa: "Bethari Durga",
    lambang: "Pohon Cemara; Manuk Ayam Alas",
    watak: "Wani lan cenderung gumedhe; pohon Cemara lambang seneng omong lan umuk; disenengi wong pangkat; kerep gawe rame.",
    baik: "Sowan kanca, dadi utusan, mbiyantu mesuwurake rembugan",
    tidakBaik: "Mulang ilmu, mulangake kawruh kabatinan, mbenakake apa wae",
    arah: "Kulon Laut (Barat Laut)",
    catatan: "",
  },
  { // 25 Wugu
    dewa: "Singajanma",
    lambang: "Pohon Wuni (gawe wong liya meri babagan rejeki)",
    watak: "Gampang tersinggung lan seneng nyendhiri; jembar wawasane; kethit; kesetiakawanan dhuwur nganti gelem kurban tekan mati.",
    baik: "Mbenakake omah, lelungan golek rejeki, tanem tetuwuhan umbi-umbian",
    tidakBaik: "Kekancan (prekara metu mburi nalika golek pangupa jiwa)",
    arah: "Kidul (Selatan)",
    catatan: "",
  },
  { // 26 Wayang
    dewa: "Bethari Sri — rupawan lan mukti uripe",
    lambang: "Pohon Cempaka (arum); Manuk Ayam Alas; unsur banyu — \"madhep banyu ing jembangan\"",
    watak: "Akeh sing seneng, duwe wibawa; tulus ikhlas lan bekti; sabar; gampang ing ngarep, angel ing mburi.",
    baik: "Golek rejeki, ngangsu kawruh kabatinan",
    tidakBaik: "Nyambangi wong lara, perang, ngrancang prekara",
    arah: "-",
    catatan: "Ngedohi manjat sasuwene 7 dina wuku iki.",
  },
  { // 27 Kulawu
    dewa: "Bethara Sadana",
    lambang: "Pohon Tal (lambang dawa umur); Manuk Nori (lambang loman lan mangane akeh); pepenget \"Kulawu embun tiba ing sendang agung\" — samubarang nemu papane sing pas",
    watak: "Loman tanpa ngarep pinuji; kekarepane kuwat; potensi bebaya saka ula lan kewan mandi.",
    baik: "Nambani wong lara, mantenan, wayuh, kekancan",
    tidakBaik: "Lelungan adoh, pindhah panggonan, mbukak alas",
    arah: "Lor (Utara)",
    catatan: "",
  },
  { // 28 Dukut
    dewa: "Bethara Sakri",
    lambang: "Suket/rumpun Dukut — kaya kasingkirake",
    watak: "Landhep atine lan gampang tersinggung; kekarepan kuwat; nampa nasib kanthi legawa; ngati-ati babagan dhuwit, cenderung irit; luwih seneng srawung karo wong pangkat/wibawa.",
    baik: "Mbenakake omah, mbukak kebon, golek jodho, gawe tamba lan sesaji",
    tidakBaik: "Golek pangupa jiwa, ngangsu kawruh kabatinan",
    arah: "Kidul Kulon (Barat Daya)",
    catatan: "",
  },
  { // 29 Watugunung
    dewa: "Bethara Anantaboga",
    lambang: "Pohon Wijaya Kusuma; Manuk Gogik; madhep candi",
    watak: "Uripe kaya pandhita (saka lambang wit); akeh omong nanging isi pitutur (saka lambang manuk); wong sing tansah rekasa amarga tumindake dhewe.",
    baik: "Golek kawarasan, tanem tuwuh, kekancan, besanan",
    tidakBaik: "Gawe pager pekarangan, nyimpen bandha",
    arah: "Wetan (Timur)",
    catatan: "",
  },
];

// ================= KALENDER HIJRIYAH [SOLID — tabular/civil] =================
// Cathetan: iki kalender Hijriyah TABULAR (aritmetik tetep), dudu rukyatul hilal.
// Bisa selisih ±1 dina karo pengumuman rukyat resmi. Divalidasi pas karo
// "1 Jan 2026 = 12 Rajab 1447 H" (sumber: detik.com/kompas.com dst).
function gregorianToJDN(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * m2 + 2) / 5) +
    365 * y2 +
    Math.floor(y2 / 4) -
    Math.floor(y2 / 100) +
    Math.floor(y2 / 400) -
    32045
  );
}

const HIJRI_BULAN = [
  "Muharram", "Shafar", "Rabi'ul Awwal", "Rabi'ul Akhir",
  "Jumadil Awwal", "Jumadil Akhir", "Rajab", "Sya'ban",
  "Ramadhan", "Syawwal", "Dzulqa'dah", "Dzulhijjah",
];

function jdnToHijri(jdn) {
  let l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day }; // month: 1-12
}

function hijriOf(date) {
  const jdn = gregorianToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const h = jdnToHijri(jdn);
  return { hari: HARI_NAMA[date.getDay()], tanggal: h.day, bulan: HIJRI_BULAN[h.month - 1], tahun: h.year };
}

// ================= JODOH / COCOK SERASI [SOLID — dijupuk langsung saka app asli] =================
// Rumus: total = neptuA+neptuB; sisa10 = total%10; yen sisa10<=7 dienggo, yen ora (8/9) dienggo total%7.
const JODOH_KATEGORI = {
  1: { nama: "Waseno Segoro", arti: "Wibawa gedhe, budi pekerti amba, sabar lan pemaap.", jodoh: true },
  2: { nama: "Tunggak Semi", arti: "Rejekine gampang lan akeh.", jodoh: true },
  3: { nama: "Satrio Wibowo", arti: "Drajat dhuwur lan kamulyan.", jodoh: true },
  4: { nama: "Sumur Sanebo", arti: "Akeh sing sowan ngangsu kawruh, diajeni manungsa.", jodoh: true },
  5: { nama: "Satrio Wirang", arti: "Dukacita lan masalah sing gawe isin.", jodoh: false,
       syarat: "Sadurunge nikah, salah siji panganten nyembeleh pitik." },
  6: { nama: "Bumi Kapethak", arti: "Akeh kasedihan, nanging dadi pasangan sing tabah lan kerja keras.", jodoh: false,
       syarat: "Sadurunge nikah, salah siji panganten nandur lemah." },
  0: { nama: "Lebu Kasebul Angin", arti: "Ora tau kasembadan apa sing dikarepke.", jodoh: false,
       syarat: "Sadurunge nikah, salah siji panganten mbuncang lemah nganti buyar." },
};

function jodohOf(neptuA, neptuB) {
  const total = neptuA + neptuB;
  const r10 = total % 10;
  const idx = r10 <= 7 ? r10 : total % 7;
  return { total, ...JODOH_KATEGORI[idx] };
}

// ================= COCOK SERASI [SOLID — Abu Ma'syar Al-Falaky, jeneng aksara Arab, dijupuk saka app asli] =================
// Rumus: total = abjad(nama1)+abjad(nama2)+7; sisa = total%9 (yen 0, dianggep 9).
// Beda karo Jodoh Weton ing ndhuwur (kuwi saka LFNU Jombang, adhedhasar tanggal
// lair); iki adhedhasar JENENG (kudu aksara Arab, dudu Latin/transliterasi).
const COCOK_SERASI_KATEGORI = {
  1: "Tidak ada kebaikan sama sekali",
  2: "Bagus dan penuh barokah",
  3: "Awal tidak baik, akhirnya jelek",
  4: "Menyenangkan tapi akhirnya jelek",
  5: "Banyak anaknya",
  6: "Awalnya bahagia, diakhiri dengan kegelisahan & kesedihan",
  7: "Keluarga Sakinah",
  8: "Sering menemui kerepotan",
  9: "Berpindah-pindah dan bercerai",
};
function cocokSerasiOf(nama1, nama2) {
  const v1 = abjadAnalyze(nama1).total;
  const v2 = abjadAnalyze(nama2).total;
  const total = v1 + v2 + 7;
  let sisa = total % 9;
  if (sisa === 0) sisa = 9;
  return { v1, v2, total, sisa, kategori: COCOK_SERASI_KATEGORI[sisa] };
}

// ================= COCOK NIKAH BETALJEMUR [USULAN — during ditashih] =================
// Sumber: Kitab Primbon Betaljemur Adammakna (terjemahan Indonesia, KPH
// Tjakraningrat, digitalisasi Wikimedia Commons/Pustakatama, public domain).
// Dul WAOS DHEWE langsung saka kaca 12-13 lan 17 PDF asli (dudu ringkesan
// pihak katelu) kanggo No.15 lan No.16 — teks isih basa Indonesia asli
// (dudu diterjemahake, ben paling cedhak karo sumber). No.23 saka riset
// agent sing uga maca langsung kaca 17, kanthi conto itungan sing dicek
// bener kanthi matematika. Telu-telune BEDA rumus lan BEDA saka Jodoh Weton
// (LFNU Jombang, mod-10/7) sing wis ana ing ndhuwur — pelengkap, dudu
// gantine. Tetep USULAN nganti ditashih Gus Fi, senajan sumbere primer.

// No.15 (kaca 12-13): neptu SAWIJINE wong (dudu dijumlah!) dibagi 9 kapisah
// kanggo calon suami lan calon isteri, banjur pasangan sisa (1-9, 0->9)
// dilebokake tabel 45 kombinasi (ora urut, "a lan b" padha karo "b lan a").
const BETALJEMUR_15_TABEL = {
  "1-1": "Baik, saling mencintai", "1-2": "Baik", "1-3": "Kuat tetapi rejekinya jauh",
  "1-4": "Banyak celakanya", "1-5": "Bercerai", "1-6": "Sulit kehidupannya",
  "1-7": "Banyak musuh", "1-8": "Sengsara", "1-9": "Tempat berlindung",
  "2-2": "Selamat, rejeki banyak", "2-3": "Salah satu meninggal terlebih dahulu",
  "2-4": "Banyak mengalami godaan", "2-5": "Banyak celakanya", "2-6": "Cepat menjadi kaya",
  "2-7": "Banyak anaknya yang mati", "2-8": "Murah rejeki", "2-9": "Banyak rejeki",
  "3-3": "Melarat", "3-4": "Banyak celakanya", "3-5": "Cepat bercerai",
  "3-6": "Mendapat anugerah", "3-7": "Banyak celakanya", "3-8": "Salah satu meninggal terlebih dahulu",
  "3-9": "Banyak rejeki",
  "4-4": "Sering sakit", "4-5": "Banyak mengalami godaan", "4-6": "Banyak rejeki",
  "4-7": "Melarat", "4-8": "Mengalami banyak rintangan", "4-9": "Salah satu kalah",
  "5-5": "Mengalami keberuntungan terus menerus", "5-6": "Murah rejeki",
  "5-7": "Mata pencahariannya tetap terus ada", "5-8": "Mengalami banyak rintangan", "5-9": "Murah rejeki",
  "6-6": "Banyak celakanya", "6-7": "Rukun damai/Tenteram", "6-8": "Banyak musuh", "6-9": "Sengsara",
  "7-7": "Terhukum oleh istrinya", "7-8": "Terhalang karena dirinya sendiri/mendapat celaka dari diri sendiri",
  "7-9": "Perjodohannya kekal",
  "8-8": "Dicintai oleh orang lain", "8-9": "Banyak celakanya",
  "9-9": "Susah rejeki",
};
function betaljemur15Of(neptuA, neptuB) {
  let sA = neptuA % 9; if (sA === 0) sA = 9;
  let sB = neptuB % 9; if (sB === 0) sB = 9;
  const key = sA <= sB ? `${sA}-${sB}` : `${sB}-${sA}`;
  return { sisaA: sA, sisaB: sB, arti: BETALJEMUR_15_TABEL[key] };
}

// No.16 (kaca 13): neptu suami+isteri DIJUMLAH, dibagi 4.
const BETALJEMUR_16_KATEGORI = {
  1: { nama: "Gonto", arti: "Jarang duwe anak." },
  2: { nama: "Gembili", arti: "Akeh anake." },
  3: { nama: "Sri", arti: "Akeh rejekine." },
  4: { nama: "Punggel", arti: "Salah sijine bakal ninggal luwih dhisik." },
};
function betaljemur16Of(neptuA, neptuB) {
  const total = neptuA + neptuB;
  let sisa = total % 4; if (sisa === 0) sisa = 4;
  return { total, sisa, ...BETALJEMUR_16_KATEGORI[sisa] };
}

// No.23 (kaca 17): neptu suami+isteri DIJUMLAH, dibagi 5. "Sing apik tiba ing
// Sri, Dana, lan Lungguh, kosok baline ing Lara lan Pati."
const BETALJEMUR_23_KATEGORI = {
  1: { nama: "Sri", arti: "Slamet, rejekine tansah gilir gumanti.", baik: true },
  2: { nama: "Dana", arti: "Akeh rejekine.", baik: true },
  3: { nama: "Lara", arti: "Kangelan/kasusahan.", baik: false },
  4: { nama: "Pati", arti: "Sengsara, kerep tinemu pati.", baik: false },
  5: { nama: "Lungguh", arti: "Duwe pangkat/drajat.", baik: true },
};
function betaljemur23Of(neptuA, neptuB) {
  const total = neptuA + neptuB;
  let sisa = total % 5; if (sisa === 0) sisa = 5;
  return { total, sisa, ...BETALJEMUR_23_KATEGORI[sisa] };
}

function cocokNikahBetaljemurOf(neptuA, neptuB) {
  return {
    no15: betaljemur15Of(neptuA, neptuB),
    no16: betaljemur16Of(neptuA, neptuB),
    no23: betaljemur23Of(neptuA, neptuB),
  };
}

// ================= TEMU MANTEN [SOLID — Al-Futuhat Kwagean, dijupuk saka app asli] =================
// Rumus: total = neptu(lairLaki)+neptu(lairWadon)+neptu(rencanaNikah); sisa = total%3.
function temuMantenKategori(total) {
  const rem = total > 3 ? total % 3 : total;
  if (rem === 1) return "Olo / Jelek";
  if (rem === 2) return "Apik / Bagus";
  return "Kurang sae / Kurang Baik";
}
function temuMantenOf(tglLaki, tglWadon, tglNikah) {
  const wL = wetonOf(tglLaki), wW = wetonOf(tglWadon), wN = wetonOf(tglNikah);
  const total = wL.neptu + wW.neptu + wN.neptu;
  return { wL, wW, wN, total, kategori: temuMantenKategori(total) };
}
// Golek tanggal-tanggal sabanjure sing wetone padha karo tglNikah (siklus 35
// dina — KPK saka 7 dina lan 5 pasaran), padha karo cara app asli nggoleki
// tanggal alternatif kanggo 1000 dina ngarep.
function tanggalAlternatifNikah(tglNikah, jumlah) {
  const n = jumlah || 20;
  const hasil = [];
  let t = tglNikah.getTime();
  for (let i = 0; i < n; i++) {
    t += 35 * 86400000;
    const d = new Date(t);
    hasil.push({ tanggal: d, weton: wetonOf(d) });
  }
  return hasil;
}

// ================= BUKA USAHA / RUMAH / MINGGAT [SOLID — dijupuk langsung saka app asli] =================
const USAHA_KATEGORI = { 1: "Sandang", 2: "Pangan", 3: "Loro", 0: "Pati" };
function usahaOf(neptu) { return USAHA_KATEGORI[neptu % 4]; }

const RUMAH_KATEGORI = {
  1: "Kerto — Akeh tamune, sugeh.",
  2: "Yoso — Akeh sing demeni (ngormati), kuat kabehe.",
  3: "Candi — Anteng (kokoh), rahayu slamet.",
  4: "Rogoh — Rusak, gampang kelangan.",
  0: "Sempoyong — Gampang pindah, ora istiqomah.",
};
function rumahOf(neptu) { return RUMAH_KATEGORI[neptu % 5]; }

const MINGGAT_KATEGORI = { 1: "Hilang", 2: "Ketemu", 0: "Goroh/Bohong" };
function minggatOf(neptu) { return MINGGAT_KATEGORI[neptu % 3]; }

// ================= PRANATA MANGSA [SOLID — jeneng+tanggal+keterangan dijupuk langsung saka app asli] =================
// {nama, agraris, musim, rinci, mulai:[bulan,tanggal], candra, keterangan}
// candra/keterangan: teks asli saka app referensi (array "keterangan_pranoto"),
// dijupuk liwat decompile resources.arsc, mung dirapikake HTML-e (dudu diowahi isine).
const PRANATA_MANGSA = [
  { nama: "Kaso", agraris: "Kartika", musim: "Katigo", rinci: "Padang", mulai: [6, 22],
    candra: "Satyo murco saking embanan",
    keterangan: "Perhiasan jatuh dari wadahnya. Musim daun berguguran, pohon-pohon menjadi gundul. Manusia merasa ada sesuatu yang hilang di alam, masa kering dengan sinar matahari yang terang, kelembaban udara 62%, belalang masuk ke tanah, palawija dan umbi-umbian adalah komoditas yang biasa ditanam." },
  { nama: "Karo", agraris: "Pusa", musim: "Katigo", rinci: "Paceklik", mulai: [8, 2],
    candra: "Bantolo rengko",
    keterangan: "Bumi merekah kering. Musim tanah menjadi gersang dan retak-retak. Curah hujan menurun, hawa terasa panas dan kering, manusia mulai resah karena suasana kering dan panas, tanah seperti merekah." },
  { nama: "Katelu", agraris: "Manggasari", musim: "Katigo", rinci: "Semplah", mulai: [8, 26],
    candra: "Suto Manut ing bopo",
    keterangan: "Pindane anak manut marang bapa'e. Musim pucuk tanaman menjalar pada rambatan. Masa perpindahan musim, suasana kering panas, angin sedang berdebu dari utara-selatan, curah hujan mulai naik menjadi 42mm, tanaman merambat menaiki lanjaran, tunas bambu bermunculan." },
  { nama: "Kapat", agraris: "Sitra", musim: "Katigo", rinci: "Semplah", mulai: [9, 19],
    candra: "Waspo kumembeng jroning qolbu",
    keterangan: "Air mata menggenang dalam qalbu. Musim mata air mulai bersumber. Kemarau mulai berakhir, kelembaban udara naik, pohon randu mulai berbuah, burung-burung kecil mulai bersarang dan bertelur, para petani bersiap mengolah lahan untuk ditanami tanaman pokok." },
  { nama: "Kalimo", agraris: "Manggakala", musim: "Labuh", rinci: "Semplah", mulai: [10, 14],
    candra: "Pancuran mas sumawur ing jagad",
    keterangan: "Pancuran emas menyirami langit bumi. Mulai musim hujan besar. Curah hujan naik menjadi 155mm, pohon asam mulai tumbuh daun muda, ulat-ulat bermunculan, laron meninggalkan liang, petani menebar bibit dan memperbaiki pengairan." },
  { nama: "Kanem", agraris: "Naya", musim: "Labuh", rinci: "Udan", mulai: [11, 10],
    candra: "Roso mulyo kasuciyan",
    keterangan: "Pindhane mulyo roso kang suci. Musim pohon mulai berbuah. Alam menghijau karena tumbuhan banyak bertunas dan pepohonan banyak yang berbuah, burung belibis banyak terlihat di tempat berair, musim akhir dari masa labuh/hujan." },
  { nama: "Kapitu", agraris: "Palguna", musim: "Rendheng", rinci: "Udan", mulai: [12, 23],
    candra: "Wiso kinter ing maruto",
    keterangan: "Racun hanyut bersama dengan angin. Musim bertiupnya angin yang biasanya mengandung penyakit. Hujan deras, sungai banjir, angin bertiup kencang, musim datangnya penyakit. Petani merawat tanaman di sawah, waspada terhadap serangan hama dan penyakit tanaman." },
  { nama: "Kawolu", agraris: "Wisaka", musim: "Rendheng", rinci: "Pengarep-arep", mulai: [2, 3],
    candra: "Anjrah jroning kayun",
    keterangan: "Akeh pengarep-arep, poro among tani ngarep asile tanduran. Mendung dan kilat. Uret banyak berkembang biak, petani menjaga tanaman karena sudah menjelang berbunga dan berbulir dari serangan ulat dan sejenisnya." },
  { nama: "Kasongo", agraris: "Jita", musim: "Rendheng", rinci: "Pengarep-arep", mulai: [3, 1],
    candra: "Wedaring wacono mulyo",
    keterangan: "Munculnya suara-suara mulia sebagai pertanda. Musim jangkrik, gasir, gareng, dan banyak orang berbicara berlebihan. Alam memasuki masa terakhir dalam satu tahun siklus yaitu mongso maréng, jangkrik dan cenggerek mulai berbunyi, curah hujan menurun, banjir sisa mungkin masih muncul." },
  { nama: "Kasedoso", agraris: "Srawana", musim: "Maréng", rinci: "Pengarep-arep", mulai: [3, 26],
    candra: "Gedong mineb jroning qolbu",
    keterangan: "Terperangkap dalam qalbu. Musim banyak binatang berkembang biak bunting. Manusia mengalami kondisi kurang baik, gampang lesu dan pusing, burung-burung membuat sarang dan burung kecil mulai menetas, kelembaban udara 70%, tanaman sudah mulai panen." },
  { nama: "Dasto", agraris: "Padrawana", musim: "Maréng", rinci: "Panen", mulai: [4, 18],
    candra: "Satyo sinoro wedi",
    keterangan: "Intan bersinar mulia yang banyak diminati. Curah hujan turun. Aliran air sungai mulai jernih karena tidak membawa erosi tanah/air tenang, banyak burung bermigrasi dan mencari makanan untuk menyuapi anaknya." },
  { nama: "Sodo", agraris: "Asuji", musim: "Maréng", rinci: "Padang", mulai: [5, 12],
    candra: "Tirto sah saking sasono",
    keterangan: "Air meninggalkan sumbernya. Musim dingin bedhiding. Orang jarang berkeringat karena cuaca teramat dingin, air sungai mulai menyusut, hawa menjadi dingin menjelang musim kemarau. Petani menyimpan hasil tanaman di lumbung." },
];

// Array PRANATA_MANGSA/BURUJ ditulis miturut urutan kronologis "mubeng taun"
// (diwiwiti Kasa=Juni lan Al-Hamal=Maret), dudu urut Januari->Desember.
// Fungsi cyclicLookup ngrutasi tanggal sing ana sadurunge titik wiwitan
// supaya tetep monoton, dadi wates sing "nyabrang" pungkasan taun (mis.
// Kapitu Des22->Feb2, Al-Jadyu Des22->Jan19) tetep kecathet bener.
function cyclicLookup(list, month, day) {
  const val = month * 100 + day;
  const threshold = list[0].mulai[0] * 100 + list[0].mulai[1];
  const rotate = (v) => (v < threshold ? v + 1300 : v);
  const rv = rotate(val);
  for (let i = list.length - 1; i >= 0; i--) {
    const [mm, dd] = list[i].mulai;
    if (rv >= rotate(mm * 100 + dd)) return list[i];
  }
  return list[0];
}

function mangsaOf(date) {
  return cyclicLookup(PRANATA_MANGSA, date.getMonth() + 1, date.getDate());
}

// ================= ZODIAK ABU MA'SYAR / BURUJ [SOLID — dijupuk langsung saka app asli] =================
// planet = bendha langit sing mangku (rulership klasik), unsur = Api/Tanah/Angin/Air (jenisTabiat)
// Cathetan: jeneng padanan Indonesia/Jawa kanggo "planet" dijupuk saka
// CHALDEAN_PADANAN wektu render (dudu disimpen kaping pindho ing kene), supaya
// ora ana rong ejaan kanggo bendha langit sing padha (mis. Jupiter vs Yupiter).
// keterangan: teks LENGKAP asli saka app referensi (array "keterangan_buruj",
// sumber Abu Ma'syar Al-Falaky miturut app), dijupuk liwat decompile
// resources.arsc, apa anane tanpa dipangkas (miturut dhawuh Gus Fi 16 Agustus).
// Isi klasik iki nyakup "dina/wulan apik-naas", cincin, lan "obat" — warisan
// ilmu nujum klasik, dudu hukum fiqh utawa anjuran, mung ditampilake persis
// padha karo app asli.
const BURUJ = [
  { nama: "Haml", padanan: "Aries", planet: "Marikh", unsur: "Api", mulai: [3, 21],
    keterangan: "Wataknya nyala api besar, yang jadi musuhnya adalah yang berzodiak Scorpio/Aqrob atau zodiak yang berwatak air, temannya adalah zodiak Libra/Mizan atau yang bertabiat angin dan api. Warna yang cocok kuning, perhiasan yang cocok emas, jika melaut berlayar mudah celaka. Seperti api; Aries itu kulitnya kemerahan, mudah diskusi, suka menyendiri semedi, sangat cinta terhadap kekasihnya, berbakti pada orang tua, terhadap kerabat lebih tua bagus akhlaknya, suka dengan perbuatan baik, terkadang tidak rukun dengan saudaranya. Tidak mudah kalah oleh musuh. Macan adalah hewannya, kayunya aren, burung yang tepat adalah merak. Saat umur tiga tahun sakit parah, bila sembuh maka panjanglah umurnya, jika sakit perut gampang menemui ajal. Cincin yang cocok cincin yang bermata kuning dan putih. Hari baiknya adalah Ahad dan Selasa, bulan baiknya Muharram. Hari naasnya adalah Senin dan Rabu. Jika sakit pada hari atau bulan naas maka pertanda ajal datang. Bila sakit obatnya adalah daging kambing merah digoreng dengan wijen tanpa diberi garam, dagingnya dimakan, minyaknya dipijatkan ke seluruh badan." },
  { nama: "Tsur", padanan: "Taurus", planet: "Zuhrah", unsur: "Tanah", mulai: [4, 20],
    keterangan: "Wataknya adalah tanah agung, temannya adalah yang berzodiak Scorpio/Aqrob atau yang berzodiak tanah dan air, musuhnya zodiak angin dan api atau yang berzodiak Aquarius. Warna yang cocok adalah putih atau merah. Menyukai ilmu pengetahuan. Mempunyai akhlak bagus terhadap orang agung, terkadang tidak disukai orang agung/pembesar. Saat setengah baya hartanya kurang, setelah itu banyak. Bila bertani padi hendaknya di dekat dataran tinggi supaya banyak berkahnya. Bapaknya meninggal terlebih dahulu, nikah lebih dari satu kali (janda/duda), mempunyai keturunan banyak, ada yang meninggal. Bila saat umur 14 tahun sakit parah maka jika berhasil sembuh maka panjanglah umurnya. Cincin yang tepat yang bermata hijau. Hari baiknya adalah Rabu dan Jumat, bulan baiknya adalah Shofar. Hari naasnya adalah Kamis dan Sabtu, bulan naasnya Sya'ban. Bila sakit pada hari Senin dan pada bulan naas maka hal tsb menjadi pertanda ajal. Bila sakit obatnya adalah ayam jago putih atau kambing putih, digoreng dengan minyak wijen tanpa garam lalu dimakan, kemudian minyaknya dioles ke badan." },
  { nama: "Jauza'", padanan: "Gemini", planet: "Utarid", unsur: "Angin", mulai: [5, 21],
    keterangan: "Layaknya angin besar, teman yang cocok adalah yang bertabiat angin dan api, musuhnya tabiat tanah dan Aquarius. Musuh dekat dengannya. Perawakannya besar, bulat wajahnya, alisnya belang. Hewannya macan, kayunya pohon ketapang. Kerabat iri terhadapnya. Saat setengah baya hartanya berkurang, selebihnya banyak. Pekerjaan yang baik adalah bercocok tanam. Mata cincin yang cocok adalah hitam. Hari baiknya adalah Rabu, Jumat, Ahad, bulan yang cocok adalah bulan Rabiul Awal. Hari naasnya Sabtu dan Selasa, dan bulan naasnya adalah Ramadhan. Bila sakit obatnya burung dara hitam digoreng dengan minyak wijen tanpa garam." },
  { nama: "Sarothon", padanan: "Cancer", planet: "Qomar", unsur: "Air", mulai: [6, 21],
    keterangan: "Seperti air; tenang, bisa menghanyutkan/merusak. Temannya adalah yang bertabiat air, musuhnya yang berzodiak Aquarius atau yang bertabiat api. Hewannya kepiting, kayunya pohon ketapang. Sering sakit kepala/pusing, terkadang pingsan, sakit parah di umur 8 tahun. Badannya tinggi ideal. Lantang suaranya. Bila nafsu sudah menguasai maka ia seperti akan membunuh orang. Pasangan hidupnya banyak yang membuat masalah/bencana. Pekerjaan yang cocok adalah bercocok tanam. Mata cincinnya berwarna hijau. Hari baiknya adalah Senin, bulan baik adalah Rabiul Awal. Hari naasnya Ahad, bulan naasnya Sya'ban. Bila sakit obatnya adalah makan ayam bulu hitam atau kambing bulu hitam, digoreng menggunakan minyak wijen tanpa garam." },
  { nama: "Asad", padanan: "Leo", planet: "Syams", unsur: "Api", mulai: [7, 23],
    keterangan: "Matahari; nyala api, teman yang cocok yang bertabiat api dan angin atau yang berzodiak Aquarius. Musuhnya Pisces atau yang bertabiat air dan tanah. Hewannya macan tutul/kumbang. Kayunya pohon jeruk. Wajahnya manis. Bila marah seperti akan membunuh orang, tidak mempunyai keturunan banyak. Sering sakit demam. Banyak hartanya tapi banyak hasut/iri dengki. Cincin yang cocok cincin yang bermata merah. Hari baiknya Ahad. Bulan baiknya adalah Jumadil Awal. Hari naasnya Sabtu, bulan naas Dzulhijjah. Bila sakit obatnya ayam bulu merah atau kambing merah digoreng tanpa garam." },
  { nama: "Sunbulah", padanan: "Virgo", planet: "Utarid", unsur: "Tanah", mulai: [8, 23],
    keterangan: "Layaknya tanah; kukuh keras kepala. Mempunyai banyak ilmu pengetahuan, cocok menjadi petani, dermawan dan belas kasih kepada orang miskin. Musuhnya orang dekat. Cincin yang cocok yang bermata merah. Bulan baiknya Jumadil Akhir, hari baiknya Rabu dan Kamis. Hari naasnya Sabtu dan Selasa, bulan naasnya Dzulqo'dah. Bila sakit obatnya makan daging kambing merah atau ayam merah, digoreng dengan minyak wijen tanpa diberi garam." },
  { nama: "Mizan", padanan: "Libra", planet: "Zuhrah", unsur: "Angin", mulai: [9, 23],
    keterangan: "Bagai angin, warnanya putih semu kuning, musuhnya yang berzodiak Sagitarius, teman yang cocok yang berzodiak Aries atau yang bertabiat angin. Mendapatkan bencana dari wanita. Ketika umur 7 tahun sakit parah, jika sembuh umurnya bisa mencapai 80 tahun. Cincinnya yang bermata hijau. Hari baiknya Jumat, bulan baiknya Rojab. Hari naasnya Sabtu, bulan naasnya Dzulhijjah. Bila sakitnya obatnya makan ayam jago bulu putih digoreng menggunakan minyak wijen tanpa digarami." },
  { nama: "Aqrob", padanan: "Scorpio", planet: "Marikh", unsur: "Air", mulai: [10, 23],
    keterangan: "Seperti air di sungai. Teman yang cocok yang berzodiak Taurus atau yang bertabiat air, musuhnya yang bertabiat api. Wajahnya halus. Pribadi yang jujur. Dapat diandalkan menjadi pemimpin. Mempunyai banyak keturunan. Pekerjaan yang tepat adalah berdagang. Sering sakit perut. Cincinnya yang cocok yang bermata hijau. Bila sakit obatnya adalah daging kambing. Umurnya bisa mencapai 80 tahun. Hari baiknya Kamis, bulan baiknya Sya'ban. Hari naasnya Rabu, bulan naasnya Muharram." },
  { nama: "Qous", padanan: "Sagitarius", planet: "Musytari", unsur: "Api", mulai: [11, 22],
    keterangan: "Nyala api berkobar, temannya adalah yang bertabiat api dan angin, musuhnya adalah yang bertabiat air atau berzodiak Cancer. Menghormati dan asih terhadap tamunya. Pada umur 10 tahun sakit parah. Dapat diandalkan menjadi pemimpin. Cincinnya yang cocok yang bermata hitam. Tidak disukai oleh pembesar/tokoh masyarakat. Bila ada wanita sembarangan memberi makanan jangan lalu dimakan. Bila sakit obatnya adalah ayam bulu hitam digoreng." },
  { nama: "Jadyu", padanan: "Capricorn", planet: "Zuhal", unsur: "Tanah", mulai: [12, 22],
    keterangan: "Tanah rasi bintang kambing di lautan. Temannya yang berzodiak Cancer, musuhnya yang bertabiat angin dan api. Kulitnya semu putih. Pintar berbohong, banyak keinginannya, sering marah diam (ngambek). Dapat dipercaya oleh teman-temannya. Sering sakit pusing. Jika gugup menjadi bengis (ilmu kepepet). Tidak disukai orang kaya. Umur 10 tahun mengalami sakit parah. Cincinnya yang cocok yang bermata hitam. Hari baiknya Sabtu, bulan baiknya Syawal. Hari naasnya Rabu, bulan naasnya Jumadil Awal. Jika sakit obatnya daging kambing atau ayam hitam." },
  { nama: "Dalwu", padanan: "Aquarius", planet: "Zuhal", unsur: "Angin", mulai: [1, 20],
    keterangan: "Angin badai Saturnus, kuat akal/logikanya. Temannya yang cocok yang berzodiak Leo atau yang bertabiat angin. Musuhnya yang berzodiak Cancer atau yang bertabiat tanah. Hewannya macan. Suaranya lantang/keras, sedikit berkahnya. Badannya ideal. Menghormati dan belas kasih terhadap tamu. Terkadang mendapat rizki yang sangat lancar namun juga cepat habis. Cincinnya yang cocok yang bermata merah. Bulan baiknya adalah Dzulqo'dah, hari baiknya Sabtu. Hari naasnya Selasa, bulan naasnya Jumadil Akhir. Jika sakit obatnya daging burung dara hitam." },
  { nama: "Huut", padanan: "Pisces", planet: "Musytari", unsur: "Air", mulai: [2, 19],
    keterangan: "Seperti air di danau kecil. Temannya yang cocok yang berzodiak Virgo atau yang bertabiat tanah. Musuhnya yang berzodiak Leo atau yang bertabiat api. Hewannya ikan, kayu pohon jeruk. Rezeki berasal dari dalam bumi (yang berhubungan dengan tanah). Pekerjaan yang cocok adalah bertani atau berdagang. Cincinnya yang cocok yang bermata merah. Hari baiknya Kamis, bulan baiknya Dzulhijjah. Hari naasnya Selasa, bulan naasnya Rojab. Jika sakit obatnya daging hewan air (ikan)." },
];

function burujOf(date) {
  return cyclicLookup(BURUJ, date.getMonth() + 1, date.getDate());
}

// ================= TABIAT — Mode 2 "Sesuai Kitab" [SOLID — dijupuk langsung saka app asli] =================
// Beda karo Zodiak/Tabiat Mode 1 ing ndhuwur (adhedhasar tanggal lair). Mode 2
// iki adhedhasar JENENG ANAK + JENENG IBU (kudu aksara Arab). Rumus: total =
// abjad(nama)+abjad(namaIbu); sisa = total%12; idx = sisa!=0 ? sisa-1 : 0.
// Cathetan: kode asli duwe "kuirk" -- yen turahe pas 0 (kena dibagi rata 12),
// idx dibalekake menyang 0 (Haml) maneh, dudu 11 (Huut) -- tegese Huut mula
// praktis meh ora tau kena metu. Ditiru persis padha karo app asli, dudu
// didandani, supaya isih cocog karo aplikasi referensi.
function tabiatMode2Of(nama, namaIbu) {
  const v1 = abjadAnalyze(nama).total;
  const v2 = abjadAnalyze(namaIbu).total;
  const total = v1 + v2;
  const sisa = total % 12;
  const idx = sisa !== 0 ? sisa - 1 : 0;
  return { v1, v2, total, sisa, idx, ...BURUJ[idx] };
}

// ================= MANZILAH [ephemeris rembulan nyata, jeneng wangun tanpa "Al-" padha karo BURUJ] =================
// Jeneng ditulis wangun dhasar (tanpa artikel "al-/asy-/adz-" sing kelebur
// karo huruf syamsiyah) supaya konsisten karo gaya BURUJ (Haml, dudu Al-Hamal).
// arab/arti: ejaan Arab standar lan makna ringkes, dicek riset web (dudu saka
// app referensi — Manzilah pancen dudu fitur app asli, digarap dhewe miturut
// dhawuh Gus Fi). Isih USULAN, ejaan Arab durung ditashih.
const MANZILAH = [
  { nama: "Syarathan", arab: "الشرطين", arti: "loro tandha (rai wedhus/Aries)" },
  { nama: "Buthain", arab: "البطين", arti: "weteng cilik" },
  { nama: "Tsurayya", arab: "الثريا", arti: "gugusan lintang Kartika (Pleiades)" },
  { nama: "Dabaran", arab: "الدبران", arti: "sing ngetutake (Aldebaran)" },
  { nama: "Haq'ah", arab: "الهقعة", arti: "tutul putih ing sirah kewan" },
  { nama: "Han'ah", arab: "الهنعة", arti: "tatu/lecet" },
  { nama: "Dzira'", arab: "الذراع", arti: "lengen" },
  { nama: "Natsrah", arab: "النثرة", arti: "cukit irung singa" },
  { nama: "Tharaf", arab: "الطرف", arti: "pandelengan/mripat singa" },
  { nama: "Jabhah", arab: "الجبهة", arti: "bathuk singa" },
  { nama: "Zubrah", arab: "الزبرة", arti: "githok/gerung singa" },
  { nama: "Sharfah", arab: "الصرفة", arti: "pangalihe hawa (mangsa)" },
  { nama: "'Awwa'", arab: "العواء", arti: "sing njenggung" },
  { nama: "Simak", arab: "السماك", arti: "sing dhuwur/nengen (Spica)" },
  { nama: "Ghafr", arab: "الغفر", arti: "tutup/pangayoman" },
  { nama: "Zubani", arab: "الزبانى", arti: "capit kalajengking (Libra)" },
  { nama: "Iklil", arab: "الإكليل", arti: "makutha" },
  { nama: "Qalb", arab: "القلب", arti: "ati/jantung kalajengking (Antares)" },
  { nama: "Saulah", arab: "الشولة", arti: "cucuk/eri kalajengking" },
  { nama: "Na'aim", arab: "النعائم", arti: "unta-unta" },
  { nama: "Baladah", arab: "البلدة", arti: "negara/panggonan sepi" },
  { nama: "Sa'd Dzabih", arab: "سعد الذابح", arti: "begja sing nyembeleh" },
  { nama: "Sa'd Bula'", arab: "سعد بلع", arti: "begja sing nguntal" },
  { nama: "Sa'd Su'ud", arab: "سعد السعود", arti: "begja-begjaning kabegjan" },
  { nama: "Sa'd Akhbiyyah", arab: "سعد الأخبية", arti: "begja tarub/tenda" },
  { nama: "Fargh Muqaddam", arab: "الفرغ المقدم", arti: "cangkem ember ngarep" },
  { nama: "Fargh Mu'akhkhar", arab: "الفرغ المؤخر", arti: "cangkem ember mburi" },
  { nama: "Bathn Hut", arab: "بطن الحوت", arti: "weteng iwak" },
];

// Dawa 1 manzil = 360/28 derajat (pambagen rata garis ekliptika, diwiwiti
// saka titik Aries 0 derajat — padha karo wiwitan BURUJ Haml). Posisi rembulan
// dietung nganggo rumus ekliptika bujur geosentris "low-precision" Meeus
// (Astronomical Algorithms bab 47), akurasi lumrahe sak-derajat — luwih cedhak
// menyang ephemeris nyata tinimbang mung ngetung dina-ke-n sasi Hijriyah.
function moonEclipticLongitude(date) {
  const JD = toJulianDate(date);
  const T = (JD - 2451545.0) / 36525;
  const norm = (d) => ((d % 360) + 360) % 360;
  const Lp = norm(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + (T ** 3) / 538841 - (T ** 4) / 65194000);
  const D = toRad(norm(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + (T ** 3) / 545868 - (T ** 4) / 113065000));
  const M = toRad(norm(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + (T ** 3) / 24490000));
  const Mp = toRad(norm(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + (T ** 3) / 69699 - (T ** 4) / 14712000));
  const F = toRad(norm(93.272095 + 483202.0175233 * T - 0.0036539 * T * T - (T ** 3) / 3526000 + (T ** 4) / 863310000));
  const dLon =
    6.289 * Math.sin(Mp) +
    1.274 * Math.sin(2 * D - Mp) +
    0.658 * Math.sin(2 * D) +
    0.214 * Math.sin(2 * Mp) -
    0.186 * Math.sin(M) -
    0.114 * Math.sin(2 * F) -
    0.059 * Math.sin(2 * D - 2 * Mp) -
    0.057 * Math.sin(2 * D - M - Mp) +
    0.053 * Math.sin(2 * D + Mp) +
    0.046 * Math.sin(2 * D - M) +
    0.041 * Math.sin(Mp - M) -
    0.035 * Math.sin(D) -
    0.031 * Math.sin(Mp + M) -
    0.015 * Math.sin(2 * F - 2 * D) +
    0.011 * Math.sin(Mp - 4 * D);
  return norm(Lp + dLon);
}

function manzilahOf(date) {
  const lon = moonEclipticLongitude(date);
  const idx = Math.min(27, Math.floor(lon / (360 / 28)));
  return { derajat: lon, urutan: idx + 1, ...MANZILAH[idx] };
}

// ================= TABIAT ABJAD [nilai SOLID, tafsir USULAN] =================
const ABJAD_HURUF = [
  { huruf: "ا", nilai: 1 }, { huruf: "ب", nilai: 2 }, { huruf: "ج", nilai: 3 }, { huruf: "د", nilai: 4 },
  { huruf: "ه", nilai: 5 }, { huruf: "و", nilai: 6 }, { huruf: "ز", nilai: 7 },
  { huruf: "ح", nilai: 8 }, { huruf: "ط", nilai: 9 }, { huruf: "ي", nilai: 10 },
  { huruf: "ك", nilai: 20 }, { huruf: "ل", nilai: 30 }, { huruf: "م", nilai: 40 }, { huruf: "ن", nilai: 50 },
  { huruf: "س", nilai: 60 }, { huruf: "ع", nilai: 70 }, { huruf: "ف", nilai: 80 }, { huruf: "ص", nilai: 90 },
  { huruf: "ق", nilai: 100 }, { huruf: "ر", nilai: 200 }, { huruf: "ش", nilai: 300 }, { huruf: "ت", nilai: 400 },
  { huruf: "ث", nilai: 500 }, { huruf: "خ", nilai: 600 }, { huruf: "ذ", nilai: 700 },
  { huruf: "ض", nilai: 800 }, { huruf: "ظ", nilai: 900 }, { huruf: "غ", nilai: 1000 },
];
const ABJAD_MAP = Object.fromEntries(ABJAD_HURUF.map((h) => [h.huruf, h.nilai]));

function abjadTotal(hurufArray) {
  return hurufArray.reduce((sum, h) => sum + (ABJAD_MAP[h] || 0), 0);
}

// Normalisasi varian wangun huruf (hamza/alif/ta marbuta/alif maqsura) menyang
// huruf dhasar, supaya teks bebas (ayat/tembung) sing dhempel harakat isih
// bisa dietung. Harakat/tatwil/spasi diabaikan (dudu huruf, ora ngganggu total).
const ABJAD_NORMALIZE = {
  "أ": "ا", "إ": "ا", "آ": "ا", "ٱ": "ا",
  "ة": "ه", // ta marbuta diitung minangka ha, konvensi hisab jumal umum
  "ى": "ي", // alif maqsura
  "ئ": "ي", "ؤ": "و", "ء": "ا",
};
const DIACRITICS_RE = /[\u064B-\u065F\u0670\u0640\s]/g; // harakat, sukun, tatwil, spasi

// Nganalisa teks Arab bebas (tembung/ukara/ayat): total nilai abjad,
// cacah huruf, cacah tembung, lan frekuensi saben huruf.
function abjadAnalyze(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const cleaned = text.replace(DIACRITICS_RE, "");
  const freq = {};
  let total = 0;
  let letterCount = 0;
  for (const ch of cleaned) {
    const base = ABJAD_NORMALIZE[ch] || ch;
    if (ABJAD_MAP[base] === undefined) continue; // dudu huruf hijaiyah, langkahi
    letterCount++;
    total += ABJAD_MAP[base];
    freq[base] = (freq[base] || 0) + 1;
  }
  return { total, letterCount, wordCount: words.length, freq };
}

// Urutan tombol kaya keyboard fisik Arab (Saudi/QWERTY-mapped: baris ذ / ض..د / ش..ط / ر..ظ),
// dudu urutan alfabet/hijaiyah maca — supaya jari sing wis kulina keyboard Arab ora bingung.
// Pisah karo urutan abjad ing calc di ndhuwur (kuwi urutan kanggo nilai/hisab jumal).
const HIJAIYAH_URUT = [
  "ذ",
  "ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د",
  "ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط",
  "ر", "و", "ز", "ظ",
];

// ================= SA'AT KAWAKIB [jam TERVALIDASI + label apik/ala miturut dhawuh Gus Fi] =================
// PERINGATAN FIQH: iki warisan ilmu falak-nujum klasik (Abu Ma'syar, tradisi
// kitab Syamsul Ma'arif), DUDU bagean ilmu falak fiqh-baku (arah kiblat/waktu
// sholat/hilal). Miturut riset, sumber sing padha nyebutake: iki dudu kewajiban
// agama, cukup diwiwiti Basmalah wae kanthi wektu apa wae. Label "apik/ala/netral"
// (CHALDEAN_LABEL ing ndhuwur) ditampilake miturut dhawuh Gus Fi 16 Agustus.
// Jeneng planet dijupuk padha karo BURUJ (Marikh/Utarid) supaya siji ejaan wae
// sak-jerone app — sadurunge tanpa disengaja beda (Mirrikh/Uthorid), gawe
// lookup CHALDEAN_ARAB[b.planet] ing layar Zodiak bali "undefined".
const CHALDEAN_ORDER = ["Zuhal", "Musytari", "Marikh", "Syams", "Zuhrah", "Utarid", "Qomar"];
const CHALDEAN_PADANAN = { Zuhal: "Saturnus", Musytari: "Yupiter", Marikh: "Mars", Syams: "Srengenge", Zuhrah: "Venus", Utarid: "Merkurius", Qomar: "Rembulan" };
const CHALDEAN_ARAB = { Zuhal: "زُحَل", Musytari: "المُشْتَرِي", Marikh: "المِرِّيخ", Syams: "الشَّمْس", Zuhrah: "الزُّهْرَة", Utarid: "عُطَارِد", Qomar: "القَمَر" };
// Tafsir "apik/ala" miturut tradisi klasik (benefik/malefik): Musytari &
// Zuhrah = benefik gedhe/cilik (apik), Zuhal & Marikh = malefik (ala),
// Syams condong apik, Utarid & Qomar netral (owah miturut apa sing ndeketi).
const CHALDEAN_LABEL = { Zuhal: "ala", Musytari: "apik", Marikh: "ala", Syams: "apik", Zuhrah: "apik", Utarid: "netral", Qomar: "netral" };
// Index CHALDEAN_ORDER sing mangku jam kaping-1 (0=Minggu...6=Sabtu, padha karo Date.getDay())
const DAY_RULER_START_INDEX = [3, 6, 2, 5, 1, 4, 0];

function toRad(d) { return (d * Math.PI) / 180; }
function toDeg(r) { return (r * 180) / Math.PI; }

// Julian Date (kanthi pecahan jam) — algoritma standar NOAA/Meeus.
function toJulianDate(dateUTC) {
  return dateUTC.getTime() / 86400000 + 2440587.5;
}

// Wektu srengenge terbit/surup (UTC minutes-from-midnight) kanggo tanggal (Date,
// dianggep tengah dina UTC minangka acuan), lintang/bujur (derajat).
// Algoritma NOAA Solar Calculator (adhedhasar Meeus, Astronomical Algorithms).
function sunTimesUTC(dateUTC, lat, lon) {
  const JD = toJulianDate(dateUTC);
  const JC = (JD - 2451545) / 36525;
  const L0 = (280.46646 + JC * (36000.76983 + JC * 0.0003032)) % 360;
  const M = 357.52911 + JC * (35999.05029 - 0.0001537 * JC);
  const e = 0.016708634 - JC * (0.000042037 + 0.0000001267 * JC);
  const Mr = toRad(M);
  const C =
    Math.sin(Mr) * (1.914602 - JC * (0.004817 + 0.000014 * JC)) +
    Math.sin(2 * Mr) * (0.019993 - 0.000101 * JC) +
    Math.sin(3 * Mr) * 0.000289;
  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * JC;
  const appLong = trueLong - 0.00569 - 0.00478 * Math.sin(toRad(omega));
  const meanObliq = 23 + (26 + (21.448 - JC * (46.815 + JC * (0.00059 - JC * 0.001813))) / 60) / 60;
  const obliqCorr = meanObliq + 0.00256 * Math.cos(toRad(omega));
  const decl = Math.asin(Math.sin(toRad(obliqCorr)) * Math.sin(toRad(appLong)));
  const y = Math.pow(Math.tan(toRad(obliqCorr / 2)), 2);
  const EoT =
    4 *
    toDeg(
      y * Math.sin(2 * toRad(L0)) -
        2 * e * Math.sin(Mr) +
        4 * e * y * Math.sin(Mr) * Math.cos(2 * toRad(L0)) -
        0.5 * y * y * Math.sin(4 * toRad(L0)) -
        1.25 * e * e * Math.sin(2 * Mr)
    );
  const latR = toRad(lat);
  const cosHA = Math.cos(toRad(90.833)) / (Math.cos(latR) * Math.cos(decl)) - Math.tan(latR) * Math.tan(decl);
  const cosHAClamped = Math.max(-1, Math.min(1, cosHA)); // jaga-jaga lintang ekstrem
  const HA = toDeg(Math.acos(cosHAClamped));
  const solarNoon = 720 - 4 * lon - EoT;
  return { sunriseMin: solarNoon - 4 * HA, sunsetMin: solarNoon + 4 * HA };
}

// Bali menyang wektu srengenge terbit/surup (Date, UTC) kanggo tanggal kalender
// tartamtu (dianggep tanggal ing zona wektu lokal, dikonversi liwat tengah dina UTC).
function sunTimesOn(y, m, d, lat, lon) {
  const noonUTC = new Date(Date.UTC(y, m, d, 12, 0, 0));
  const { sunriseMin, sunsetMin } = sunTimesUTC(noonUTC, lat, lon);
  const dayStartUTC = Date.UTC(y, m, d, 0, 0, 0);
  return {
    sunrise: new Date(dayStartUTC + sunriseMin * 60000),
    sunset: new Date(dayStartUTC + sunsetMin * 60000),
  };
}

// Wewengkon "dina petungan" Sa'at Kawakib mlaku terbit->terbit sabanjure (dudu
// tengah wengi->tengah wengi), sesuai konvensi klasik sing ditemokake ing riset.
function planetaryHourOf(date, lat, lon) {
  const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
  const today = sunTimesOn(y, m, d, lat, lon);
  let rulerDate, dayStart, dayEnd, nightStart, nightEnd;
  if (date < today.sunrise) {
    // during tekan terbit dina iki -> isih bagean wengi "dina petungan" wingi
    const prev = new Date(y, m, d - 1);
    const prevSun = sunTimesOn(prev.getFullYear(), prev.getMonth(), prev.getDate(), lat, lon);
    rulerDate = prev;
    dayStart = prevSun.sunrise; dayEnd = prevSun.sunset;
    nightStart = prevSun.sunset; nightEnd = today.sunrise;
  } else if (date < today.sunset) {
    rulerDate = date;
    dayStart = today.sunrise; dayEnd = today.sunset;
    const tmr = new Date(y, m, d + 1);
    const tmrSun = sunTimesOn(tmr.getFullYear(), tmr.getMonth(), tmr.getDate(), lat, lon);
    nightStart = today.sunset; nightEnd = tmrSun.sunrise;
  } else {
    rulerDate = date;
    dayStart = today.sunrise; dayEnd = today.sunset;
    const tmr = new Date(y, m, d + 1);
    const tmrSun = sunTimesOn(tmr.getFullYear(), tmr.getMonth(), tmr.getDate(), lat, lon);
    nightStart = today.sunset; nightEnd = tmrSun.sunrise;
  }
  const dayHourLen = (dayEnd - dayStart) / 12;
  const nightHourLen = (nightEnd - nightStart) / 12;
  let hourIndex, hourStart, hourEnd;
  if (date >= dayStart && date < dayEnd) {
    hourIndex = Math.min(12, Math.floor((date - dayStart) / dayHourLen) + 1);
    hourStart = new Date(dayStart.getTime() + (hourIndex - 1) * dayHourLen);
    hourEnd = new Date(dayStart.getTime() + hourIndex * dayHourLen);
  } else {
    const base = date >= nightStart ? nightStart : new Date(nightStart.getTime() - 86400000);
    hourIndex = 12 + Math.min(12, Math.floor((date - nightStart) / nightHourLen) + 1);
    hourStart = new Date(nightStart.getTime() + (hourIndex - 13) * nightHourLen);
    hourEnd = new Date(nightStart.getTime() + (hourIndex - 12) * nightHourLen);
  }
  const startIdx = DAY_RULER_START_INDEX[rulerDate.getDay()];
  const planet = CHALDEAN_ORDER[(startIdx + hourIndex - 1) % 7];
  return {
    planet, hourIndex, hourStart, hourEnd,
    label: CHALDEAN_LABEL[planet],
    rulerWeekday: HARI_NAMA[rulerDate.getDay()],
    dayRulerPlanet: CHALDEAN_ORDER[startIdx],
    sunrise: dayStart, sunset: dayEnd, nightEnd,
    dayHourLenMin: dayHourLen / 60000, nightHourLenMin: nightHourLen / 60000,
    hukum: hourIndex <= 12 ? SAAT_KAWAKIB_HUKUM[rulerDate.getDay()][hourIndex - 1] : null, // mung jam rina
  };
}

// Hukum/kegunaan saben jam rina (jam 1-12) miturut dinten [USULAN — during
// ditashih, PERLU NGATI-ATI EKSTRA]. Sumbere Gus Fi ngirim kaca kitab
// menyang ChatGPT, banjur ChatGPT sing nyusun/nerangake dadi tabel iki —
// Dul DHEWE during tau ndeleng kaca kitab asline, dadi during bisa
// mbandhingake langsung kaya sing dilakoni kanggo Wuku/Betaljemur (sing
// dibaca Dul langsung saka PDF asli). Urutan planet-e (CHALDEAN_ORDER,
// dikonfirmasi cocog karo DAY_RULER_START_INDEX sing wis SOLID) dipercaya,
// nanging teks "hukum" panganggo saben jam iki durung diverifikasi
// primer — mangga tashih Gus Fi, utawa yen isih nyimpen kaca kitab asline,
// apike dicocogake maneh langsung.
const SAAT_KAWAKIB_HUKUM = [
  // 0 Ahad (Minggu)
  [
    "Apik kanggo mahabbah, qabul, sowan ngarep raja/panguwasa, prekara hukum, lan nganggo busana anyar.",
    "Jam madzmumah (ala) — ora dianjurake kanggo tumindak wigati.",
    "Apik kanggo lelungan, tulis-tulis, mahabbah, qabul, lan prekara komunikasi.",
    "Ora dianjurake kanggo tuku, dagang, lan transaksi.",
    "Kanggo pisahan, mungsuhan, sengit, lan prekara sing sipate atos.",
    "Apik kanggo nyuwun hajat marang para raja/panguwasa.",
    "Ora sae kanggo tumindak umum.",
    "Sae banget, cocog kanggo akeh hajat lan macem-macem urusan.",
    "Apik kanggo nulis marang wong, narik simpati, mahabbah, lan nyenengake ati.",
    "Apik kanggo urusan tulisan, dagang/komunikasi lan prekara intelektual.",
    "Apik kanggo talisman, cincin/jimat lan prekara sing sesambungan karo barang tartamtu.",
    "Ora dianjurake, kajaba prekara sing sipate negatif/mbebayani.",
  ],
  // 1 Senin
  [
    "Mahabbah, narik ati, lan prekara qabul.",
    "Lelungan lan perjalanan.",
    "Nulis kitab, layang, lan prekara tulisan.",
    "Prekara sesambungan karo konflik/lelara lan perkara abot.",
    "Nyenengake ati/narik simpati lan prekara qabul.",
    "Prekara perawatan, pangobatan, lan perkara wanita.",
    "Ngalahake/nalikake lisan, komunikasi lan perkara qabul.",
    "Nikah lan rukun antarane wong sing beda.",
    "Pisahan, mungsuhan, sengit.",
    "Jam sing sae banget, cocog kanggo macem-macem hajat.",
    "Prekara mungsuhan, perang, lan getih.",
    "Prekara nalikake, nutup, utawa perkara-perkara tartamtu.",
  ],
  // 2 Selasa
  [
    "Prekara sing sipate keras/wani, nanging ora kanggo perkara alus.",
    "Qabul lan pangestu, mligine tumrap panguwasa.",
    "Obat/pangobatan, wanita, lan pernikahan.",
    "Dagang, tuku, adol, lan komunikasi.",
    "Ora dianjurake kanggo tumindak wigati.",
    "Nulis prekara lelara, perkara abot, lsp.",
    "Apik kanggo kabutuhan lan barang sing dikarepake.",
    "Prekara kekuatan, konflik, lan urusan abot.",
    "Nikah, mahabbah, lan qabul.",
    "Ora dianjurake kanggo tumindak.",
    "Bisa kanggo ngatur lelungan/perjalanan lan prekara komunikasi.",
    "Apik kanggo prekara mungsuhan, karusakan, pegatan, lan liya-liyane.",
  ],
  // 3 Rebo (Rabu)
  [
    "Qabul, tulisan, lan prekara intelektual.",
    "Ora dianjurake.",
    "Perkara lelara, tatu, lan prekara abot.",
    "Apik kanggo hajat umum.",
    "Prekara mungsuhan, getih, lan perkara keras.",
    "Hajat, qabul, lan prekara panguwasa.",
    "Mahabbah lan kualitas/asil sing sae.",
    "Tulisan, sinau, lan urusan anak.",
    "Ora sae kanggo pegatan, mungsuhan, lan fitnah.",
    "Apik kanggo sowan/ngadhep panguwasa lan wong sing duwe kedudukan.",
    "Apik kanggo qabul, perjanjian, lan rembugan karo panguwasa.",
    "Prekara mungsuhan lan perkara kasar.",
  ],
  // 4 Kemis (Kamis)
  [
    "Rejeki, dagang, qabul, lan asil.",
    "Prekara abot, paukuman, lan perkara sing atos.",
    "Qabul lan prekara panguwasa, kalebu lelungan tartamtu.",
    "Mahabbah lan nikah.",
    "Akad antarane priya-wanita, tulisan, lan komunikasi.",
    "Lelungan dharat/segara lan macem-macem pakaryan.",
    "Prekara tartamtu sing sesambungan karo tulisan/ahli tulis.",
    "Sae kanggo saben pakaryan.",
    "Kanggo sowan raja/panguwasa.",
    "Nyuwun hajat marang para pejabat, pangeran, lan wong sing duwe kedudukan.",
    "Qabul lan mahabbah.",
    "Ora dianjurake, jam sing ala/madzmumah.",
  ],
  // 5 Jemuwah (Jumat)
  [
    "Mahabbah, lamaran, lan nikah.",
    "Talisman/tulisan lan tembung-tembung.",
    "Ora dianjurake, jam ala.",
    "Prekara ndhudhuk, sumur, lemah, lan barang-barang ing lemah.",
    "Qabul, wanita, para raja/panguwasa.",
    "Prekara sowan panguwasa lan perkara hukum.",
    "Lamaran lan nikah.",
    "Prekara kerja lan komunikasi.",
    "Pisahan lan fitnah — nanging miturut sumber, respone cepet.",
    "Sumber during cetha kanggo jam iki.",
    "Sumber during cetha kanggo jam iki.",
    "Lelungan lan nindakake hajat tartamtu.",
  ],
  // 6 Setu (Sabtu)
  [
    "Qabul lan mahabbah miturut sumber.",
    "Rukun antarane wong.",
    "Mungsuhan lan perkara ala.",
    "Sowan panguwasa/raja lan perkara hukum.",
    "Prekara mahabbah lan perkara wanita.",
    "Tulisan lan prekara dagang/pakaryan tartamtu.",
    "Ora sae, ora dianjurake kanggo pakaryan.",
    "Lelara, obat, tatu, lan prekara abot.",
    "Apik kanggo macem-macem tumindak/hajat.",
    "Prekara perkara keras.",
    "Qabul nalika sowan raja, menteri, lan para pembesar.",
    "Kalebu prekara mahabbah/pernikahan.",
  ],
];

// Tabel lengkap 24 jam kanggo "dina petungan" sing ana ing date (terbit->terbit sabanjure).
function planetaryHourTable(date, lat, lon) {
  const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
  const info = planetaryHourOf(date, lat, lon);
  // itung ulang wiwitan dina petungan (supaya tabel konsisten karo info.rulerWeekday)
  let rulerDate = date;
  if (date < sunTimesOn(y, m, d, lat, lon).sunrise) rulerDate = new Date(y, m, d - 1);
  const rs = sunTimesOn(rulerDate.getFullYear(), rulerDate.getMonth(), rulerDate.getDate(), lat, lon);
  const tmr = new Date(rulerDate.getFullYear(), rulerDate.getMonth(), rulerDate.getDate() + 1);
  const tmrSun = sunTimesOn(tmr.getFullYear(), tmr.getMonth(), tmr.getDate(), lat, lon);
  const dayLen = (rs.sunset - rs.sunrise) / 12;
  const nightLen = (tmrSun.sunrise - rs.sunset) / 12;
  const startIdx = DAY_RULER_START_INDEX[rulerDate.getDay()];
  const rows = [];
  for (let h = 1; h <= 24; h++) {
    const isDay = h <= 12;
    const base = isDay ? rs.sunrise : rs.sunset;
    const len = isDay ? dayLen : nightLen;
    const idx = isDay ? h - 1 : h - 13;
    rows.push({
      hourIndex: h,
      start: new Date(base.getTime() + idx * len),
      end: new Date(base.getTime() + (idx + 1) * len),
      planet: CHALDEAN_ORDER[(startIdx + h - 1) % 7],
      label: CHALDEAN_LABEL[CHALDEAN_ORDER[(startIdx + h - 1) % 7]],
      isCurrent: h === info.hourIndex,
      hukum: isDay ? SAAT_KAWAKIB_HUKUM[rulerDate.getDay()][h - 1] : null, // mung jam rina, during ana data jam wengi
    });
  }
  return { rows, rulerWeekday: HARI_NAMA[rulerDate.getDay()], sunrise: rs.sunrise, sunset: rs.sunset, nextSunrise: tmrSun.sunrise };
}

