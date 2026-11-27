import type { JenisPelatihanItem, FokusItem } from "@/types";

export const initialJenisPelatihan: JenisPelatihanItem[] = [
  {
    id: "pel-1",
    nama: "Latsar CPNS",
    butirCount: 23,
    fokusCount: 6,
    useInstrumenInti: false,
  },
  {
    id: "pel-2",
    nama: "Coaching & Mentoring (ECM)",
    butirCount: 10,
    fokusCount: 5,
    useInstrumenInti: false,
  },
  {
    id: "pel-3",
    nama: "Pelatihan Kepemimpinan Administrator",
    useInstrumenInti: true,
  },
  {
    id: "pel-4",
    nama: "Pelatihan Teknis Umum",
    useInstrumenInti: true,
  },
];

export const initialFokusList: FokusItem[] = [
  {
    id: "fokus-1",
    number: 1,
    title: "1. Relevansi dan penerapan materi",
    subdimensiCount: 4,
    butirCount: 7,
    subdimensis: [
      {
        id: "sub-1-1",
        code: "1.1",
        title: "Kesempatan penerapan",
        indikatorCount: 1,
        butirCount: 2,
        indikators: [
          {
            id: "ind-1-1-1",
            code: "1.1.1",
            title: "Kesempatan penerapan",
            butirCount: 2,
            items: [
              {
                id: "butir-1-1-1-1",
                code: "1.1.1.1",
                text: "Tersedianya pekerjaan atau tugas yang memungkinkan penggunaan hasil pelatihan.",
                agendaHint: "Pengetahuan atau keterampilan dari agenda [nama agenda] telah diterapkan dalam pekerjaan.",
                categories: ["D", "A"],
              },
              {
                id: "butir-1-1-1-2",
                code: "1.1.1.2",
                text: "Alumni mampu mengidentifikasi peluang penerapan lanjutan di unit kerja.",
                categories: ["D"],
              },
            ],
          },
        ],
      },
      {
        id: "sub-1-2",
        code: "1.2",
        title: "Kontribusi materi",
        indikatorCount: 1,
        butirCount: 3,
        indikators: [
          {
            id: "ind-1-2-1",
            code: "1.2.1",
            title: "Dukungan materi terhadap tugas pokok",
            butirCount: 3,
            items: [
              {
                id: "butir-1-2-1-1",
                code: "1.2.1.1",
                text: "Materi pelatihan secara langsung mempercepat penyelesaian target kerja.",
                categories: ["D", "A", "R"],
              },
            ],
          },
        ],
      },
      {
        id: "sub-1-3",
        code: "1.3",
        title: "Pengetahuan yang diperoleh",
        indikatorCount: 1,
        butirCount: 1,
        indikators: [
          {
            id: "ind-1-3-1",
            code: "1.3.1",
            title: "Peningkatan wawasan teknis",
            butirCount: 1,
            items: [
              {
                id: "butir-1-3-1-1",
                code: "1.3.1.1",
                text: "Pemahaman terhadap regulasi dan SOP pasca pelatihan meningkat.",
                categories: ["D", "A"],
              },
            ],
          },
        ],
      },
      {
        id: "sub-1-4",
        code: "1.4",
        title: "Kontribusi materi",
        indikatorCount: 1,
        butirCount: 3,
        indikators: [
          {
            id: "ind-1-4-1",
            code: "1.4.1",
            title: "Inovasi cara kerja",
            butirCount: 3,
            items: [
              {
                id: "butir-1-4-1-1",
                code: "1.4.1.1",
                text: "Mampu menginisiasi penyempurnaan alur kerja berdasarkan substansi pelatihan.",
                categories: ["D", "R"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "fokus-2",
    number: 2,
    title: "2. Dukungan lingkungan kerja",
    subdimensiCount: 4,
    butirCount: 3,
    subdimensis: [],
  },
  {
    id: "fokus-3",
    number: 3,
    title: "3. Sikap dan perilaku kerja",
    subdimensiCount: 5,
    butirCount: 9,
    subdimensis: [],
  },
  {
    id: "fokus-4",
    number: 4,
    title: "4. Ketepatan waktu",
    subdimensiCount: 3,
    butirCount: 2,
    subdimensis: [],
  },
  {
    id: "fokus-5",
    number: 5,
    title: "5. Manfaat pelatihan",
    subdimensiCount: 4,
    butirCount: 2,
    subdimensis: [],
  },
  {
    id: "fokus-6",
    number: 6,
    title: "6. Hambatan dan tindak lanjut",
    isIsianTerbuka: true,
    pertanyaanCount: 2,
    subdimensis: [],
    openQuestions: [
      {
        id: "open-6-1",
        code: "6.1",
        text: "Apa saja kendala atau hambatan utama yang dihadapi dalam menerapkan materi pelatihan di lingkungan kerja?",
      },
      {
        id: "open-6-2",
        code: "6.2",
        text: "Usulan perbaikan atau dukungan tindak lanjut apa yang diharapkan dari instansi pembina maupun pimpinan unit kerja?",
      },
    ],
  },
];
