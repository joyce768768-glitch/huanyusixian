import type { ReactNode } from 'react';

/**
 * BookCover — 统一风格的竖版绘本封面
 * 不依赖第三方图床：按商品主题绘制渐变底色 + 手绘风插画 motif + 衬线书名，
 * 保证全站书封风格一致、永不裂图、与暖调品牌天然搭配。
 */

type ThemeKey = 'space' | 'garden' | 'moon' | 'popup' | 'ocean' | 'ink' | 'prince' | 'swan';

interface Theme {
  bg: string;
  glow: string;
  accent: string;
  ink: string;
  light: boolean;
  en: string;
}

const THEMES: Record<ThemeKey, Theme> = {
  space:  { bg: 'linear-gradient(166deg,#2b2a6b 0%,#3c2f7e 48%,#63388c 100%)', glow: 'rgba(255,214,138,.6)',  accent: '#ffd68a', ink: '#ffffff', light: false, en: 'STARRY EXPLORER' },
  garden: { bg: 'linear-gradient(166deg,#2c6247 0%,#3f7d57 52%,#86a85c 100%)', glow: 'rgba(255,224,150,.55)', accent: '#ffe6a0', ink: '#ffffff', light: false, en: 'SECRET GARDEN' },
  moon:   { bg: 'linear-gradient(166deg,#23395f 0%,#38568a 52%,#6f84b4 100%)', glow: 'rgba(255,240,205,.65)', accent: '#fff0c8', ink: '#ffffff', light: false, en: 'BEDTIME TALES' },
  popup:  { bg: 'linear-gradient(166deg,#7a4726 0%,#a5653a 50%,#d0924f 100%)', glow: 'rgba(255,226,168,.55)', accent: '#ffe3b4', ink: '#ffffff', light: false, en: 'POP-UP FOREST' },
  ocean:  { bg: 'linear-gradient(166deg,#1d5571 0%,#2e7d96 52%,#62b3c2 100%)', glow: 'rgba(150,232,240,.55)', accent: '#c4f0f6', ink: '#ffffff', light: false, en: 'DEEP SEA' },
  ink:    { bg: 'linear-gradient(166deg,#f4e8d0 0%,#efdab6 55%,#e6c89b 100%)', glow: 'rgba(196,66,34,.4)',   accent: '#c8451f', ink: '#4a2f18', light: true,  en: 'CHINESE IDIOMS' },
  prince: { bg: 'linear-gradient(166deg,#c25f34 0%,#e08a4a 48%,#f4c56b 100%)', glow: 'rgba(255,242,206,.7)',  accent: '#fff2ce', ink: '#ffffff', light: false, en: 'LITTLE PRINCE' },
  swan:   { bg: 'linear-gradient(166deg,#7e5ea8 0%,#ac82b6 50%,#e7b9c9 100%)', glow: 'rgba(255,240,246,.6)',  accent: '#fff0f6', ink: '#ffffff', light: false, en: 'FAIRY TALES' },
};

const THEME_KEYS = Object.keys(THEMES) as ThemeKey[];

const COVER_MAP: Record<string, { theme: ThemeKey; short: string }> = {
  'PRD-001': { theme: 'space',  short: '星空探险家' },
  'PRD-002': { theme: 'garden', short: '秘密花园' },
  'PRD-003': { theme: 'moon',   short: '睡前故事' },
  'PRD-004': { theme: 'popup',  short: '魔法森林' },
  'PRD-005': { theme: 'ocean',  short: '海底两万里' },
  'PRD-006': { theme: 'ink',    short: '成语故事' },
  'PRD-007': { theme: 'prince', short: '小王子' },
  'PRD-008': { theme: 'swan',   short: '安徒生童话' },
  'PRD-009': { theme: 'garden', short: '恐龙王国' },
  'PRD-010': { theme: 'ink',    short: '传统节日' },
  'PRD-011': { theme: 'ocean',  short: '神奇校车' },
  'PRD-012': { theme: 'moon',   short: '格林童话' },
  'PRD-013': { theme: 'popup',  short: '情绪小怪兽' },
  'PRD-014': { theme: 'ink',    short: '唐诗三百首' },
  'PRD-015': { theme: 'space',  short: '太空漫游' },
  'PRD-016': { theme: 'swan',   short: '爱与陪伴' },
};

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function deriveShort(title: string): string {
  const t = (title || '').replace(/儿童绘本|绘本|盲盒|套装|礼盒|精装|典藏版|典藏|双语|立体书|系列/g, '').trim();
  const first = t.split(/[·・,，、（(]/)[0].trim();
  return (first || t || '精选绘本').slice(0, 6);
}

export interface CoverSubject {
  id?: string;
  productId?: string;
  title?: string;
  name?: string;
  category?: string;
}

/** 手绘风插画 motif，颜色取自 currentColor（accent）与白色 */
function Motif({ k }: { k: ThemeKey }): ReactNode {
  const W = '#ffffff';
  switch (k) {
    case 'space':
      return (
        <g>
          {[[18, 26, 1.4], [100, 20, 1.1], [104, 92, 1.3], [22, 98, 1]].map(([x, y, s], i) => (
            <path key={i} fill={W} opacity=".9" transform={`translate(${x} ${y}) scale(${s})`}
              d="M0,-6 L1.6,-1.6 L6,0 L1.6,1.6 L0,6 L-1.6,1.6 L-6,0 L-1.6,-1.6 Z" />
          ))}
          <circle cx="96" cy="34" r="9" fill={W} opacity=".85" />
          <ellipse cx="96" cy="34" rx="15" ry="4.5" fill="none" stroke={W} strokeWidth="2" opacity=".7" transform="rotate(-18 96 34)" />
          <g transform="translate(60 64)">
            <path d="M-5 26 L0 44 L5 26 Z" fill="#ffb347" />
            <path d="M-13 20 L-26 38 L-11 35 Z" fill="#ff8a5c" />
            <path d="M13 20 L26 38 L11 35 Z" fill="#ff8a5c" />
            <path d="M0 -34 C14 -20 14 16 0 30 C-14 16 -14 -20 0 -34 Z" fill={W} />
            <circle cy="-4" r="7.5" fill="#ffd68a" />
            <circle cy="-4" r="3.6" fill="#3c2f7e" />
          </g>
        </g>
      );
    case 'garden':
      return (
        <g>
          {[[24, 40], [98, 52], [30, 78], [92, 86]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2" fill="#ffe6a0" opacity=".9" />
          ))}
          <ellipse cx="60" cy="104" rx="46" ry="12" fill={W} opacity=".12" />
          <rect x="56" y="66" width="8" height="30" rx="3" fill="#6b4a2b" />
          <circle cx="60" cy="52" r="22" fill="#7fbf7e" />
          <circle cx="42" cy="62" r="15" fill="#93cf8e" />
          <circle cx="78" cy="62" r="15" fill="#93cf8e" />
          {[[50, 46], [66, 50], [58, 60], [74, 62]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.6" fill="#ffe6a0" />
          ))}
          <g transform="translate(34 92)">
            <path d="M-8 0 L8 0 L5 -8 L-5 -8 Z" fill="#e0604a" />
            <rect x="-2" y="0" width="4" height="9" rx="1.5" fill="#f3e2c8" />
          </g>
          <g transform="translate(88 95)">
            <path d="M-7 0 L7 0 L4 -7 L-4 -7 Z" fill="#e0604a" />
            <rect x="-1.8" y="0" width="3.6" height="8" rx="1.5" fill="#f3e2c8" />
          </g>
        </g>
      );
    case 'moon':
      return (
        <g>
          {[[22, 30], [96, 26], [102, 66], [26, 86]].map(([x, y], i) => (
            <path key={i} fill={W} opacity=".9" transform={`translate(${x} ${y})`}
              d="M0,-5 L1.3,-1.3 L5,0 L1.3,1.3 L0,5 L-1.3,1.3 L-5,0 L-1.3,-1.3 Z" />
          ))}
          <path d="M52 20 a26 26 0 1 0 0 52 a21 21 0 1 1 0 -52 Z" fill="#fff0c8" transform="translate(-4 4)" />
          <g fill={W} opacity=".9">
            <ellipse cx="40" cy="100" rx="26" ry="8" />
            <ellipse cx="74" cy="96" rx="20" ry="6" opacity=".7" />
          </g>
        </g>
      );
    case 'popup':
      return (
        <g>
          <path d="M84 18 a2 2 0 1 0 .1 0" fill="#ffe3b4" />
          <circle cx="92" cy="26" r="10" fill="#ffe3b4" opacity=".9" />
          <path d="M28 96 L48 44 L68 96 Z" fill={W} opacity=".18" />
          <rect x="45" y="92" width="6" height="12" fill={W} opacity=".18" />
          <path d="M58 100 L84 40 L110 100 Z" fill="#f7e4c2" />
          <rect x="80" y="94" width="7" height="14" fill="#d9b98a" />
          <g transform="translate(36 74)">
            <path d="M-12 -2 L-8 -12 L-4 -2 Z M4 -2 L8 -12 L12 -2 Z" fill="#5a3a22" />
            <circle cy="4" r="13" fill="#6b4628" />
            <circle cx="-5" cy="2" r="4.6" fill={W} />
            <circle cx="5" cy="2" r="4.6" fill={W} />
            <circle cx="-5" cy="2.6" r="2.2" fill="#2a1a0e" />
            <circle cx="5" cy="2.6" r="2.2" fill="#2a1a0e" />
            <path d="M-3 9 L3 9 L0 12 Z" fill="#ffb347" />
          </g>
        </g>
      );
    case 'ocean':
      return (
        <g>
          {[[26, 40, 3], [20, 56, 2], [100, 44, 2.4]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={W} strokeWidth="1.6" opacity=".7" />
          ))}
          <g fill={W} opacity=".92">
            <path d="M20 44 q8 -8 16 0 q-8 8 -16 0 Z" />
            <path d="M36 44 l8 -6 v12 Z" />
            <path d="M102 84 q7 -7 14 0 q-7 7 -14 0 Z" />
            <path d="M88 84 l-7 -5 v10 Z" />
          </g>
          <g transform="translate(60 64)">
            <rect x="-6" y="-20" width="12" height="10" rx="3" fill="#ffd98a" />
            <rect x="-22" y="-10" width="44" height="26" rx="13" fill="#ffd98a" />
            {[-12, 0, 12].map((cx) => (
              <circle key={cx} cx={cx} cy="3" r="4.6" fill="#1d5571" />
            ))}
            <path d="M22 -2 l10 -5 v12 l-10 -4 Z" fill="#e8a94e" />
          </g>
          <g fill="none" stroke={W} strokeWidth="2.4" strokeLinecap="round" opacity=".75">
            <path d="M14 96 q8 -6 16 0 t16 0 t16 0" />
            <path d="M52 104 q8 -6 16 0 t16 0 t16 0" />
          </g>
        </g>
      );
    case 'ink':
      return (
        <g>
          <circle cx="86" cy="34" r="13" fill="#c8451f" opacity=".9" />
          <path d="M10 92 L42 52 L62 74 L80 46 L112 92 Z" fill="#4a2f18" opacity=".16" />
          <path d="M-2 102 L30 66 L56 102 Z" fill="#4a2f18" opacity=".3" />
          <g transform="translate(30 70)" fill="#4a2f18" opacity=".82">
            <rect x="-2" y="10" width="4" height="16" />
            <path d="M0 -14 L-12 2 L12 2 Z" />
            <path d="M0 -2 L-14 14 L14 14 Z" />
          </g>
          <path d="M70 40 q6 -6 12 0 M84 34 q5 -5 10 0" stroke="#4a2f18" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".5" />
        </g>
      );
    case 'prince':
      return (
        <g>
          {[[22, 30], [98, 26], [100, 58], [20, 70]].map(([x, y], i) => (
            <path key={i} fill={W} opacity=".9" transform={`translate(${x} ${y})`}
              d="M0,-5 L1.3,-1.3 L5,0 L1.3,1.3 L0,5 L-1.3,1.3 L-5,0 L-1.3,-1.3 Z" />
          ))}
          <ellipse cx="60" cy="86" rx="34" ry="8" fill={W} opacity=".25" />
          <circle cx="60" cy="74" r="20" fill="#7a4a2b" />
          <ellipse cx="60" cy="74" rx="28" ry="7" fill="none" stroke="#ffd98a" strokeWidth="3" opacity=".85" transform="rotate(-14 60 74)" />
          <path d="M60 66 q-8 -14 6 -20" stroke="#3f7d57" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <circle cx="65" cy="46" r="6" fill="#e0553f" />
          <path d="M62 44 q4 -5 8 -1 M60 48 q-5 -2 -7 3" stroke="#e0553f" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'swan':
      return (
        <g>
          {[[28, 34], [96, 30]].map(([x, y], i) => (
            <path key={i} fill={W} opacity=".9" transform={`translate(${x} ${y})`}
              d="M0,-4 L1,-1 L4,0 L1,1 L0,4 L-1,1 L-4,0 L-1,-1 Z" />
          ))}
          <g fill={W} opacity=".4">
            <rect x="84" y="52" width="8" height="22" />
            <path d="M80 52 L88 42 L96 52 Z" />
            <rect x="96" y="60" width="6" height="14" />
            <path d="M93 60 L99 52 L105 60 Z" />
          </g>
          <g>
            <ellipse cx="56" cy="80" rx="22" ry="11" fill={W} />
            <path d="M42 76 C36 56 50 46 58 52 C52 58 55 68 62 72" stroke={W} strokeWidth="6" fill="none" strokeLinecap="round" />
            <circle cx="59" cy="52" r="4" fill={W} />
            <path d="M46 78 q12 -10 24 0 q-12 6 -24 0 Z" fill="#f3d9e6" opacity=".8" />
          </g>
          <g fill="none" stroke={W} strokeWidth="2.4" strokeLinecap="round" opacity=".75">
            <path d="M20 98 q9 -6 18 0 t18 0" />
            <path d="M64 102 q9 -6 18 0 t18 0" />
          </g>
        </g>
      );
  }
}

export default function BookCover({
  subject,
  className = '',
  showTitle = true,
}: {
  subject: CoverSubject;
  className?: string;
  showTitle?: boolean;
}) {
  const id = subject.id || subject.productId || '';
  const title = subject.title || subject.name || '';
  const mapped = COVER_MAP[id];
  const themeKey: ThemeKey =
    mapped?.theme || THEME_KEYS[hashSeed(id || title || subject.category || 'book') % THEME_KEYS.length];
  const theme = THEMES[themeKey];
  const short = mapped?.short || deriveShort(title);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: theme.bg, color: theme.ink, containerType: 'inline-size' }}
    >
      {/* 顶部光晕 */}
      <div
        className="absolute -top-10 -right-8 w-3/4 h-1/3 rounded-full blur-3xl pointer-events-none"
        style={{ background: theme.glow }}
      />
      {/* 书脊高光 */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[7%] pointer-events-none"
        style={{ background: theme.light ? 'rgba(74,47,24,.10)' : 'rgba(255,255,255,.16)' }}
      />

      {/* 插画 motif */}
      <svg
        viewBox="0 0 120 120"
        className="absolute left-1/2 -translate-x-1/2 w-[78%] top-[15%] pointer-events-none"
        style={{ color: theme.accent, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.18))' }}
        aria-hidden
      >
        <Motif k={themeKey} />
      </svg>

      {/* 底部文字承托 */}
      {!theme.light && showTitle && (
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/45 via-black/15 to-transparent pointer-events-none" />
      )}

      {/* 内框 */}
      <div
        className="absolute inset-[7%] rounded-[10px] border pointer-events-none"
        style={{ borderColor: theme.light ? 'rgba(74,47,24,.18)' : 'rgba(255,255,255,.28)' }}
      />

      {showTitle && (
        <div className="absolute inset-x-0 bottom-0 p-[10%] pt-0 z-10">
          <p
            className="text-[7px] font-black tracking-[0.28em] mb-1.5 opacity-90"
            style={{ color: theme.accent }}
          >
            寰宇思贤 · 绘本
          </p>
          <h4
            className="font-serif font-black leading-tight"
            style={{
              fontSize: 'clamp(13px, 4.6cqw, 20px)',
              textShadow: theme.light ? 'none' : '0 1px 8px rgba(0,0,0,.25)',
            }}
          >
            {short}
          </h4>
          <div
            className="mt-2 h-px w-8"
            style={{ background: theme.light ? 'rgba(74,47,24,.3)' : 'rgba(255,255,255,.5)' }}
          />
          <p className="mt-1.5 text-[6px] font-bold tracking-[0.22em] opacity-75">{theme.en}</p>
        </div>
      )}
    </div>
  );
}
