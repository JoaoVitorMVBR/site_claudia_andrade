import React from "react";

export type Position =
  | "bottom-right"
  | "bottom-left"
  | "bottom-center"
  | "top-right"
  | "top-left";

export interface WhatsAppButtonProps {
  /** Número no formato internacional sem sinais, ex: 5511999998888 */
  phone: string;
  /** Mensagem inicial pré-preenchida (opcional) */
  message?: string;
  /** Tamanho do botão (px) */
  size?: number;
  /** Posição fixa na viewport */
  position?: Position;
  /** Classe extra para customização */
  className?: string;
  /** Se true, abre em nova aba (padrão true) */
  newTab?: boolean;
  /** Tema do botão (default = verde padrão WhatsApp) */
  theme?: "default" | "light" | "dark";
}

const positionClasses: Record<Position, string> = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "bottom-center": "bottom-6 left-1/2 transform -translate-x-1/2",
  "top-right": "top-6 right-6",
  "top-left": "top-6 left-6",
};

const themeStyles: Record<NonNullable<WhatsAppButtonProps["theme"]>, string> = {
  default: "linear-gradient(135deg,#25D366,#128C7E)",
  light: "linear-gradient(135deg,#ffffff,#e5e5e5)",
  dark: "linear-gradient(135deg,#1c1c1c,#000000)",
};

export default function WhatsAppButton({
  phone,
  message = "",
  size = 64,
  position = "bottom-right",
  className = "",
  newTab = true,
  theme = "default",
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  const px = `${size}px`;
  const iconSize = Math.round(size * 0.56);

  return (
    <a
      href={href}
      aria-label="Abrir WhatsApp"
      target={newTab ? "_blank" : "_self"}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={`fixed z-50 ${positionClasses[position]} ${className}`}
    >
      <div
        role="button"
        className={`shadow-2xl rounded-full p-2 flex items-center justify-center hover:scale-105 transition-transform will-change-transform focus:outline-none focus:ring-4 focus:ring-green-300/40`}
        style={{
          width: px,
          height: px,
          background: themeStyles[theme],
        }}
      >
        {/* WhatsApp SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={iconSize}
          height={iconSize}
          aria-hidden
        >
          <path
            fill={theme === "light" ? "#25D366" : "#fff"}
            d="M20.52 3.48A11.88 11.88 0 0012 .02C5.37.02.02 5.37.02 12c0 2.13.56 4.11 1.62 5.88L.02 24l6.32-1.64A11.93 11.93 0 0012 24c6.63 0 11.98-5.35 11.98-12 0-3.2-1.25-6.2-3.46-8.52zM12 21.5c-1.1 0-2.18-.18-3.15-.52l-.23-.08-3.76.98.98-3.66-.08-.24A9.48 9.48 0 012.5 12 9.5 9.5 0 1112 21.5zm5.32-7.85c-.29-.15-1.71-.84-1.98-.94-.27-.1-.47-.15-.67.15s-.77.94-.95 1.13c-.17.19-.34.22-.63.07-.28-.15-1.18-.44-2.25-1.39-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.27.28-.45.1-.18.05-.34-.03-.48-.09-.13-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.18 0-.47.07-.72.33-.25.26-.95.93-.95 2.26s.97 2.63 1.11 2.81c.14.18 1.92 2.92 4.66 3.98 1.04.45 1.85.72 2.49.92.99.29 1.89.25 2.6.15.79-.11 1.71-.69 1.95-1.36.24-.66.24-1.22.17-1.36-.06-.13-.25-.2-.55-.35z"
          />
        </svg>
      </div>
    </a>
  );
}

/*
  Uso (exemplo):
  <WhatsAppButton phone="5511999998888" message="Olá!" position="bottom-right" size={64} theme="default" />
*/
