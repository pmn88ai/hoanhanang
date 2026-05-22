export const CATEGORY_GROUPS = [
  {
    group: "Hoa Sáp",
    items: [
      { value: "hoa-bo", label: "Hoa bó" },
      { value: "hoa-sap-mini", label: "Hoa sáp mini" },
      { value: "hop-hoa-sap", label: "Hộp hoa sáp" },
      { value: "hoa-sap-sinh-nhat", label: "Hoa sáp sinh nhật" },
      { value: "set-qua-hoa-sap", label: "Set quà hoa sáp" },
    ],
  },
  {
    group: "Hoa Lụa",
    items: [
      { value: "binh-hoa-lua", label: "Bình hoa lụa" },
      { value: "hoa-lua-decor", label: "Hoa lụa decor" },
      { value: "hoa-lua-de-ban", label: "Hoa lụa để bàn" },
      { value: "hoa-lua-cao-cap", label: "Hoa lụa cao cấp" },
    ],
  },
] as const;

export const CATEGORIES = [
  { value: "tat-ca", label: "Tất cả" },
  ...CATEGORY_GROUPS.flatMap((g) => [...g.items]),
];
