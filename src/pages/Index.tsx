import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const IMG1 = "https://cdn.poehali.dev/projects/e43ab287-0b0e-458e-ab21-5895f14adfba/files/57c5972a-8b1d-49d2-bdea-311d1d97d712.jpg";
const IMG2 = "https://cdn.poehali.dev/projects/e43ab287-0b0e-458e-ab21-5895f14adfba/files/5f2a67fb-eede-49b5-9fab-fec04cfddc41.jpg";
const IMG3 = "https://cdn.poehali.dev/projects/e43ab287-0b0e-458e-ab21-5895f14adfba/files/a897ecac-bf2f-4abd-9fab-dbaf52f67ac3.jpg";

const SERVICES = [
  { num: "01", icon: "Zap",        title: "Неоновые вывески",   desc: "LED и классический неон любой формы. Для фасадов, интерьеров, фотозон.", hot: true  },
  { num: "02", icon: "Layers",     title: "Акриловые таблички", desc: "Объёмные буквы с торцевой подсветкой. Идеально для офисов и рецепций.",  hot: false },
  { num: "03", icon: "Scissors",   title: "Металлические знаки",desc: "Лазерная резка нержавейки, латуни, алюминия. Износостойкость — десятки лет.", hot: false },
  { num: "04", icon: "Monitor",    title: "Световые короба",    desc: "Равномерная подсветка, заметны в любую погоду, работают круглосуточно.", hot: false },
  { num: "05", icon: "Paintbrush", title: "Фасадные вывески",   desc: "Комплексное оформление под ключ: дизайн → производство → монтаж.", hot: true  },
  { num: "06", icon: "Tag",        title: "Навигация",          desc: "Системы указателей для ТЦ, бизнес-центров, медицинских учреждений.",  hot: false },
];

const PORTFOLIO = [
  { img: IMG1, title: "Неоновая вывеска NOVA",         tag: "Неон",   year: "2024" },
  { img: IMG2, title: "Световые буквы на фасаде",      tag: "Фасад",  year: "2024" },
  { img: IMG3, title: "Акриловые 3D-буквы для ритейла",tag: "Акрил",  year: "2023" },
];

const MARQUEE_TEXT = ["ВЫВЕСКИ", "ТАБЛИЧКИ", "СВЕТОВЫЕ БУКВЫ", "ФАСАДНОЕ ОФОРМЛЕНИЕ", "НЕОН", "ПОД КЛЮЧ"];

export default function Index() {
  const [active, setActive] = useState("");
  const [form, setForm]     = useState({ name: "", phone: "", type: "", desc: "", file: null as File | null });
  const [fileName, setFN]   = useState("");
  const [sent, setSent]     = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setForm(p => ({ ...p, file: f })); setFN(f.name); }
  };

  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };

  const navItems = [
    { id: "about",    label: "О нас"     },
    { id: "services", label: "Услуги"    },
    { id: "portfolio",label: "Портфолио" },
    { id: "order",    label: "Заказать"  },
    { id: "contacts", label: "Контакты"  },
  ];

  return (
    <div className="min-h-screen font-display" style={{ background: "var(--paper)", color: "var(--ink)" }}>

      {/* ─── NAVBAR ─── */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
        style={{ background: "rgba(247,245,240,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <button onClick={() => go("hero")} className="font-display font-black text-xl tracking-tight" style={{ color: "var(--ink)" }}>
          ЗН<span style={{ color: "var(--brand-red)" }}>А</span>К
        </button>
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map(n => (
            <button key={n.id} onClick={() => go(n.id)}
              className="font-display text-xs font-700 tracking-widest uppercase transition-colors duration-200"
              style={{ color: active === n.id ? "var(--brand-red)" : "var(--ink-light)" }}>
              {n.label}
            </button>
          ))}
        </nav>
        <button onClick={() => go("order")}
          className="stripe-red text-white font-black text-xs tracking-widest uppercase px-5 py-2.5 transition-opacity hover:opacity-90">
          ЗАКАЗАТЬ
        </button>
      </header>

      {/* ─── HERO ─── */}
      <section id="hero" className="relative pt-16 min-h-screen flex flex-col overflow-hidden">

        {/* Big BG number */}
        <div className="pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 font-black leading-none opacity-[0.04]"
          style={{ fontSize: "clamp(18rem, 40vw, 52rem)", color: "var(--brand-red)", lineHeight: 1 }}>
          01
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-12 pb-0 max-w-[1400px] mx-auto w-full">

          {/* Pill */}
          <div className="anim-fade d0 inline-flex items-center gap-2 self-start mb-8">
            <span className="stripe-red text-white text-xs font-black tracking-widest uppercase px-3 py-1">
              С 2012 ГОДА
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--ink-light)" }}>
              Производство вывесок
            </span>
          </div>

          {/* Headline */}
          <div className="overflow-hidden mb-2">
            <h1 className="anim-up d1 font-black uppercase leading-none"
              style={{ fontSize: "clamp(4.5rem, 13vw, 13rem)", letterSpacing: "-0.03em", color: "var(--ink)" }}>
              ВЫВЕСКИ
            </h1>
          </div>
          <div className="overflow-hidden mb-6">
            <h1 className="anim-up d2 font-black uppercase leading-none"
              style={{ fontSize: "clamp(4.5rem, 13vw, 13rem)", letterSpacing: "-0.03em", color: "var(--brand-red)" }}>
              И ТАБЛИЧКИ
            </h1>
          </div>

          {/* Red rule */}
          <div className="anim-line d3 h-1 w-48 mb-8 stripe-red" />

          {/* Sub + stats row */}
          <div className="anim-up d4 flex flex-col lg:flex-row lg:items-end gap-10">
            <p className="max-w-md text-base font-medium leading-relaxed" style={{ color: "var(--ink-light)" }}>
              Делаем знаки, которые работают на ваш бизнес — неоновые, световые, металлические. Производство и монтаж по всей России.
            </p>
            <div className="flex gap-10 lg:ml-auto">
              {[["1200+","проектов"],["12 лет","опыта"],["48 ч","срок изготовления"]].map(([v,l]) => (
                <div key={v}>
                  <div className="font-black text-3xl leading-none" style={{ color: "var(--brand-red)" }}>{v}</div>
                  <div className="text-xs font-semibold tracking-widest uppercase mt-1" style={{ color: "var(--ink-light)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="anim-up d5 flex flex-wrap gap-4 mt-12">
            <button onClick={() => go("order")}
              className="stripe-red text-white font-black text-sm tracking-widest uppercase px-10 py-4 transition-opacity hover:opacity-90">
              ЗАКАЗАТЬ ВЫВЕСКУ
            </button>
            <button onClick={() => go("portfolio")}
              className="font-black text-sm tracking-widest uppercase px-10 py-4 border-2 transition-colors duration-200 hover:bg-ink hover:text-paper"
              style={{ borderColor: "var(--ink)", color: "var(--ink)" }}>
              ПОРТФОЛИО
            </button>
          </div>
        </div>

        {/* Bottom image strip */}
        <div className="relative z-10 mt-16 grid grid-cols-3 h-52 md:h-72 overflow-hidden">
          {[IMG1, IMG2, IMG3].map((src, i) => (
            <div key={i} className="overflow-hidden relative">
              <img src={src} alt="" className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(247,245,240,0.6), transparent 60%)" }} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <div className="stripe-red py-4 overflow-hidden" style={{ borderTop: "3px solid var(--ink)", borderBottom: "3px solid var(--ink)" }}>
        <div className="marquee-track flex gap-12 whitespace-nowrap">
          {[...MARQUEE_TEXT, ...MARQUEE_TEXT].map((t, i) => (
            <span key={i} className="font-black text-sm tracking-widest text-white flex items-center gap-12">
              {t}
              <span className="opacity-50">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-28 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left text */}
          <div>
            <div className="font-serif italic text-5xl mb-2" style={{ color: "var(--brand-red)" }}>О компании</div>
            <h2 className="font-black text-5xl md:text-6xl leading-tight uppercase mb-8" style={{ color: "var(--ink)" }}>
              МЫ ДЕЛАЕМ<br />
              ЗНАКИ,<br />
              КОТОРЫЕ<br />
              ГОВОРЯТ
            </h2>
            <div className="h-1 w-16 stripe-red mb-8" />
            <p className="text-base leading-relaxed font-medium mb-5" style={{ color: "var(--ink-light)" }}>
              Компания ЗНАК работает с 2012 года. Специализируемся на производстве наружной рекламы и навигационных систем — от небольших офисных табличек до масштабных фасадных конструкций.
            </p>
            <p className="text-base leading-relaxed font-medium mb-10" style={{ color: "var(--ink-light)" }}>
              Собственное производство, опытные мастера и жёсткий контроль качества — вот почему нам доверяют крупные сети, рестораны и бизнес-центры.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Собственное производство", "Гарантия 3 года", "Выезд на замер — бесплатно"].map(t => (
                <span key={t} className="font-black text-xs tracking-widest uppercase px-4 py-2 border-2"
                  style={{ borderColor: "var(--brand-red)", color: "var(--brand-red)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right image collage */}
          <div className="relative">
            <img src={IMG2} alt="Производство" className="w-full h-96 object-cover lift" />
            {/* Floating red badge */}
            <div className="absolute -bottom-5 -left-5 stripe-red text-white p-6 lift">
              <div className="font-black text-5xl leading-none">12</div>
              <div className="font-black text-xs tracking-widest uppercase mt-1">лет на рынке</div>
            </div>
            {/* Corner accent */}
            <div className="absolute -top-3 -right-3 w-16 h-16 border-4" style={{ borderColor: "var(--ink)" }} />
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" className="py-28 px-6 md:px-16" style={{ background: "var(--ink)" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="font-serif italic text-5xl mb-2" style={{ color: "var(--brand-red)" }}>Что мы делаем</div>
              <h2 className="font-black text-5xl md:text-7xl leading-none uppercase" style={{ color: "var(--paper)" }}>УСЛУГИ</h2>
            </div>
            <p className="max-w-xs text-sm font-medium leading-relaxed" style={{ color: "rgba(247,245,240,0.5)" }}>
              Полный цикл: дизайн → производство → монтаж. Любые материалы, любые объёмы.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
            {SERVICES.map(s => (
              <div key={s.num}
                className="group relative p-8 transition-all duration-300 cursor-default"
                style={{ background: "var(--ink)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--brand-red)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--ink)")}>
                {s.hot && (
                  <span className="absolute top-6 right-6 font-black text-xs tracking-widest uppercase px-2 py-0.5"
                    style={{ background: "var(--brand-yellow)", color: "var(--ink)" }}>
                    ХИТ
                  </span>
                )}
                <div className="font-serif italic text-4xl mb-5" style={{ color: "rgba(255,255,255,0.15)" }}>
                  {s.num}
                </div>
                <div className="w-10 h-10 flex items-center justify-center border-2 mb-5"
                  style={{ borderColor: "rgba(255,255,255,0.2)" }}>
                  <Icon name={s.icon} size={18} className="text-white" fallback="Star" />
                </div>
                <h3 className="font-black text-lg uppercase tracking-wide mb-3" style={{ color: "var(--paper)" }}>
                  {s.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed" style={{ color: "rgba(247,245,240,0.55)" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PORTFOLIO ─── */}
      <section id="portfolio" className="py-28 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="font-serif italic text-5xl mb-2" style={{ color: "var(--brand-red)" }}>Наши работы</div>
            <h2 className="font-black text-5xl md:text-7xl leading-none uppercase" style={{ color: "var(--ink)" }}>ПОРТФОЛИО</h2>
          </div>
          <div className="h-1 w-24 stripe-red self-end mb-3 hidden md:block" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PORTFOLIO.map((p, i) => (
            <div key={i} className="group relative overflow-hidden lift cursor-pointer">
              <img src={p.img} alt={p.title}
                className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105" />
              {/* Overlay */}
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: "rgba(255,51,0,0.85)" }}>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="font-black text-xs tracking-widest uppercase text-white/70 mb-2">{p.tag} · {p.year}</div>
                  <h3 className="font-black text-xl uppercase text-white leading-tight">{p.title}</h3>
                </div>
              </div>
              {/* Default label */}
              <div className="absolute bottom-0 left-0 right-0 p-6 group-hover:opacity-0 transition-opacity duration-300"
                style={{ background: "linear-gradient(to top, rgba(13,13,13,0.85), transparent)" }}>
                <div className="font-black text-xs tracking-widest uppercase mb-1" style={{ color: "var(--brand-red)" }}>{p.tag}</div>
                <h3 className="font-black text-lg uppercase text-white leading-tight">{p.title}</h3>
              </div>
              {/* Number */}
              <div className="absolute top-4 left-4 font-serif italic text-5xl leading-none font-bold"
                style={{ color: "rgba(255,255,255,0.2)" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm font-semibold tracking-wide mt-10" style={{ color: "var(--ink-light)" }}>
          Показаны избранные работы — полное портфолио по запросу
        </p>
      </section>

      {/* ─── ORDER ─── */}
      <section id="order" className="py-28 px-6 md:px-16" style={{ background: "var(--paper-dark)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="font-serif italic text-5xl mb-2" style={{ color: "var(--brand-red)" }}>Начать проект</div>
          <h2 className="font-black text-5xl md:text-6xl leading-none uppercase mb-3" style={{ color: "var(--ink)" }}>
            ОСТАВИТЬ<br />ЗАЯВКУ
          </h2>
          <div className="h-1 w-16 stripe-red mb-12" />

          {sent ? (
            <div className="text-center py-16 border-2" style={{ borderColor: "var(--brand-red)" }}>
              <div className="stripe-red w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Icon name="Check" size={28} className="text-white" fallback="Check" />
              </div>
              <h3 className="font-black text-3xl uppercase mb-3" style={{ color: "var(--ink)" }}>Заявка получена!</h3>
              <p className="font-medium" style={{ color: "var(--ink-light)" }}>Свяжемся в течение 30 минут в рабочее время.</p>
              <button onClick={() => setSent(false)}
                className="mt-8 font-black text-xs tracking-widest uppercase px-8 py-3 border-2 transition-colors hover:bg-ink hover:text-paper"
                style={{ borderColor: "var(--ink)", color: "var(--ink)" }}>
                Новая заявка
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-black text-xs tracking-widest uppercase mb-2" style={{ color: "var(--ink-light)" }}>Ваше имя</label>
                  <input required type="text" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Иван Петров"
                    className="w-full border-2 bg-transparent px-4 py-3 text-sm font-medium focus:outline-none transition-colors duration-200"
                    style={{ borderColor: "rgba(0,0,0,0.15)", color: "var(--ink)" }}
                    onFocus={e => (e.target.style.borderColor = "var(--brand-red)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.15)")} />
                </div>
                <div>
                  <label className="block font-black text-xs tracking-widest uppercase mb-2" style={{ color: "var(--ink-light)" }}>Телефон</label>
                  <input required type="tel" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full border-2 bg-transparent px-4 py-3 text-sm font-medium focus:outline-none transition-colors duration-200"
                    style={{ borderColor: "rgba(0,0,0,0.15)", color: "var(--ink)" }}
                    onFocus={e => (e.target.style.borderColor = "var(--brand-red)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.15)")} />
                </div>
              </div>

              <div>
                <label className="block font-black text-xs tracking-widest uppercase mb-2" style={{ color: "var(--ink-light)" }}>Тип изделия</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full border-2 bg-transparent px-4 py-3 text-sm font-medium focus:outline-none"
                  style={{ borderColor: "rgba(0,0,0,0.15)", color: "var(--ink)", background: "var(--paper-dark)" }}>
                  <option value="">Выберите тип...</option>
                  <option value="neon">Неоновая вывеска</option>
                  <option value="acrylic">Акриловая табличка</option>
                  <option value="metal">Металлический знак</option>
                  <option value="lightbox">Световой короб</option>
                  <option value="facade">Фасадная вывеска</option>
                  <option value="other">Другое</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-xs tracking-widest uppercase mb-2" style={{ color: "var(--ink-light)" }}>Описание идеи</label>
                <textarea rows={4} value={form.desc}
                  onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
                  placeholder="Размеры, текст, цвета, место установки..."
                  className="w-full border-2 bg-transparent px-4 py-3 text-sm font-medium focus:outline-none resize-none transition-colors duration-200"
                  style={{ borderColor: "rgba(0,0,0,0.15)", color: "var(--ink)" }}
                  onFocus={e => (e.target.style.borderColor = "var(--brand-red)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.15)")} />
              </div>

              {/* File upload */}
              <div>
                <label className="block font-black text-xs tracking-widest uppercase mb-2" style={{ color: "var(--ink-light)" }}>
                  Прикрепить макет / референс
                </label>
                <input ref={fileRef} type="file" accept="image/*,.pdf,.ai,.eps,.cdr" onChange={onFile} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed px-6 py-5 flex items-center justify-center gap-3 font-black text-xs tracking-widest uppercase transition-colors duration-200 hover:border-brand"
                  style={{ borderColor: "rgba(0,0,0,0.2)", color: "var(--ink-light)" }}>
                  <Icon name="Upload" size={14} fallback="Upload" />
                  {fileName || "Загрузить файл (JPG, PNG, PDF, AI)"}
                </button>
              </div>

              <button type="submit"
                className="w-full stripe-red text-white font-black text-sm tracking-widest uppercase py-4 transition-opacity hover:opacity-90">
                ОТПРАВИТЬ ЗАЯВКУ →
              </button>
              <p className="text-xs font-medium text-center" style={{ color: "var(--ink-light)" }}>
                Ответим в течение 30 минут · Политика конфиденциальности
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ─── CONTACTS ─── */}
      <section id="contacts" className="py-28 px-6 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="font-serif italic text-5xl mb-2" style={{ color: "var(--brand-red)" }}>Связаться</div>
            <h2 className="font-black text-5xl md:text-6xl leading-none uppercase mb-12" style={{ color: "var(--ink)" }}>
              КОНТАКТЫ
            </h2>
            <div className="space-y-7">
              {[
                { icon: "Phone",  label: "Телефон",       val: "+7 (999) 000-00-00" },
                { icon: "Mail",   label: "Email",          val: "info@znak-sign.ru" },
                { icon: "MapPin", label: "Адрес",          val: "г. Москва, ул. Производственная, 1" },
                { icon: "Clock",  label: "Режим работы",   val: "Пн–Пт: 9:00–18:00" },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-5">
                  <div className="stripe-red w-11 h-11 flex-shrink-0 flex items-center justify-center">
                    <Icon name={c.icon} size={16} className="text-white" fallback="Star" />
                  </div>
                  <div>
                    <div className="font-black text-xs tracking-widest uppercase mb-0.5" style={{ color: "var(--ink-light)" }}>{c.label}</div>
                    <div className="font-bold text-base" style={{ color: "var(--ink)" }}>{c.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA block */}
          <div className="stripe-red p-10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-black/10" />
            <div className="relative z-10">
              <div className="font-black text-4xl uppercase leading-tight text-white mb-4">
                ВЫЕЗД НА ЗАМЕР<br />БЕСПЛАТНО
              </div>
              <p className="text-sm font-medium text-white/80 leading-relaxed mb-8">
                Специалист приедет на объект, снимет замеры и подберёт оптимальное решение. Без обязательств.
              </p>
              <button onClick={() => go("order")}
                className="font-black text-xs tracking-widest uppercase px-8 py-3 bg-white transition-colors hover:bg-paper"
                style={{ color: "var(--brand-red)" }}>
                ЗАПИСАТЬСЯ НА ЗАМЕР
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-8 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ background: "var(--ink)", borderTop: "3px solid var(--brand-red)" }}>
        <div className="font-black text-xl tracking-tight" style={{ color: "var(--paper)" }}>
          ЗН<span style={{ color: "var(--brand-red)" }}>А</span>К
        </div>
        <div className="font-medium text-xs tracking-wider uppercase" style={{ color: "rgba(247,245,240,0.4)" }}>
          © 2024 ЗНАК · Производство вывесок и табличек
        </div>
        <div className="font-medium text-xs tracking-wider uppercase" style={{ color: "rgba(247,245,240,0.4)" }}>
          Все права защищены
        </div>
      </footer>
    </div>
  );
}
