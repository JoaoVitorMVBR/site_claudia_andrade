export const CLOTHING_TYPES = [
  { value: "", label: "Selecione o tipo" },
  { value: "Detalhes bordados", label: "Detalhes bordados" },
  { value: "Todo bordado", label: "Todo bordado" },
  { value: "Liso", label: "Liso" },
  { value: "Gliterizado", label: "Gliterizado" },
  { value: "Micro paetê", label: "Micro paetê" },
  { value: "Meio corpo bordado", label: "Meio corpo bordado" },
];

export const SIZES = ["34", "36", "38", "40", "42", "44", "46", "48", "50"].map(s => ({
  value: s,
  label: s,
}));

export const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB
