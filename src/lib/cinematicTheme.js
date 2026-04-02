export const CINEMATIC_THEME = {
  page: {
    bg: 'bg-[#0a0a0b] text-white',
    shell: 'min-h-screen w-full bg-[#0a0a0b] text-white',
    contentWrap: 'mx-auto w-full max-w-[1680px]',
  },

  glass: {
    panel: 'rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45),0_0_55px_rgba(99,102,241,0.08)]',
    panelSoft: 'rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]',
    card: 'rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.028))] shadow-[0_14px_34px_rgba(0,0,0,0.26)]',
    cardSoft: 'rounded-2xl border border-white/10 bg-white/[0.03]',
    inset: 'rounded-2xl border border-white/10 bg-black/20',
    chip: 'rounded-full border border-white/10 bg-white/[0.04]',
    pill: 'rounded-full border border-white/10 bg-white/[0.04]',
    iconWrap: 'rounded-xl border shadow-[0_0_22px_rgba(99,102,241,0.18)]',
  },

  glow: {
    emerald: 'shadow-[0_0_28px_rgba(16,185,129,0.18)]',
    indigo: 'shadow-[0_0_28px_rgba(99,102,241,0.12)]',
    rose: 'shadow-[0_0_26px_rgba(244,63,94,0.14)]',
    amber: 'shadow-[0_0_26px_rgba(251,191,36,0.12)]',
    cyan: 'shadow-[0_0_26px_rgba(34,211,238,0.12)]',
    preview: 'shadow-[0_25px_80px_rgba(0,0,0,0.5),0_0_110px_rgba(16,185,129,0.20),0_0_70px_rgba(99,102,241,0.12)]',
  },

  active: {
    emerald: 'border-emerald-400/28 bg-emerald-500/12 text-white shadow-[0_0_28px_rgba(16,185,129,0.18)]',
    emeraldSoft: 'border-emerald-400/30 bg-emerald-500/12 text-emerald-100',
    white: 'border-white bg-white text-black shadow-xl',
  },

  text: {
    eyebrow: 'text-xs uppercase tracking-[0.24em] text-white/40',
    eyebrowWide: 'text-xs uppercase tracking-[0.28em] text-white/45',
    title: 'text-2xl font-black tracking-tight',
    titleLg: 'text-3xl font-black tracking-tight md:text-5xl',
    sectionTitle: 'mt-2 text-xl font-black',
    body: 'text-sm text-white/75',
    bodySoft: 'text-sm text-white/50',
    bodyMuted: 'text-sm text-white/45',
    statLabel: 'text-[11px] uppercase tracking-[0.18em] text-white/40',
  },

  buttons: {
    primary: 'rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-xl transition hover:opacity-90',
    secondary: 'rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.08]',
    ghost: 'rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75 transition hover:bg-white/[0.08]',
    chip: 'rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/75 transition hover:bg-white/[0.08]',
    chipActive: 'rounded-full border border-white bg-white px-3 py-2 text-xs font-semibold text-black',
  },

  layout: {
    panelPad: 'p-5 md:p-6',
    cardPad: 'p-4',
    sectionGap: 'space-y-6',
    grid3: 'grid grid-cols-1 gap-3 md:grid-cols-3',
    grid2: 'grid grid-cols-1 gap-3 md:grid-cols-2',
    flexBetween: 'flex flex-col gap-3 md:flex-row md:items-center md:justify-between',
  },

  accents: {
    emerald: 'from-emerald-500/14 via-teal-500/8 to-cyan-500/12',
    indigo: 'from-indigo-500/16 via-violet-500/8 to-blue-500/12',
    rose: 'from-rose-500/16 via-pink-500/8 to-fuchsia-500/12',
    amber: 'from-amber-500/14 via-orange-500/7 to-rose-500/12',
  },
};

export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function pageShell(extra = '') {
  return cx(CINEMATIC_THEME.page.shell, extra);
}

export function glassPanel(extra = '') {
  return cx(CINEMATIC_THEME.glass.panel, CINEMATIC_THEME.layout.panelPad, extra);
}

export function glassPanelSoft(extra = '') {
  return cx(CINEMATIC_THEME.glass.panelSoft, CINEMATIC_THEME.layout.panelPad, extra);
}

export function glassCard(extra = '') {
  return cx(CINEMATIC_THEME.glass.card, extra);
}

export function glassCardSoft(extra = '') {
  return cx(CINEMATIC_THEME.glass.cardSoft, extra);
}

export function insetSurface(extra = '') {
  return cx(CINEMATIC_THEME.glass.inset, extra);
}

export function chipButton({ active = false, extra = '' } = {}) {
  return cx(active ? CINEMATIC_THEME.buttons.chipActive : CINEMATIC_THEME.buttons.chip, extra);
}

export function actionButton({ variant = 'secondary', extra = '' } = {}) {
  const map = {
    primary: CINEMATIC_THEME.buttons.primary,
    secondary: CINEMATIC_THEME.buttons.secondary,
    ghost: CINEMATIC_THEME.buttons.ghost,
  };
  return cx(map[variant] || map.secondary, extra);
}

export function activeSurface({ tone = 'emerald', extra = '' } = {}) {
  const map = {
    emerald: CINEMATIC_THEME.active.emerald,
    emeraldSoft: CINEMATIC_THEME.active.emeraldSoft,
    indigo: 'border-indigo-400/28 bg-indigo-500/12 text-white shadow-[0_0_28px_rgba(99,102,241,0.12)]',
    rose: 'border-rose-400/28 bg-rose-500/12 text-white shadow-[0_0_28px_rgba(244,63,94,0.14)]',
    amber: 'border-amber-400/28 bg-amber-500/12 text-white shadow-[0_0_28px_rgba(251,191,36,0.12)]',
    cyan: 'border-cyan-400/28 bg-cyan-500/12 text-white shadow-[0_0_28px_rgba(34,211,238,0.12)]',
    fuchsia: 'border-fuchsia-400/28 bg-fuchsia-500/12 text-white shadow-[0_0_28px_rgba(232,121,249,0.14)]',
    white: CINEMATIC_THEME.active.white,
  };
  return cx(map[tone] || map.emerald, extra);
}

export function accentGlow(name = 'indigo') {
  return CINEMATIC_THEME.glow[name] || CINEMATIC_THEME.glow.indigo;
}

export function gradientAccent(name = 'indigo') {
  return CINEMATIC_THEME.accents[name] || CINEMATIC_THEME.accents.indigo;
}

// Get random accent from available colors
export function getRandomAccent() {
  const accents = ['emerald', 'indigo', 'rose', 'amber', 'cyan'];
  return accents[Math.floor(Math.random() * accents.length)];
}

// Get random accent and return both gradient and glow
export function randomAccent() {
  const accent = getRandomAccent();
  return {
    gradient: gradientAccent(accent),
    glow: accentGlow(accent),
    name: accent
  };
}
