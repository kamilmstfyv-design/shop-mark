import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { waMeUrl } from "@/lib/whatsapp";

const quickText = encodeURIComponent(
  "Salam, SerabEvi555 haqqında məlumat almaq istəyirəm.",
);

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-900 text-slate-300">
      <div className="main-container py-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">SerabEvi555</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
              Seçilmiş şərab və içkilər. Sifariş üçün WhatsApp ilə əlaqə saxlayın.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-red-400">
              Keçidlər
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Ana səhifə
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  Məhsullar
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-red-400">
              Əlaqə
            </h4>
            <ul className="mt-3 space-y-3 text-sm">
              <li>
                <a
                  href={waMeUrl(quickText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366]/15 px-3 py-2 font-medium text-[#25D366] hover:bg-[#25D366]/25"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+994 55 512 01 57</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SerabEvi555. Bütün hüquqlar qorunur.
        </div>
      </div>
    </footer>
  );
}
