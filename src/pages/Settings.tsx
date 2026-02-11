import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language, languageNames } from "@/i18n/translations";
import { ArrowLeft, Globe, LogOut, User, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const languages: { code: Language; native: string }[] = [
  { code: "en", native: "English" },
  { code: "te", native: "తెలుగు" },
  { code: "hi", native: "हिन्दी" },
];

const Settings = () => {
  const { user, signOut, role } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showLangPicker, setShowLangPicker] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link
            to={role === "vendor" ? "/vendor" : "/"}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-base font-bold text-foreground">{t("settings.title")}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pt-4 space-y-3">
        {/* Profile */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{role || "User"}</p>
            </div>
          </div>
        </div>

        {/* Language */}
        <button
          onClick={() => setShowLangPicker(!showLangPicker)}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4"
        >
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{t("settings.language")}</span>
          </div>
          <span className="text-sm text-muted-foreground">{languageNames[language]}</span>
        </button>

        {showLangPicker && (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setShowLangPicker(false);
                }}
                className="flex w-full items-center justify-between px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors border-b border-border last:border-b-0"
              >
                <span>{lang.native}</span>
                {language === lang.code && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg border border-destructive/20 bg-card p-4 text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">{t("settings.logout")}</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
