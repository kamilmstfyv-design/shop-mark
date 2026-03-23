import type { CartLine } from "@/types/cart";

/** WhatsApp üçün formatlanmış mətn (ad, litr, miqdar, qiymət) */
export function buildCartWhatsAppBody(lines: CartLine[]): string {
  if (lines.length === 0) return "";

  let text = `*SerabEvi555 — Səbət sifarişi*\n\n`;

  lines.forEach((l, i) => {
    const lineTotal = l.unitPrice * l.miqdar;

    text += `${i + 1}) *${l.name}*\n`;
    text += `   Litr: ${l.variantLabel}\n`;
    text += `   Miqdar: ${l.miqdar}\n`;
    text += `   Vahid: ${l.unitPrice.toFixed(2)} ₼\n`;
    text += `   Cəmi: ${lineTotal.toFixed(2)} ₼\n\n`;
  });

  const total = lines.reduce((s, l) => s + l.unitPrice * l.miqdar, 0);
  text += `*Ümumi: ${total.toFixed(2)} ₼*`;
  return text;
}
