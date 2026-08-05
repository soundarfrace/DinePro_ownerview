import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UtensilsCrossed, Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Login — DinePro Owner" },
      { name: "description", content: "Login to the DinePro Owner App." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const baseUrl = import.meta.env['VITE_API_URL'] || "http://localhost:5000/api";
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to authenticate");
      }

      // Store tokens
      localStorage.setItem("accessToken", result.data.accessToken);
      if (result.data.refreshToken) localStorage.setItem("refreshToken", result.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      
      if (result.data.user?.accountCode) {
        localStorage.setItem("accountCode", result.data.user.accountCode);
      }
      if (result.data.user?.retailCode) {
        localStorage.setItem("retailCode", result.data.user.retailCode);
      }

      toast.success("Welcome back!", { description: `Logged in as ${result.data.user.username}` });
      void navigate({ to: "/dashboard" });
    } catch (error: any) {
      toast.error("Login Failed", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden items-center justify-center bg-background px-4">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <h1 className="text-[20vw] font-black text-foreground/[0.03] tracking-tighter whitespace-nowrap">
          DinePro
        </h1>
      </div>
      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-3xl border border-border bg-secondary/30 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="mb-1 text-lg font-bold">Sign In</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Enter your credentials to access your dashboard.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-semibold text-muted-foreground">
                  Password <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 pr-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="press mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] disabled:opacity-70"
            >
              <LogIn className="size-4" />
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
