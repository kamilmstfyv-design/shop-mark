/** Mağaza WhatsApp nömrəsi (country code + number, + olmadan) */
export const STORE_WHATSAPP_E164 = "994555120157";

export function waMeUrl(encodedText: string) {
  return `https://wa.me/${STORE_WHATSAPP_E164}?text=${encodedText}`;
}
