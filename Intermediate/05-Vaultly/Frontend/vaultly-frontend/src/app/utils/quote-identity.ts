export interface IQuoteIdentity {
    glyph: 'ankh' | 'eye' | 'scarab' | 'lotus' | 'feather' | 'sun' | 'wave' | 'reed';
    tone: string;
    accent: string;
    border: string;
    bg: string;
}

const GLYPHS: IQuoteIdentity['glyph'][] = ['ankh', 'eye', 'scarab', 'lotus', 'feather', 'sun', 'wave', 'reed'];

const TONES = [
    { tone: 'bronze', accent: 'text-bronze-700 dark:text-bronze-300', border: 'border-bronze-500/40', bg: 'bg-bronze-500/5' },
    { tone: 'nile', accent: 'text-nile-700 dark:text-nile-300', border: 'border-nile-500/40', bg: 'bg-nile-500/5' },
    { tone: 'terracotta', accent: 'text-terracotta-700 dark:text-terracotta-300', border: 'border-terracotta-500/40', bg: 'bg-terracotta-500/5' },
    { tone: 'emerald', accent: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-600/40', bg: 'bg-emerald-600/5' },
    { tone: 'amber', accent: 'text-amber-700 dark:text-amber-300', border: 'border-amber-600/40', bg: 'bg-amber-600/5' },
    { tone: 'indigo', accent: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-600/40', bg: 'bg-indigo-600/5' }
];

export function getQuoteIdentity(id: number): IQuoteIdentity {
    const glyph = GLYPHS[Math.abs(id) % GLYPHS.length];
    const t = TONES[Math.abs(id) % TONES.length];
    return { glyph, ...t };
}