// Cores do tema
export const COLORS = {
  primary: '#641311',
  secondary: '#cc936b',
  white: '#FFFFFF',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    900: '#111827',
  },
} as const;

// WhatsApp
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '553888319214';

// Configurações de upload
export const UPLOAD_CONFIG = {
  maxSize: 20 * 1024 * 1024, // 20MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  storagePath: 'clothing',
} as const;

// Configurações de paginação
export const PAGINATION = {
  defaultLimit: 12,
  loadMoreThreshold: 0.1,
} as const;
