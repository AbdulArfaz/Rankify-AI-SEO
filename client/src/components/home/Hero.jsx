import { SearchIcon, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeWave } from "../../assets/assets.jsx";

export default function Hero() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleQuickAnalyze = (e) => {
    e.preventDefault();
    navigate(`/analyze?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="w-full bg-background relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <section className="max-w-3xl mx-auto px-4 py-28 sm:py-36 min-h-screen text-center relative z-10 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-xs font-semibold text-primary mb-6 border border-primary/20 shadow-sm">
          <div className="relative flex items-center justify-center">
            <div className="bg-primary size-2 rounded-full absolute animate-ping" />
            <div className="bg-primary size-1.5 rounded-full" />
          </div>
          ⚡ AI-Powered SEO Intelligence for 2026
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-foreground tracking-tight">
          Outrank Your Competitors <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-indigo-500 to-accent">
            On Autopilot
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Stop guessing what Google wants. Get instant, AI-driven diagnostic
          audits that reveal exactly what's holding your pages back from page
          one.
        </p>

        <form onSubmit={handleQuickAnalyze} className="max-w-xl mx-auto w-full">
          <div className="bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl p-2.5 shadow-xl flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2 flex-1 px-3 w-full">
              <SearchIcon
                size={18}
                className="text-muted-foreground shrink-0"
              />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., example.com)"
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm py-2"
                id="hero-url-input"
              />
            </div>

            <button
              type="submit"
              className="bg-primary px-5 py-2.5 rounded-full text-primary-foreground text-sm hover:opacity-90 transition-opacity shrink-0 flex items-center gap-2"
              id="hero-analyze-btn"
              style={{ color: "var(--background)" }}
            >
              Run Free Audit
              <ArrowRightIcon size={14} />
            </button>
          </div>
        </form>

        <p className="text-muted-foreground text-xs mt-4 font-medium">
          No credit card required <span className="mx-2">•</span> Instant
          results in 10 seconds
        </p>
      </section>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-80 z-20">
        <HomeWave />
      </div>
    </div>
  );
}
