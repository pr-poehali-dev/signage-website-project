import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "Неоновая вывеска NOVA",
    category: "Неон",
    material: "Неоновые трубки, металл",
    img: "https://cdn.poehali.dev/projects/e43ab287-0b0e-458e-ab21-5895f14adfba/files/8b9eb0da-ee9a-4152-9fbd-09deb8f41d46.jpg",
  },
  {
    id: 2,
    title: "Офисная табличка с подсветкой",
    category: "Акрил",
    material: "Акрил, LED, нержавейка",
    img: "https://cdn.poehali.dev/projects/e43ab287-0b0e-458e-ab21-5895f14adfba/files/d8d753a3-bceb-4ca9-9a2f-996b8714f761.jpg",
  },
  {
    id: 3,
    title: "Металлический декор",
    category: "Металл",
    material: "Сталь, лазерная резка",
    img: "https://cdn.poehali.dev/projects/e43ab287-0b0e-458e-ab21-5895f14adfba/files/afc4b9fa-3bef-411a-a936-f3258adc49a9.jpg",
  },
];

const SERVICES = [
  {
    icon: "Zap",
    title: "Неоновые вывески",
    desc: "Классический неон и LED-неон любой формы и цвета. Яркое световое решение для фасадов, интерьеров, фотозон.",
    tag: "Хит",
  },
  {
    icon: "Layers",
    title: "Акриловые таблички",
    desc: "Объёмные буквы и таблички из акрила с торцевой подсветкой или без. Идеально для офисов и рецепций.",
    tag: null,
  },
  {
    icon: "Scissors",
    title: "Металлические знаки",
    desc: "Лазерная резка и гравировка нержавеющей стали, латуни, алюминия. Износостойкость на десятилетия.",
    tag: null,
  },
  {
    icon: "Monitor",
    title: "Световые короба",
    desc: "Объёмные конструкции с равномерной подсветкой. Работают круглосуточно, заметны в любую погоду.",
    tag: null,
  },
  {
    icon: "Paintbrush",
    title: "Фасадные вывески",
    desc: "Комплексное оформление фасадов: от дизайн-проекта до монтажа. Под ключ с гарантией.",
    tag: "Под ключ",
  },
  {
    icon: "Tag",
    title: "Навигация и указатели",
    desc: "Системы навигации для торговых центров, офисных зданий, медицинских учреждений.",
    tag: null,
  },
];

export default function Index() {
  const [activeNav, setActiveNav] = useState("hero");
  const [orderForm, setOrderForm] = useState({
    name: "",
    phone: "",
    type: "",
    description: "",
    file: null as File | null,
  });
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveNav(id);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOrderForm((p) => ({ ...p, file }));
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--metal-dark)] text-[var(--text-primary)] font-body overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, transparent 100%)", backdropFilter: "blur(8px)" }}>
        <button onClick={() => scrollTo("hero")} className="font-display text-xl font-bold tracking-[0.2em] neon-text-subtle hover:neon-text transition-all duration-300">
          ЗНАК
        </button>
        <div className="hidden md:flex items-center gap-8">
          {[
            { id: "about", label: "О нас" },
            { id: "services", label: "Услуги" },
            { id: "portfolio", label: "Портфолио" },
            { id: "order", label: "Заказать" },
            { id: "contacts", label: "Контакты" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`font-display text-sm tracking-[0.15em] uppercase transition-all duration-300 ${
                activeNav === item.id
                  ? "neon-text-subtle"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => scrollTo("order")}
          className="font-display text-xs tracking-[0.2em] uppercase px-4 py-2 border border-[var(--neon-gold)] text-[var(--neon-gold)] hover:bg-[var(--neon-gold)] hover:text-black transition-all duration-300"
        >
          Заказать
        </button>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#070707]" />
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="opacity-0 animate-fade-in delay-100 inline-flex items-center gap-3 mb-8">
            <span className="h-px w-12 bg-[var(--neon-gold)] opacity-60" />
            <span className="font-body text-xs tracking-[0.35em] uppercase text-[var(--neon-gold)] opacity-80">
              Производство с 2012 года
            </span>
            <span className="h-px w-12 bg-[var(--neon-gold)] opacity-60" />
          </div>

          <h1 className="opacity-0 animate-fade-in-up delay-200 font-display font-bold leading-none mb-4"
            style={{ fontSize: "clamp(4rem, 14vw, 11rem)", letterSpacing: "-0.02em" }}>
            <span className="block text-[var(--text-primary)]">ВЫВЕСКИ</span>
            <span className="block neon-text animate-neon-pulse">И ТАБЛИЧКИ</span>
          </h1>

          <p className="opacity-0 animate-fade-in-up delay-400 font-body font-light text-[var(--text-muted)] text-lg md:text-xl max-w-2xl mx-auto mt-6 mb-12 leading-relaxed">
            Создаём знаки, которые работают на ваш бизнес — неоновые, световые, металлические.
            Производство и монтаж по всей России.
          </p>

          <div className="opacity-0 animate-fade-in-up delay-500 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo("order")}
              className="group relative px-10 py-4 bg-[var(--neon-gold)] text-black font-display font-semibold text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,166,35,0.5)]"
            >
              <span className="relative z-10">Заказать вывеску</span>
              <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </button>
            <button
              onClick={() => scrollTo("portfolio")}
              className="px-10 py-4 border border-[rgba(245,166,35,0.3)] text-[var(--text-muted)] font-display text-sm tracking-[0.2em] uppercase hover:border-[var(--neon-gold)] hover:text-[var(--text-primary)] transition-all duration-300"
            >
              Смотреть работы
            </button>
          </div>

          <div className="opacity-0 animate-fade-in delay-600 grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-[rgba(245,166,35,0.1)] max-w-lg mx-auto">
            {[
              { val: "1200+", label: "Проектов" },
              { val: "12 лет", label: "Опыта" },
              { val: "48ч", label: "Срок изготовления" },
            ].map((s) => (
              <div key={s.val} className="text-center">
                <div className="font-display font-bold text-2xl neon-text-subtle">{s.val}</div>
                <div className="font-body text-xs text-[var(--text-muted)] mt-1 tracking-wider uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-[var(--text-muted)]">Скрол</span>
          <div className="w-px h-10 bg-gradient-to-b from-[var(--neon-gold)] to-transparent" />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="section-divider mb-20" />
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="font-body text-xs tracking-[0.35em] uppercase text-[var(--neon-gold)] opacity-60 mb-4">О компании</div>
            <h2 className="font-display font-bold text-5xl md:text-7xl leading-none mb-8 text-[var(--text-primary)]">
              МЫ ДЕЛАЕМ<br />
              <span className="neon-text-subtle">ЗНАКИ</span><br />
              КОТОРЫЕ<br />
              ГОВОРЯТ
            </h2>
            <p className="font-body font-light text-[var(--text-muted)] leading-relaxed mb-6 text-base">
              Компания ЗНАК работает с 2012 года. Мы специализируемся на производстве наружной рекламы и навигационных систем — от небольших офисных табличек до масштабных фасадных конструкций.
            </p>
            <p className="font-body font-light text-[var(--text-muted)] leading-relaxed text-base">
              Собственное производство, опытные мастера и жёсткий контроль качества — вот почему нам доверяют крупные торговые сети, рестораны и бизнес-центры.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              {["Собственное производство", "Гарантия 3 года", "Выезд на замер бесплатно"].map((tag) => (
                <span key={tag} className="font-body text-xs text-[var(--neon-gold)] border border-[rgba(245,166,35,0.25)] px-3 py-1 tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative border border-[rgba(245,166,35,0.15)] p-1">
              <img
                src="https://cdn.poehali.dev/projects/e43ab287-0b0e-458e-ab21-5895f14adfba/files/8b9eb0da-ee9a-4152-9fbd-09deb8f41d46.jpg"
                alt="Производство вывесок"
                className="w-full h-80 object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--metal-dark)] to-transparent opacity-40" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[var(--neon-gold)] text-black p-5 font-display">
              <div className="text-3xl font-bold leading-none">12</div>
              <div className="text-xs uppercase tracking-wider font-body">лет на рынке</div>
            </div>
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-[var(--neon-gold)]" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[var(--neon-gold)]" />
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-32 px-6 md:px-12 bg-[var(--metal-mid)]">
        <div className="max-w-7xl mx-auto">
          <div className="section-divider mb-20" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
            <div>
              <div className="font-body text-xs tracking-[0.35em] uppercase text-[var(--neon-gold)] opacity-60 mb-4">Что мы делаем</div>
              <h2 className="font-display font-bold text-5xl md:text-7xl leading-none text-[var(--text-primary)]">
                УСЛУГИ
              </h2>
            </div>
            <p className="font-body font-light text-[var(--text-muted)] max-w-sm text-sm leading-relaxed">
              Полный цикл: от дизайн-проекта до монтажа. Работаем с любыми материалами и объёмами.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(245,166,35,0.08)]">
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className="group relative bg-[var(--metal-mid)] p-8 hover:bg-[var(--metal-light)] transition-all duration-500 cursor-default"
              >
                <div className="font-display font-bold text-6xl text-[rgba(245,166,35,0.06)] absolute top-4 right-6 leading-none group-hover:text-[rgba(245,166,35,0.1)] transition-colors duration-500">
                  {String(i + 1).padStart(2, "0")}
                </div>
                {s.tag && (
                  <span className="absolute top-6 right-6 font-body text-xs bg-[var(--neon-gold)] text-black px-2 py-0.5 tracking-wider">
                    {s.tag}
                  </span>
                )}
                <div className="mb-4 w-10 h-10 border border-[rgba(245,166,35,0.2)] flex items-center justify-center group-hover:border-[var(--neon-gold)] group-hover:shadow-[0_0_12px_rgba(245,166,35,0.2)] transition-all duration-300">
                  <Icon name={s.icon} size={18} className="text-[var(--neon-gold)]" fallback="Star" />
                </div>
                <h3 className="font-display font-semibold text-xl tracking-wide text-[var(--text-primary)] mb-3 group-hover:neon-text-subtle transition-all duration-300">
                  {s.title}
                </h3>
                <p className="font-body font-light text-[var(--text-muted)] text-sm leading-relaxed">{s.desc}</p>
                <div className="mt-6 h-px bg-gradient-to-r from-[rgba(245,166,35,0.3)] to-transparent w-0 group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section id="portfolio" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="section-divider mb-20" />
        <div className="mb-16">
          <div className="font-body text-xs tracking-[0.35em] uppercase text-[var(--neon-gold)] opacity-60 mb-4">Наши работы</div>
          <h2 className="font-display font-bold text-5xl md:text-7xl leading-none text-[var(--text-primary)]">
            ПОРТФОЛИО
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PORTFOLIO_ITEMS.map((item, i) => (
            <div key={item.id} className="group relative overflow-hidden border border-[rgba(245,166,35,0.1)] hover:border-[rgba(245,166,35,0.4)] transition-all duration-500">
              <div className="relative h-72 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--metal-dark)] via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="font-body text-xs text-[var(--neon-gold)] tracking-[0.25em] uppercase mb-1">
                  {item.category} · {item.material}
                </div>
                <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] leading-tight">
                  {item.title}
                </h3>
              </div>
              <div className="absolute inset-0 border-2 border-[var(--neon-gold)] opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute top-4 left-4 font-display text-xs tracking-[0.2em] text-[var(--neon-gold)] opacity-60">
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="font-body text-[var(--text-muted)] text-sm">Показаны избранные работы. Полное портфолио — при обращении.</p>
        </div>
      </section>

      {/* ── ORDER FORM ── */}
      <section id="order" className="py-32 px-6 md:px-12 bg-[var(--metal-mid)]">
        <div className="max-w-3xl mx-auto">
          <div className="section-divider mb-20" />
          <div className="mb-12">
            <div className="font-body text-xs tracking-[0.35em] uppercase text-[var(--neon-gold)] opacity-60 mb-4">Начать проект</div>
            <h2 className="font-display font-bold text-5xl md:text-6xl leading-none text-[var(--text-primary)]">
              ОСТАВИТЬ<br />
              <span className="neon-text-subtle">ЗАЯВКУ</span>
            </h2>
          </div>

          {submitted ? (
            <div className="border border-[var(--neon-gold)] p-12 text-center">
              <div className="w-16 h-16 border-2 border-[var(--neon-gold)] flex items-center justify-center mx-auto mb-6">
                <Icon name="Check" size={28} className="text-[var(--neon-gold)]" fallback="Check" />
              </div>
              <h3 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-3">Заявка получена!</h3>
              <p className="font-body text-[var(--text-muted)]">Наш менеджер свяжется с вами в течение 30 минут в рабочее время.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 font-display text-xs tracking-[0.2em] uppercase text-[var(--neon-gold)] border border-[rgba(245,166,35,0.3)] px-6 py-3 hover:border-[var(--neon-gold)] transition-colors duration-300"
              >
                Новая заявка
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-xs tracking-[0.25em] uppercase text-[var(--text-muted)] mb-2">Ваше имя</label>
                  <input
                    type="text"
                    required
                    value={orderForm.name}
                    onChange={(e) => setOrderForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Иван Петров"
                    className="w-full bg-[var(--metal-dark)] border border-[rgba(245,166,35,0.15)] text-[var(--text-primary)] font-body px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon-gold)] focus:shadow-[0_0_8px_rgba(245,166,35,0.15)] transition-all duration-300 placeholder:text-[var(--text-muted)]"
                  />
                </div>
                <div>
                  <label className="block font-body text-xs tracking-[0.25em] uppercase text-[var(--text-muted)] mb-2">Телефон</label>
                  <input
                    type="tel"
                    required
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full bg-[var(--metal-dark)] border border-[rgba(245,166,35,0.15)] text-[var(--text-primary)] font-body px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon-gold)] focus:shadow-[0_0_8px_rgba(245,166,35,0.15)] transition-all duration-300 placeholder:text-[var(--text-muted)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-xs tracking-[0.25em] uppercase text-[var(--text-muted)] mb-2">Тип изделия</label>
                <select
                  value={orderForm.type}
                  onChange={(e) => setOrderForm((p) => ({ ...p, type: e.target.value }))}
                  className="w-full bg-[var(--metal-dark)] border border-[rgba(245,166,35,0.15)] text-[var(--text-primary)] font-body px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon-gold)] transition-all duration-300"
                >
                  <option value="" className="bg-[var(--metal-dark)]">Выберите тип...</option>
                  <option value="neon" className="bg-[var(--metal-dark)]">Неоновая вывеска</option>
                  <option value="acrylic" className="bg-[var(--metal-dark)]">Акриловая табличка</option>
                  <option value="metal" className="bg-[var(--metal-dark)]">Металлический знак</option>
                  <option value="lightbox" className="bg-[var(--metal-dark)]">Световой короб</option>
                  <option value="facade" className="bg-[var(--metal-dark)]">Фасадная вывеска</option>
                  <option value="other" className="bg-[var(--metal-dark)]">Другое</option>
                </select>
              </div>

              <div>
                <label className="block font-body text-xs tracking-[0.25em] uppercase text-[var(--text-muted)] mb-2">Описание идеи</label>
                <textarea
                  rows={4}
                  value={orderForm.description}
                  onChange={(e) => setOrderForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Опишите вашу идею: размеры, текст, цвета, место установки..."
                  className="w-full bg-[var(--metal-dark)] border border-[rgba(245,166,35,0.15)] text-[var(--text-primary)] font-body px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon-gold)] focus:shadow-[0_0_8px_rgba(245,166,35,0.15)] transition-all duration-300 placeholder:text-[var(--text-muted)] resize-none"
                />
              </div>

              <div>
                <label className="block font-body text-xs tracking-[0.25em] uppercase text-[var(--text-muted)] mb-2">
                  Прикрепить макет или референс
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf,.ai,.eps,.cdr"
                  onChange={handleFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full border border-dashed border-[rgba(245,166,35,0.25)] px-6 py-5 text-center hover:border-[var(--neon-gold)] hover:bg-[rgba(245,166,35,0.03)] transition-all duration-300 group"
                >
                  {fileName ? (
                    <span className="font-body text-sm text-[var(--neon-gold)] flex items-center justify-center gap-2">
                      <Icon name="Paperclip" size={14} fallback="File" />
                      {fileName}
                    </span>
                  ) : (
                    <span className="font-body text-sm text-[var(--text-muted)] flex items-center justify-center gap-2 group-hover:text-[var(--text-primary)] transition-colors">
                      <Icon name="Upload" size={14} fallback="Upload" />
                      Загрузить файл (JPG, PNG, PDF, AI)
                    </span>
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--neon-gold)] text-black font-display font-semibold text-sm tracking-[0.25em] uppercase py-4 hover:shadow-[0_0_30px_rgba(245,166,35,0.4)] transition-all duration-300 active:scale-[0.99]"
              >
                Отправить заявку
              </button>

              <p className="font-body text-xs text-[var(--text-muted)] text-center leading-relaxed">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности. Ответим в течение 30 минут.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── CONTACTS ── */}
      <section id="contacts" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="section-divider mb-20" />
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="font-body text-xs tracking-[0.35em] uppercase text-[var(--neon-gold)] opacity-60 mb-4">Связаться</div>
            <h2 className="font-display font-bold text-5xl md:text-6xl leading-none text-[var(--text-primary)] mb-12">
              КОНТАКТЫ
            </h2>
            <div className="space-y-6">
              {[
                { icon: "Phone", label: "Телефон", val: "+7 (999) 000-00-00" },
                { icon: "Mail", label: "Email", val: "info@znak-sign.ru" },
                { icon: "MapPin", label: "Адрес", val: "г. Москва, ул. Производственная, 1" },
                { icon: "Clock", label: "Режим работы", val: "Пн–Пт: 9:00–18:00" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-5 group">
                  <div className="w-10 h-10 border border-[rgba(245,166,35,0.2)] flex items-center justify-center flex-shrink-0 group-hover:border-[var(--neon-gold)] transition-colors duration-300">
                    <Icon name={c.icon} size={16} className="text-[var(--neon-gold)]" fallback="Star" />
                  </div>
                  <div>
                    <div className="font-body text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mb-0.5">{c.label}</div>
                    <div className="font-body text-[var(--text-primary)]">{c.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[rgba(245,166,35,0.15)] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32"
              style={{ background: "radial-gradient(circle at top right, rgba(245,166,35,0.08), transparent)" }} />
            <div className="font-display font-bold text-4xl text-[var(--text-primary)] leading-tight mb-4">
              ВЫЕЗД НА ЗАМЕР<br />
              <span className="neon-text-subtle">БЕСПЛАТНО</span>
            </div>
            <p className="font-body font-light text-[var(--text-muted)] text-sm leading-relaxed mb-8">
              Наш специалист приедет на объект, снимет замеры и поможет подобрать оптимальное решение. Без обязательств.
            </p>
            <button
              onClick={() => scrollTo("order")}
              className="font-display text-xs tracking-[0.2em] uppercase px-8 py-3 bg-[var(--neon-gold)] text-black hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] transition-all duration-300"
            >
              Записаться на замер
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[rgba(245,166,35,0.1)] py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display text-lg font-bold tracking-[0.2em] neon-text-subtle">ЗНАК</div>
          <div className="font-body text-xs text-[var(--text-muted)] tracking-wider">
            © 2024 ЗНАК. Производство вывесок и табличек.
          </div>
          <div className="font-body text-xs text-[var(--text-muted)] tracking-wider">
            Все права защищены
          </div>
        </div>
      </footer>
    </div>
  );
}
