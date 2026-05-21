import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import Icon from "@/components/ui/icon";

type Tab = "content" | "services" | "portfolio" | "orders";

type Service = { id: number; num: string; icon: string; title: string; description: string; is_hot: boolean; sort_order: number };
type PortfolioItem = { id: number; title: string; tag: string; year: string; image_url: string; sort_order: number };
type Order = { id: number; name: string; phone: string; type: string; description: string; file_url: string; status: string; created_at: string };

const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Выполнена",
  cancelled: "Отменена",
};

const STATUS_COLORS: Record<string, string> = {
  new: "#ff3300",
  in_progress: "#ff9900",
  done: "#22c55e",
  cancelled: "#999",
};

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState<Tab>("orders");
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState("");

  const [editContent, setEditContent] = useState<{ section: string; key: string; value: string } | null>(null);
  const [editService, setEditService] = useState<Partial<Service> | null>(null);
  const [editPortfolio, setEditPortfolio] = useState<Partial<PortfolioItem> | null>(null);
  const [isNew, setIsNew] = useState(false);

  // ── Login ──────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const { status, data } = await api.login(loginForm.username, loginForm.password);
    setLoginLoading(false);
    if (status === 200 && data.token) {
      localStorage.setItem("admin_token", data.token);
      setToken(data.token);
    } else {
      setLoginError(data.error || "Ошибка входа");
    }
  };

  const handleLogout = () => {
    api.logout();
    localStorage.removeItem("admin_token");
    setToken("");
  };

  // ── Load data ──────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    if (tab === "content") {
      const { data } = await api.getContent();
      setContent(data);
    } else if (tab === "services") {
      const { data } = await api.getServices();
      setServices(Array.isArray(data) ? data : []);
    } else if (tab === "portfolio") {
      const { data } = await api.getPortfolio();
      setPortfolio(Array.isArray(data) ? data : []);
    } else if (tab === "orders") {
      const { data } = await api.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    if (token) loadData();
  }, [tab, token, loadData]);

  const showSaved = (msg = "Сохранено!") => {
    setSaved(msg);
    setTimeout(() => setSaved(""), 2000);
  };

  // ── Content save ───────────────────────────────────────
  const saveContent = async () => {
    if (!editContent) return;
    await api.updateContent(editContent.section, editContent.key, editContent.value);
    setContent(prev => ({
      ...prev,
      [editContent.section]: { ...prev[editContent.section], [editContent.key]: editContent.value },
    }));
    setEditContent(null);
    showSaved();
  };

  // ── Service save ───────────────────────────────────────
  const saveService = async () => {
    if (!editService) return;
    if (isNew) {
      await api.createService(editService);
    } else {
      await api.updateService(editService.id, editService);
    }
    setEditService(null);
    setIsNew(false);
    loadData();
    showSaved();
  };

  const deleteService = async (id: number) => {
    if (!confirm("Удалить услугу?")) return;
    await api.deleteService(id);
    loadData();
    showSaved("Удалено");
  };

  // ── Portfolio save ─────────────────────────────────────
  const savePortfolio = async () => {
    if (!editPortfolio) return;
    if (isNew) {
      await api.createPortfolioItem(editPortfolio);
    } else {
      await api.updatePortfolioItem(editPortfolio.id, editPortfolio);
    }
    setEditPortfolio(null);
    setIsNew(false);
    loadData();
    showSaved();
  };

  const deletePortfolio = async (id: number) => {
    if (!confirm("Удалить работу из портфолио?")) return;
    await api.deletePortfolioItem(id);
    loadData();
    showSaved("Удалено");
  };

  // ── Order actions ──────────────────────────────────────
  const updateOrderStatus = async (id: number, status: string) => {
    await api.updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    showSaved("Статус обновлён");
  };

  const deleteOrder = async (id: number) => {
    if (!confirm("Удалить заявку?")) return;
    await api.deleteOrder(id);
    setOrders(prev => prev.filter(o => o.id !== id));
    showSaved("Удалено");
  };

  // ── Section labels ─────────────────────────────────────
  const SECTION_LABELS: Record<string, string> = {
    hero: "Главная (Hero)",
    about: "О компании",
    contacts: "Контакты",
    footer: "Футер",
    order: "Форма заказа",
  };
  const KEY_LABELS: Record<string, string> = {
    headline1: "Заголовок строка 1", headline2: "Заголовок строка 2", subtext: "Подзаголовок",
    cta_primary: "Кнопка: основная", cta_secondary: "Кнопка: портфолио", badge: "Значок (бейдж)",
    stat1_val: "Статистика 1: значение", stat1_label: "Статистика 1: подпись",
    stat2_val: "Статистика 2: значение", stat2_label: "Статистика 2: подпись",
    stat3_val: "Статистика 3: значение", stat3_label: "Статистика 3: подпись",
    title: "Заголовок", text1: "Текст абзац 1", text2: "Текст абзац 2",
    badge_num: "Число на значке", badge_label: "Подпись значка",
    tag1: "Тег 1", tag2: "Тег 2", tag3: "Тег 3",
    phone: "Телефон", email: "Email", address: "Адрес", hours: "Часы работы",
    free_visit_title: "Заголовок блока визита", free_visit_text: "Текст блока визита",
    company: "Название компании", copy: "Копирайт", rights: "Права",
    title1: "Заголовок строка 1", title2: "Заголовок строка 2",
    success_title: "Заголовок успеха", success_text: "Текст успеха",
    submit_btn: "Текст кнопки", hint: "Подсказка под кнопкой",
  };

  // ── Render: Login ──────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--ink)" }}>
        <div className="w-full max-w-sm p-8" style={{ background: "var(--paper)" }}>
          <div className="font-black text-3xl uppercase mb-1 tracking-tight" style={{ color: "var(--ink)" }}>
            ЗН<span style={{ color: "var(--brand-red)" }}>А</span>К
          </div>
          <div className="text-xs font-bold tracking-widest uppercase mb-8" style={{ color: "var(--ink-light)" }}>
            Панель управления
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black tracking-widest uppercase mb-2" style={{ color: "var(--ink-light)" }}>Логин</label>
              <input
                type="text" required value={loginForm.username}
                onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                placeholder="admin"
                className="w-full border-2 px-4 py-3 text-sm font-medium bg-transparent focus:outline-none"
                style={{ borderColor: "rgba(0,0,0,0.15)", color: "var(--ink)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-black tracking-widest uppercase mb-2" style={{ color: "var(--ink-light)" }}>Пароль</label>
              <input
                type="password" required value={loginForm.password}
                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full border-2 px-4 py-3 text-sm font-medium bg-transparent focus:outline-none"
                style={{ borderColor: "rgba(0,0,0,0.15)", color: "var(--ink)" }}
              />
            </div>
            {loginError && <div className="text-sm font-semibold" style={{ color: "var(--brand-red)" }}>{loginError}</div>}
            <button
              type="submit" disabled={loginLoading}
              className="w-full py-3 font-black text-sm tracking-widest uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-50 stripe-red"
            >
              {loginLoading ? "Входим..." : "ВОЙТИ"}
            </button>
          </form>
          <div className="mt-6 text-xs text-center" style={{ color: "var(--ink-light)" }}>
            По умолчанию: admin / admin123<br />
            <span className="opacity-60">Смените пароль после первого входа</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Admin panel ────────────────────────────────
  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "orders",    label: "Заявки",    icon: "Inbox"    },
    { id: "content",   label: "Тексты",    icon: "Type"     },
    { id: "services",  label: "Услуги",    icon: "Layers"   },
    { id: "portfolio", label: "Портфолио", icon: "Image"    },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "var(--paper-dark)", fontFamily: "'Montserrat', sans-serif" }}>

      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col" style={{ background: "var(--ink)", minHeight: "100vh" }}>
        <div className="p-6 border-b border-white/10">
          <div className="font-black text-xl uppercase tracking-tight" style={{ color: "var(--paper)" }}>
            ЗН<span style={{ color: "var(--brand-red)" }}>А</span>К
          </div>
          <div className="text-xs mt-1 font-semibold tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
            Администратор
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left font-bold text-sm tracking-wide transition-all duration-200"
              style={{
                color: tab === t.id ? "var(--ink)" : "rgba(255,255,255,0.5)",
                background: tab === t.id ? "var(--brand-red)" : "transparent",
              }}>
              <Icon name={t.icon} size={16} fallback="Circle" />
              {t.label}
              {t.id === "orders" && orders.filter(o => o.status === "new").length > 0 && (
                <span className="ml-auto text-xs font-black px-1.5 py-0.5 rounded"
                  style={{ background: "var(--brand-red)", color: "white", display: tab === t.id ? "none" : "block" }}>
                  {orders.filter(o => o.status === "new").length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 font-bold text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
            style={{ color: "rgba(255,255,255,0.4)" }}>
            <Icon name="LogOut" size={14} fallback="LogOut" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-5 border-b" style={{ background: "var(--paper)", borderColor: "rgba(0,0,0,0.08)" }}>
          <h1 className="font-black text-xl uppercase tracking-tight" style={{ color: "var(--ink)" }}>
            {TABS.find(t => t.id === tab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            {saved && (
              <span className="text-xs font-black tracking-widest uppercase px-3 py-1.5"
                style={{ background: "#22c55e", color: "white" }}>
                {saved}
              </span>
            )}
            <a href="/" target="_blank"
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
              style={{ color: "var(--ink-light)" }}>
              <Icon name="ExternalLink" size={13} fallback="ExternalLink" />
              Открыть сайт
            </a>
            <button onClick={loadData}
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
              style={{ color: "var(--ink-light)" }}>
              <Icon name="RefreshCw" size={13} fallback="RefreshCw" />
              Обновить
            </button>
          </div>
        </div>

        <div className="p-8">
          {loading && (
            <div className="text-center py-16 font-bold tracking-widest uppercase text-sm" style={{ color: "var(--ink-light)" }}>
              Загружаем...
            </div>
          )}

          {/* ── ORDERS ── */}
          {tab === "orders" && !loading && (
            <div className="space-y-3">
              {orders.length === 0 && (
                <div className="text-center py-16 font-bold" style={{ color: "var(--ink-light)" }}>Заявок пока нет</div>
              )}
              {orders.map(o => (
                <div key={o.id} className="p-5 border-l-4" style={{ background: "var(--paper)", borderLeftColor: STATUS_COLORS[o.status] || "#999" }}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-black text-base" style={{ color: "var(--ink)" }}>{o.name}</span>
                        <span className="font-bold text-sm" style={{ color: "var(--ink-light)" }}>{o.phone}</span>
                        {o.type && <span className="text-xs font-black tracking-widest uppercase px-2 py-0.5" style={{ background: "var(--paper-dark)", color: "var(--ink)" }}>{o.type}</span>}
                      </div>
                      {o.description && <p className="text-sm font-medium mb-2" style={{ color: "var(--ink-light)" }}>{o.description}</p>}
                      <div className="text-xs font-semibold" style={{ color: "rgba(0,0,0,0.3)" }}>
                        {new Date(o.created_at).toLocaleString("ru-RU")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}
                        className="border-2 px-3 py-1.5 text-xs font-black bg-transparent focus:outline-none"
                        style={{ borderColor: STATUS_COLORS[o.status] || "#999", color: STATUS_COLORS[o.status] || "#999" }}>
                        {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                      <button onClick={() => deleteOrder(o.id)}
                        className="p-1.5 border-2 transition-colors hover:bg-red-50"
                        style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                        <Icon name="Trash2" size={14} className="text-red-400" fallback="Trash2" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── CONTENT ── */}
          {tab === "content" && !loading && (
            <div className="space-y-8">
              {Object.entries(content).map(([section, keys]) => (
                <div key={section}>
                  <div className="font-black text-xs tracking-widest uppercase mb-3 pb-2 border-b"
                    style={{ color: "var(--brand-red)", borderColor: "rgba(0,0,0,0.08)" }}>
                    {SECTION_LABELS[section] || section}
                  </div>
                  <div className="grid gap-2">
                    {Object.entries(keys).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-4 p-4 group cursor-pointer transition-colors hover:shadow-sm"
                        style={{ background: "var(--paper)" }}
                        onClick={() => setEditContent({ section, key, value })}>
                        <div className="w-48 flex-shrink-0">
                          <div className="text-xs font-black tracking-wide" style={{ color: "var(--ink-light)" }}>
                            {KEY_LABELS[key] || key}
                          </div>
                        </div>
                        <div className="flex-1 text-sm font-medium truncate" style={{ color: "var(--ink)" }}>{value}</div>
                        <Icon name="Pencil" size={14} className="opacity-0 group-hover:opacity-50 flex-shrink-0" fallback="Pencil" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── SERVICES ── */}
          {tab === "services" && !loading && (
            <div>
              <button onClick={() => { setEditService({ num: "", icon: "Star", title: "", description: "", is_hot: false, sort_order: 99 }); setIsNew(true); }}
                className="mb-6 stripe-red text-white font-black text-xs tracking-widest uppercase px-6 py-3 transition-opacity hover:opacity-90">
                + Добавить услугу
              </button>
              <div className="grid gap-3">
                {services.map(s => (
                  <div key={s.id} className="flex items-center gap-4 p-5" style={{ background: "var(--paper)" }}>
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border-2"
                      style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                      <Icon name={s.icon} size={16} fallback="Star" style={{ color: "var(--brand-red)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm" style={{ color: "var(--ink)" }}>{s.title}</span>
                        {s.is_hot && <span className="text-xs font-black px-1.5 py-0.5" style={{ background: "#ffcc00", color: "var(--ink)" }}>ХИТ</span>}
                      </div>
                      <div className="text-xs font-medium mt-0.5 truncate" style={{ color: "var(--ink-light)" }}>{s.description}</div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => { setEditService({ ...s }); setIsNew(false); }}
                        className="p-2 border-2 hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                        <Icon name="Pencil" size={14} fallback="Pencil" />
                      </button>
                      <button onClick={() => deleteService(s.id)}
                        className="p-2 border-2 hover:bg-red-50 transition-colors"
                        style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                        <Icon name="Trash2" size={14} className="text-red-400" fallback="Trash2" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PORTFOLIO ── */}
          {tab === "portfolio" && !loading && (
            <div>
              <button onClick={() => { setEditPortfolio({ title: "", tag: "", year: new Date().getFullYear().toString(), image_url: "", sort_order: 99 }); setIsNew(true); }}
                className="mb-6 stripe-red text-white font-black text-xs tracking-widest uppercase px-6 py-3 transition-opacity hover:opacity-90">
                + Добавить работу
              </button>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolio.map(p => (
                  <div key={p.id} className="relative group overflow-hidden" style={{ background: "var(--paper)" }}>
                    <img src={p.image_url} alt={p.title} className="w-full h-44 object-cover" />
                    <div className="p-4">
                      <div className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: "var(--brand-red)" }}>{p.tag} · {p.year}</div>
                      <div className="font-black text-sm" style={{ color: "var(--ink)" }}>{p.title}</div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditPortfolio({ ...p }); setIsNew(false); }}
                        className="p-2 bg-white/90 hover:bg-white transition-colors">
                        <Icon name="Pencil" size={13} fallback="Pencil" />
                      </button>
                      <button onClick={() => deletePortfolio(p.id)}
                        className="p-2 bg-white/90 hover:bg-red-50 transition-colors">
                        <Icon name="Trash2" size={13} className="text-red-400" fallback="Trash2" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── MODAL: Edit Content ── */}
      {editContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={e => { if (e.target === e.currentTarget) setEditContent(null); }}>
          <div className="w-full max-w-lg p-8" style={{ background: "var(--paper)" }}>
            <div className="font-black text-lg uppercase mb-1" style={{ color: "var(--ink)" }}>
              {KEY_LABELS[editContent.key] || editContent.key}
            </div>
            <div className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "var(--ink-light)" }}>
              {SECTION_LABELS[editContent.section] || editContent.section}
            </div>
            <textarea rows={4}
              value={editContent.value}
              onChange={e => setEditContent(p => p ? { ...p, value: e.target.value } : null)}
              className="w-full border-2 px-4 py-3 text-sm font-medium bg-transparent focus:outline-none resize-none"
              style={{ borderColor: "rgba(0,0,0,0.15)", color: "var(--ink)" }}
            />
            <div className="flex gap-3 mt-4">
              <button onClick={saveContent}
                className="flex-1 stripe-red text-white font-black text-xs tracking-widest uppercase py-3 transition-opacity hover:opacity-90">
                СОХРАНИТЬ
              </button>
              <button onClick={() => setEditContent(null)}
                className="px-6 border-2 font-black text-xs tracking-widest uppercase transition-colors hover:bg-gray-50"
                style={{ borderColor: "rgba(0,0,0,0.15)", color: "var(--ink)" }}>
                ОТМЕНА
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Edit Service ── */}
      {editService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={e => { if (e.target === e.currentTarget) { setEditService(null); setIsNew(false); } }}>
          <div className="w-full max-w-lg p-8" style={{ background: "var(--paper)" }}>
            <div className="font-black text-lg uppercase mb-6" style={{ color: "var(--ink)" }}>
              {isNew ? "Новая услуга" : "Редактировать услугу"}
            </div>
            <div className="space-y-4">
              {[
                { key: "num", label: "Номер (01, 02...)" },
                { key: "icon", label: "Иконка (Zap, Layers, Scissors...)" },
                { key: "title", label: "Название" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-black tracking-widest uppercase mb-2" style={{ color: "var(--ink-light)" }}>{f.label}</label>
                  <input type="text" value={(editService as Record<string, string>)[f.key] || ""} onChange={e => setEditService(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border-2 px-4 py-2.5 text-sm font-medium bg-transparent focus:outline-none"
                    style={{ borderColor: "rgba(0,0,0,0.15)", color: "var(--ink)" }} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-black tracking-widest uppercase mb-2" style={{ color: "var(--ink-light)" }}>Описание</label>
                <textarea rows={3} value={editService.description || ""} onChange={e => setEditService(p => ({ ...p, description: e.target.value }))}
                  className="w-full border-2 px-4 py-2.5 text-sm font-medium bg-transparent focus:outline-none resize-none"
                  style={{ borderColor: "rgba(0,0,0,0.15)", color: "var(--ink)" }} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={editService.is_hot ?? false} onChange={e => setEditService(p => ({ ...p, is_hot: e.target.checked }))} />
                <span className="text-xs font-black tracking-widest uppercase" style={{ color: "var(--ink-light)" }}>Пометить как «Хит»</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveService}
                className="flex-1 stripe-red text-white font-black text-xs tracking-widest uppercase py-3 transition-opacity hover:opacity-90">
                СОХРАНИТЬ
              </button>
              <button onClick={() => { setEditService(null); setIsNew(false); }}
                className="px-6 border-2 font-black text-xs tracking-widest uppercase transition-colors hover:bg-gray-50"
                style={{ borderColor: "rgba(0,0,0,0.15)", color: "var(--ink)" }}>
                ОТМЕНА
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Edit Portfolio ── */}
      {editPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={e => { if (e.target === e.currentTarget) { setEditPortfolio(null); setIsNew(false); } }}>
          <div className="w-full max-w-lg p-8" style={{ background: "var(--paper)" }}>
            <div className="font-black text-lg uppercase mb-6" style={{ color: "var(--ink)" }}>
              {isNew ? "Новая работа" : "Редактировать работу"}
            </div>
            <div className="space-y-4">
              {[
                { key: "title", label: "Название работы" },
                { key: "tag", label: "Категория (Неон, Акрил, Фасад...)" },
                { key: "year", label: "Год" },
                { key: "image_url", label: "URL фотографии" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-black tracking-widest uppercase mb-2" style={{ color: "var(--ink-light)" }}>{f.label}</label>
                  <input type="text" value={(editPortfolio as Record<string, string>)[f.key] || ""} onChange={e => setEditPortfolio(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border-2 px-4 py-2.5 text-sm font-medium bg-transparent focus:outline-none"
                    style={{ borderColor: "rgba(0,0,0,0.15)", color: "var(--ink)" }} />
                </div>
              ))}
              {editPortfolio.image_url && (
                <img src={editPortfolio.image_url} alt="" className="w-full h-32 object-cover" />
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={savePortfolio}
                className="flex-1 stripe-red text-white font-black text-xs tracking-widest uppercase py-3 transition-opacity hover:opacity-90">
                СОХРАНИТЬ
              </button>
              <button onClick={() => { setEditPortfolio(null); setIsNew(false); }}
                className="px-6 border-2 font-black text-xs tracking-widest uppercase transition-colors hover:bg-gray-50"
                style={{ borderColor: "rgba(0,0,0,0.15)", color: "var(--ink)" }}>
                ОТМЕНА
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}