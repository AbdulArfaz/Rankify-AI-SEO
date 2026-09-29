import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Mail,
  Lock,
  Loader2,
  ChartNoAxesColumnIcon,
  User2Icon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

export default function Login({ state }) {
  const [isLoginState, setIsLoginState] = useState(state === "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useApp();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLoginState) {
        await login(email, password);
        toast.success("Logged in Successfully!");
      } else {
        await register(name, email, password);
        toast.success("Account Created Successfully!");
      }
      const redirect = searchParams.get("redirect") || "/dashboard";
      navigate(redirect);
    } catch (error) {
      console.log('Full Login error:', error)
      const errorMsg = error.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 group py-2 px-4 rounded-xl hover:bg-muted/50 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary transition-transform group-hover:scale-105">
              <ChartNoAxesColumnIcon size={20} />
            </div>
            <span className="text-xl tracking-tight font-bold text-foreground">
              Rank Pilot
            </span>
          </Link>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-border/60 rounded-2xl p-8 shadow-2xl shadow-primary/5 transition-all">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center pb-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {isLoginState ? "Welcome back" : "Create an account"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {isLoginState ? "Sign in to access your" : "Get started with"}{" "}
                Rank Pilot
              </p>
            </div>

            {!isLoginState && (
              <label className="block">
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Full Name
                </span>
                <div className="relative group">
                  <User2Icon
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                  />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Email Address
              </span>
              <div className="relative group">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                />
              </div>
            </label>

            <label className="block">
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Password
              </span>
              <div className="relative group">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isLoginState ? (
                "Sign In to Dashboard"
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLoginState ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => setIsLoginState((prev) => !prev)}
            className="text-primary hover:underline font-semibold ml-1.5 cursor-pointer"
          >
            {isLoginState ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
