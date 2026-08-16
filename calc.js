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
  return { nama: WUKU[idx], urutan: idx + 1 };
}

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
  };
}

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
    });
  }
  return { rows, rulerWeekday: HARI_NAMA[rulerDate.getDay()], sunrise: rs.sunrise, sunset: rs.sunset, nextSunrise: tmrSun.sunrise };
}

