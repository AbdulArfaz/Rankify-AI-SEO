import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Plus,
  RefreshCw,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Clock,
  Loader2,
  X,
  Search,
  Globe,
  AlertCircle,
  Eye,
  EyeOff,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function RankTracker() {
  const { api } = useApp();

  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [refreshing, setRefreshing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const fetchKeywords = async () => {
    try {
      const response = await api.get("/rank/list");
      if (response.data.success) {
        setKeywords(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch keywords:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newKeyword.trim() || !newUrl.trim()) return;
    setAdding(true);
    setAddError("");

    try {
      const response = await api.post("/rank/add-keyword", {
        keyword: newKeyword.trim(),
        url: newUrl.trim(),
      });
      if (response.data.success) {
        const newKeywordEntry = response.data.data;

        setKeywords((prev) => [newKeywordEntry, ...prev]);
        setNewKeyword("");
        setNewUrl("");
        setShowAddModal(false);

        const id = newKeywordEntry._id;
        const pollInterval = setInterval(async () => {
          try {
            const check = await api.get(`/rank/${id}?_t=${Date.now()}`);

            const updatedKeyword = check.data.data;

            if (updatedKeyword.status !== "checking") {
              clearInterval(pollInterval);
              setKeywords((prev) =>
                prev.map((k) => (k._id === id ? updatedKeyword : k))
              );
            }
          } catch (error) {
            // Stop polling if the item was deleted (404 Not Found)
            if (error.response?.status === 404) {
              clearInterval(pollInterval);
              setRefreshing(null);
              return;
            }
            console.error("Polling error:", error);
          }
        }, 3000);
      }
    } catch (error) {
      setAddError(error.response?.data?.message || "Failed to add keyword");
    } finally {
      setAdding(false);
    }
  };

  const handleRefresh = async (id) => {
    setRefreshing(id);
    try {
      await api.post(`/rank/${id}/refresh-keyword`);
      setKeywords((prev) =>
        prev.map((k) => (k._id === id ? { ...k, status: "checking" } : k))
      );
      const pollInterval = setInterval(async () => {
        try {
          const check = await api.get(`/rank/${id}?_t=${Date.now()}`);

          const updatedKeyword = check.data.data;

          if (updatedKeyword.status !== "checking") {
            clearInterval(pollInterval);
            setKeywords((prev) =>
              prev.map((k) => (k._id === id ? updatedKeyword : k))
            );
            setRefreshing(null);
          }
        } catch (error) {
          // Stop polling if the item was deleted (404 Not Found)
          if (error.response?.status === 404) {
            clearInterval(pollInterval);
            setRefreshing(null);
            return;
          }
          console.error("Polling error:", error);
        }
      }, 3000);
    } catch (error) {
      console.error("Refresh failed:", error);
      setRefreshing(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this keyword tracking?")) return;
    setDeleting(id);
    try {
      await api.delete(`/rank/${id}`);
      setKeywords((prev) => prev.filter((k) => k._id !== id));
    } catch (error) {
      console.error("Deleting failed:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handleToggle = async (id) => {
    try {
      const response = await api.put(`/rank/${id}/toggle`);
      if (response.data.success) {
        // Fallback safely whether backend sends tracking, data, or just toggles it locally
        const updatedActive =
          response.data.tracking?.active ?? response.data.data?.active;

        setKeywords((prev) =>
          prev.map((k) =>
            k && k._id === id
              ? {
                  ...k,
                  active:
                    updatedActive !== undefined ? updatedActive : !k.active,
                }
              : k
          )
        );
      }
    } catch (error) {
      console.error("Toggle failed:", error);
    }
  };

  const getPositionBadge = (pos) => {
    if (pos === null)
      return { text: "Not Ranked", class: "text-muted-foreground bg-muted/50" };
    if (pos <= 3)
      return {
        text: `#${pos}`,
        class:
          "text-emerald-400 bg-emerald-500/15 border border-emerald-500/30",
      };
    if (pos <= 10)
      return {
        text: `#${pos}`,
        class: "text-primary bg-primary/15 border border-primary/30",
      };
    if (pos <= 20)
      return {
        text: `#${pos}`,
        class: "text-accent bg-accent/15 border border-accent/30",
      };
    return {
      text: `#${pos}`,
      class: "text-danger bg-danger/15 border border-danger/30",
    };
  };

  const getChangeIndicator = (change) => {
    if (change > 0)
      return {
        icon: <TrendingUp size={14} />,
        text: `+${change}`,
        class: "text-emerald-500",
      };
    if (change < 0)
      return {
        icon: <TrendingDown size={14} />,
        text: `${change}`,
        class: "text-danger",
      };
    return {
      icon: <Minus size={14} />,
      text: "0",
      class: "text-muted-foreground",
    };
  };

  let processedData = [...keywords];

  if (searchQuery) {
    processedData = processedData.filter(
      (k) =>
        k.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (statusFilter !== "all") {
    if (statusFilter === "active") {
      processedData = processedData.filter((k) => k.active === true);
    } else if (statusFilter === "paused") {
      processedData = processedData.filter((k) => k.active === false);
    }
  }

  processedData.sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    } else if (sortBy === "rank_asc") {
      return (a.currentPosition || 999) - (b.currentPosition || 999);
    } else if (sortBy === "rank_desc") {
      return (b.currentPosition || 0) - (a.currentPosition || 0);
    } else if (sortBy === "change") {
      return (b.positionChange || 0) - (a.positionChange || 0);
    }
    return 0;
  });

  useEffect(() => {
    (async () => await fetchKeywords())();
  }, []);

  return (
    <div className="min-h-screen pt-16 md:pt-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium text-foreground">
              <span className="gradient-text">Rank Tracker</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Track your keyword rankings on Google — updated daily.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 self-start"
            id="add-keyword-btn"
            style={{ color: "var(--background)" }}
          >
            <Plus size={18} />
            Track Keyword
          </button>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-3">
          <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2 flex-1">
            <Search size={18} className="text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keywords or domains..."
              className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none flex-1"
              id="rank-search-input"
            />
          </div>

          <div className="flex gap-3">
            <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
              <Filter size={16} className="text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm text-foreground outline-none appearance-none pr-4 cursor-pointer"
              >
                <option value="all" className="bg-background">
                  All Status
                </option>
                <option value="active" className="bg-background">
                  Active
                </option>
                <option value="paused" className="bg-background">
                  Paused
                </option>
              </select>
            </div>
            <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
              <ArrowUpDown size={16} className="text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm text-foreground outline-none appearance-none pr-4 cursor-pointer"
              >
                <option value="newest" className="bg-background">
                  Newest First
                </option>
                <option value="rank_asc" className="bg-background">
                  Highest Ranked
                </option>
                <option value="rank_desc" className="bg-background">
                  Lowest Ranked
                </option>
                <option value="change" className="bg-background">
                  Biggest Gain
                </option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-30">
            <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : processedData.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Target
              size={48}
              className="mx-auto text-muted-foreground mb-4 opacity-50"
            />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No keywords tracked yet
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Add your first keyword and URL to start tracking your Google
              rankings.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              style={{ color: "var(--background)" }}
            >
              Track Your First Keyword
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {processedData.map((kw) => {
              const posBadge = getPositionBadge(kw.currentPosition);
              const change = getChangeIndicator(kw.positionChange);

              return (
                <div
                  key={kw._id}
                  className={`group bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/50 dark:hover:border-primary/50 flex flex-col justify-between ${!kw.active ? "opacity-50" : ""}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {kw.status === "checking" ? (
                        <div className="w-14 h-14 rounded-xl glass flex items-center justify-center">
                          <Loader2
                            size={22}
                            className="text-primary animate-spin"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold ${posBadge.class}`}
                        >
                          {kw.currentPosition ? `#${kw.currentPosition}` : "—"}
                        </div>
                      )}

                      {kw.status === "completed" && kw.currentPosition && (
                        <div className="text-right">
                          <div
                            className={`flex items-center justify-end gap-1 text-sm font-medium ${change.class}`}
                          >
                            {change.icon}
                            {change.text}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            position change
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <Link
                        to={`/rank/${kw._id}`}
                        className="text-base font-semibold text-foreground hover:text-primary transition-colors block line-clamp-1"
                      >
                        "{kw.keyword}"
                      </Link>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Globe
                          size={12}
                          className="text-muted-foreground shrink-0"
                        />
                        <span className="text-sm text-muted-foreground truncate">
                          {kw.domain}
                        </span>
                        {kw.currentPage && (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
                            Page {kw.currentPage}
                          </span>
                        )}
                      </div>
                    </div>

                    {kw.status === "completed" && (
                      <div className="grid grid-cols-2 gap-2 py-3 border-y border-border/60 my-4 bg-muted/20 rounded-xl px-4">
                        <div className="text-center">
                          <p className="text-sm font-bold text-primary">
                            {kw.bestPosition || "—"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Best Rank
                          </p>
                        </div>
                        <div className="text-center border-l border-border/60">
                          <p className="text-sm font-bold text-accent">
                            {kw.competitors?.length || 0}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Competitors
                          </p>
                        </div>
                      </div>
                    )}

                    {kw.lastChecked && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                        <Clock size={11} />
                        <span>
                          Checked:{" "}
                          {new Date(kw.lastChecked).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/60 mt-auto">
                    <Link
                      to={`/rank/${kw._id}`}
                      className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      <span>View Report</span>
                      <ExternalLink size={13} />
                    </Link>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleRefresh(kw._id)}
                        disabled={
                          refreshing === kw._id || kw.status === "checking"
                        }
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-all disabled:opacity-30"
                        title="Refresh Ranking"
                      >
                        <RefreshCw
                          size={15}
                          className={
                            refreshing === kw._id ? "animate-spin" : ""
                          }
                        />
                      </button>
                      <button
                        onClick={() => handleToggle(kw._id)}
                        className={`p-2 rounded-lg hover:bg-muted transition-all ${kw.active ? "text-emerald-500" : "text-muted-foreground hover:text-foreground"}`}
                        title={kw.active ? "Pause Tracking" : "Resume Tracking"}
                      >
                        {kw.active ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button
                        onClick={() => handleDelete(kw._id)}
                        disabled={deleting === kw._id}
                        className="p-2 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-all disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === kw._id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">
                Track New Keyword
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddError("");
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {addError && (
              <div className="mb-4 px-4 py-3 rounded-xl severity-critical text-sm flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                {addError}
              </div>
            )}

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label
                  htmlFor="modal-keyword"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Keyword
                </label>
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    id="modal-keyword"
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder='e.g., "best seo tools"'
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="modal-url"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Website URL
                </label>
                <div className="relative">
                  <Globe
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    id="modal-url"
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="e.g., example.com"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-xs text-muted-foreground">
                <p>
                  💡 We'll search Google for your keyword, find your website's
                  position (up to page 5), and track it daily.
                </p>
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full py-3 rounded-xl bg-primary font-semibold text-sm text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ color: "var(--background)" }}
              >
                {adding ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Target size={18} />
                    Start Tracking
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
