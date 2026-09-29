import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SearchIcon,
  ArrowRightIcon,
  BarChart3Icon,
  GlobeIcon,
  TrendingUpIcon,
} from "lucide-react";
import AnalysesCard from "../components/AnalysesCard";
import { dummyAnalysisData } from "../assets/assets";

export default function Dashboard() {
  const user = { name: "James Arfaz", plan: "free", analysisCount: 2 };
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = async () => {
    setTimeout(() => {
      setAnalyses(dummyAnalysisData);
      setLoading(false);
    }, 1000);
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (url.trim()) {
      navigate(`/analyze?url=${encodeURIComponent(url)}`);
    }
  };

  const completedAnalyses = analyses.filter((a) => a.status === "completed");
  const avgScore = completedAnalyses.length
    ? Math.round(
        completedAnalyses.reduce((sum, a) => sum + a.overallScore, 0) /
          completedAnalyses.length,
      )
    : 0;

  const getScoreClass = (s) => {
    if (s >= 80) return "score-good";
    if (s >= 50) return "score-medium";
    return "score-poor";
  };

  useEffect(() => {
    (async () => await fetchRecent())();
  }, []);

  return (
    <div className="min-h-screen pt-16 md:pt-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
              {user?.name}
            </span>
          </h1>
          <p className="text-muted-foreground text-sm italic">
            "AI-driven page diagnostics and algorithmic rank surveillance."
          </p>
        </div>

        <form
          onSubmit={handleAnalyze}
          className="mb-10 max-w-2xl mx-auto"
          style={{ animationDelay: "100ms" }}
        >
          <div className="border border-primary/20 rounded-full p-2 flex items-center gap-2 max-w-2xl">
            <div className="flex items-center gap-3 flex-1 px-3">
              <SearchIcon
                size={20}
                className="text-muted-foreground shrink-0"
              />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter a URL to analyze..."
                className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm py-3"
                id="dashboard-url-input"
              />
            </div>
            <button
              type="submit"
              className="bg-primary px-5 py-3 rounded-full text-primary-foreground text-sm hover:opacity-90
               transition-opacity shrink-0 flex items-center gap-2"
              style={{ color: "var(--background)" }}
              id="dashboard-analyze-btn"
            >
              Analyze
              <ArrowRightIcon size={16} />
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
          <div className="p-5 rounded-2xl bg-linear-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
              <GlobeIcon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {analyses.length}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Total Scans
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
              <TrendingUpIcon size={22} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${getScoreClass(avgScore)}`}>
                {avgScore}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Avg Score
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-linear-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/20 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
              <BarChart3Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {user?.plan === "free"
                  ? `${5 - (user?.analysisCount || 0)}`
                  : "∞"}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Scans Left Today
              </p>
            </div>
          </div>
        </div>

        <div style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Analyses
            </h2>
            {analyses.length > 0 && (
              <Link
                to="/history"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View All <ArrowRightIcon size={14} />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-30">
              <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : analyses.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <SearchIcon
                size={48}
                className="mx-auto text-muted-foreground mb-4 opacity-50"
              />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No analyses yet
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Enter a URL above to run your first SEO analysis.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyses.map((a) => (
                <AnalysesCard key={a._id} analysis={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
