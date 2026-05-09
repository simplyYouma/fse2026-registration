"use client";

import { useLang } from "@/lib/lang-context";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="max-w-4xl mx-auto mt-8 text-center text-xs text-slate-500">
      <p>{t("footer")}</p>
    </footer>
  );
}
