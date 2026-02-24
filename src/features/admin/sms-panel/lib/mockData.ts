// src/features/admin/sms-panel/lib/mockData.ts
import type { SmsStats, SmsHistoryItem, SmsRecipient, CustomerCategory } from "./types";

export const mockStats: SmsStats = {
  remainingQuota: 500,
  totalSent: 1250,
  successCount: 1180,
  failCount: 70,
};

export const mockHistory: SmsHistoryItem[] = [
  {
    id: "1",
    recipientName: "Ahmet Yılmaz",
    recipientPhone: "0532 123 4567",
    message: "Sayın Ahmet Bey, Sakarya Adapazarı'nda yeni ilanlarımız yayında. Detaylar için sitemizi ziyaret edin.",
    status: "sent",
    sentAt: "2026-02-22T10:30:00",
  },
  {
    id: "2",
    recipientName: "Fatma Şahin",
    recipientPhone: "0533 234 5678",
    message: "Sayın Fatma Hanım, kiralık daire ilanınız onaylandı. İyi günler dileriz.",
    status: "sent",
    sentAt: "2026-02-22T09:15:00",
  },
  {
    id: "3",
    recipientName: "Mehmet Demir",
    recipientPhone: "0535 345 6789",
    message: "Sayın Mehmet Bey, mülkünüz için yeni bir teklif aldınız. Bilgi için bizi arayın.",
    status: "failed",
    sentAt: "2026-02-21T16:45:00",
  },
  {
    id: "4",
    recipientName: "Ayşe Kaya",
    recipientPhone: "0536 456 7890",
    message: "Sayın Ayşe Hanım, Serdivan bölgesinde yeni satılık konutlar eklendi.",
    status: "sent",
    sentAt: "2026-02-21T14:20:00",
  },
  {
    id: "5",
    recipientName: "Ali Özkan",
    recipientPhone: "0537 567 8901",
    message: "Sayın Ali Bey, kira sözleşmenizin yenileme tarihi yaklaşıyor. Detaylar için ofisimize uğrayın.",
    status: "sent",
    sentAt: "2026-02-21T11:00:00",
  },
  {
    id: "6",
    recipientName: "Zeynep Arslan",
    recipientPhone: "0538 678 9012",
    message: "Yenigün Emlak olarak yeni kampanyamızı duyurmak isteriz. %0 komisyon fırsatı!",
    status: "pending",
    sentAt: "2026-02-20T17:30:00",
  },
  {
    id: "7",
    recipientName: "Hasan Çelik",
    recipientPhone: "0539 789 0123",
    message: "Sayın Hasan Bey, Erenler'deki arsa ilanınıza 3 yeni ilgi geldi.",
    status: "sent",
    sentAt: "2026-02-20T13:10:00",
  },
  {
    id: "8",
    recipientName: "Elif Yıldırım",
    recipientPhone: "0541 890 1234",
    message: "Sayın Elif Hanım, talep ettiğiniz villa ilanları hazır. Randevu almak ister misiniz?",
    status: "sent",
    sentAt: "2026-02-20T10:45:00",
  },
  {
    id: "9",
    recipientName: "Mustafa Koç",
    recipientPhone: "0542 901 2345",
    message: "Sayın Mustafa Bey, dairenizin değerleme raporu hazırlandı. Ofisimizden teslim alabilirsiniz.",
    status: "failed",
    sentAt: "2026-02-19T15:20:00",
  },
  {
    id: "10",
    recipientName: "Selin Aydın",
    recipientPhone: "0543 012 3456",
    message: "Sayın Selin Hanım, Sapanca'da yeni kiralık yazlık ilanları eklendi. Kaçırmayın!",
    status: "sent",
    sentAt: "2026-02-19T09:30:00",
  },
];

export const turkishCities = [
  "Sakarya",
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Kocaeli",
  "Düzce",
  "Bolu",
];

// Districts per city (will be replaced by real API data)
export const districtsByCity: Record<string, string[]> = {
  Sakarya: [
    "Adapazarı", "Serdivan", "Erenler", "Arifiye", "Sapanca",
    "Hendek", "Karasu", "Geyve", "Taraklı",
    "Ferizli", "Kaynarca", "Pamukova", "Söğütlü", "Karapürçek",
    "Akyazı",
  ],
  İstanbul: [
    "Kadıköy", "Beşiktaş", "Üsküdar", "Şişli", "Bakırköy",
    "Ataşehir", "Maltepe", "Pendik", "Kartal", "Beylikdüzü",
    "Esenyurt", "Başakşehir", "Sarıyer", "Fatih", "Beyoğlu",
    "Bağcılar", "Küçükçekmece", "Bahçelievler", "Sultangazi", "Zeytinburnu",
  ],
  Ankara: [
    "Çankaya", "Keçiören", "Mamak", "Yenimahalle", "Etimesgut",
    "Sincan", "Altındağ", "Pursaklar", "Gölbaşı", "Polatlı",
    "Çubuk", "Beypazarı",
  ],
  İzmir: [
    "Konak", "Bornova", "Karşıyaka", "Buca", "Bayraklı",
    "Çiğli", "Gaziemir", "Balçova", "Narlıdere", "Karabağlar",
    "Torbalı", "Menemen", "Ödemiş", "Bergama",
  ],
  Bursa: [
    "Osmangazi", "Nilüfer", "Yıldırım", "Gemlik", "Mudanya",
    "İnegöl", "Gürsu", "Kestel", "Mustafakemalpaşa", "Orhangazi",
  ],
  Kocaeli: [
    "İzmit", "Gebze", "Darıca", "Çayırova", "Derince",
    "Gölcük", "Körfez", "Kartepe", "Başiskele", "Kandıra",
    "Dilovası", "Karamürsel",
  ],
  Düzce: [
    "Merkez", "Akçakoca", "Cumayeri", "Çilimli", "Gölyaka",
    "Gümüşova", "Kaynaşlı", "Yığılca",
  ],
  Bolu: [
    "Merkez", "Gerede", "Göynük", "Mengen", "Mudurnu",
    "Seben", "Dörtdivan", "Kıbrıscık", "Yeniçağa",
  ],
};

// Mock recipient counts (will be replaced by real API data)
export const mockRecipientCounts: Record<string, number> = {
  all: 347,
  // Cities
  Sakarya: 142,
  İstanbul: 85,
  Ankara: 38,
  İzmir: 27,
  Bursa: 22,
  Kocaeli: 18,
  Düzce: 9,
  Bolu: 6,
  // Sakarya districts
  Adapazarı: 45, Serdivan: 32, Erenler: 21, Arifiye: 14, Sapanca: 11,
  Hendek: 8, Karasu: 5, Kocaali: 3, Geyve: 2, Taraklı: 1,
  Ferizli: 2, Kaynarca: 1, Pamukova: 1, Söğütlü: 1, Karapürçek: 1, Akyazı: 3,
  // İstanbul districts
  Kadıköy: 12, Beşiktaş: 8, Üsküdar: 7, Şişli: 6, Bakırköy: 5,
  Ataşehir: 5, Maltepe: 4, Pendik: 4, Kartal: 3, Beylikdüzü: 4,
  Esenyurt: 6, Başakşehir: 3, Sarıyer: 2, Fatih: 4, Beyoğlu: 3,
  Bağcılar: 3, Küçükçekmece: 2, Bahçelievler: 2, Sultangazi: 1, Zeytinburnu: 1,
  // Ankara districts
  Çankaya: 10, Keçiören: 6, Mamak: 4, Yenimahalle: 5, Etimesgut: 4,
  Sincan: 3, Altındağ: 2, Pursaklar: 1, Gölbaşı: 1, Polatlı: 1, Çubuk: 1, Beypazarı: 1,
  // İzmir districts
  Konak: 6, Bornova: 4, Karşıyaka: 3, Buca: 3, Bayraklı: 2,
  Çiğli: 2, Gaziemir: 1, Balçova: 1, Narlıdere: 1, Karabağlar: 2,
  Torbalı: 1, Menemen: 1, Ödemiş: 1, Bergama: 1,
  // Bursa districts
  Osmangazi: 6, Nilüfer: 5, Yıldırım: 3, Gemlik: 2, Mudanya: 2,
  İnegöl: 2, Gürsu: 1, Kestel: 1, Mustafakemalpaşa: 1, Orhangazi: 1,
  // Kocaeli districts
  İzmit: 5, Gebze: 4, Darıca: 2, Çayırova: 1, Derince: 1,
  Gölcük: 1, Körfez: 1, Kartepe: 1, Başiskele: 1, Kandıra: 1,
  Dilovası: 1, Karamürsel: 1,
  // Düzce districts
  Merkez: 4, Akçakoca: 2, Cumayeri: 1, Çilimli: 1, Gölyaka: 1,
  Gümüşova: 1, Kaynaşlı: 1, Yığılca: 1,
  // Bolu districts
  Gerede: 2, Göynük: 1, Mengen: 1, Mudurnu: 1,
  Seben: 1, Dörtdivan: 1, Kıbrıscık: 1, Yeniçağa: 1,
  // Categories
  Kiracı: 128,
  "Ev Sahibi": 156,
  "Mülk Sahibi": 63,
};

// Mock recipients list (for phone number display)
const mockNames = [
  "Ahmet Yılmaz", "Fatma Şahin", "Mehmet Demir", "Ayşe Kaya", "Ali Özkan",
  "Zeynep Arslan", "Hasan Çelik", "Elif Yıldırım", "Mustafa Koç", "Selin Aydın",
  "Emre Kılıç", "Büşra Erdoğan", "Oğuzhan Yıldız", "Merve Aksoy", "Burak Çetin",
  "Derya Korkmaz", "Serkan Acar", "Gamze Polat", "Cem Öztürk", "Esra Karaca",
  "Tuncay Güneş", "Aslı Doğan", "Volkan Şen", "Deniz Bayrak", "Sibel Tekin",
  "Uğur Aydoğan", "Pınar Sarı", "Kadir Turan", "Neslihan Ünal", "Barış Yalçın",
];

const categoryList: CustomerCategory[] = ["Kiracı", "Ev Sahibi", "Mülk Sahibi"];

function generateRecipients(): SmsRecipient[] {
  const recipients: SmsRecipient[] = [];
  let id = 1;

  for (const city of turkishCities) {
    const districts = districtsByCity[city] ?? [];
    for (const district of districts) {
      const count = mockRecipientCounts[district] ?? 1;
      for (let i = 0; i < count; i++) {
        const name = mockNames[(id - 1) % mockNames.length];
        const phone = `05${30 + (id % 14)}${String(id * 137 % 10000000).padStart(7, "0")}`;
        const formatted = `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
        recipients.push({
          id: String(id),
          name,
          phone: formatted,
          city,
          district,
          category: categoryList[id % 3],
        });
        id++;
      }
    }
  }
  return recipients;
}

export const mockRecipients: SmsRecipient[] = generateRecipients();
