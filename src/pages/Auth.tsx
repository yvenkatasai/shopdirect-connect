import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Wrench, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (!isLogin && !name.trim()) return;

    setLoading(true);
    if (isLogin) {
      const { error } = await signIn(email.trim(), password);
      if (error) toast.error(error);
    } else {
      const { error } = await signUp(email.trim(), password, name.trim());
      if (error) {
        toast.error(error);
      } else {
        toast.success(t("auth.checkEmail"));
      }
    }
    setLoading(false);
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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Wrench className="h-7 w-7" />
          </div>
          <h1 className="mt-3 text-xl font-bold text-foreground">{t("app.name")}</h1>
        </div>

        {/* Title */}
        <h2 className="mb-1 text-center text-lg font-bold text-foreground">
          {isLogin ? t("auth.login") : t("auth.signup")}
        </h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          {isLogin ? t("auth.loginSubtitle") : t("auth.signupSubtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">{t("auth.name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                placeholder="Ramesh Kumar"
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">{t("auth.email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">{t("auth.password")}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 pr-10 text-sm text-foreground outline-none focus:border-primary"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "..." : isLogin ? t("auth.login") : t("auth.signup")}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {isLogin ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-primary"
          >
            {isLogin ? t("auth.signup") : t("auth.login")}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
