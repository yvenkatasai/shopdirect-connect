import { useLanguage } from "@/contexts/LanguageContext";
import { Language, languageNames } from "@/i18n/translations";
import { Check, Wrench } from "lucide-react";
import { motion } from "framer-motion";

const languages: { code: Language; native: string; english: string }[] = [
  { code: "en", native: "English", english: "English" },
  { code: "te", native: "తెలుగు", english: "Telugu" },
  { code: "hi", native: "हिन्दी", english: "Hindi" },
];

const LanguageSelection = () => {
  const { language, setLanguage, t, markLanguageSelected } = useLanguage();

  const handleContinue = () => {
    markLanguageSelected();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Wrench className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-foreground">{t("app.name")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("app.tagline")}</p>
        </div>

        {/* Title */}
        <h2 className="mb-1 text-center text-lg font-bold text-foreground">{t("lang.title")}</h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">{t("lang.subtitle")}</p>

        {/* Language options */}
        <div className="space-y-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex w-full items-center justify-between rounded-xl border-2 p-4 transition-all ${
                language === lang.code
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="text-left">
                <p className="text-base font-semibold text-foreground">{lang.native}</p>
                <p className="text-xs text-muted-foreground">{lang.english}</p>
              </div>
              {language === lang.code && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Continue */}
        <button
          onClick={handleContinue}
          className="mt-6 w-full rounded-xl bg-accent py-3.5 text-center text-sm font-bold text-accent-foreground transition-all hover:bg-accent/90 active:scale-[0.98]"
        >
          {t("lang.continue")}
        </button>
      </motion.div>
    </div>
  );
};

export default LanguageSelection;
