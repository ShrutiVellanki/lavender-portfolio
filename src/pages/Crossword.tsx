import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Sun, Moon } from "lucide-react";

/* ─── Puzzle definition ─── */

type Direction = "across" | "down";

interface PuzzleWord {
  id: string;
  number: number;
  direction: Direction;
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
}

/*
  Grid layout (8 × 13):

       0  1  2  3  4  5  6  7  8  9  10 11 12
   0:  ·  ·  ·  ·  ·  · [1]A  M  A  Z  E  ·  ·  ← 1-Across: AMAZE & 1-Down: AMAZE
   1:  ·  ·  ·  ·  ·  ·  M  ·  ·  ·  ·  ·  ·
   2: [2]M  U  U  U  S  T  A  A  A [3]F  A  A  A  ← 2-Across: MUUUSTAAAFAAA, 2-Down: MAN, 3-Down: FUNNY
   3:  A  ·  ·  ·  ·  ·  Z  ·  ·  U  ·  ·  ·
   4:  N  ·  · [4]L  O  V  E  ·  ·  N  ·  ·  ·  ← 4-Across: LOVE & 4-Down: LOVE
   5:  ·  ·  ·  O  ·  ·  ·  ·  ·  N  ·  ·  ·
   6:  ·  ·  ·  V  ·  ·  ·  ·  ·  Y  ·  ·  ·
   7:  ·  ·  ·  E  ·  ·  ·  ·  ·  ·  ·  ·  ·

  Intersections:
    (0,6) A — AMAZE #1 down ∩ AMAZE #2 across
    (2,0) M — MUUUSTAAAFAAA across ∩ MAN down
    (2,6) A — MUUUSTAAAFAAA across ∩ AMAZE #1 down
    (2,9) F — MUUUSTAAAFAAA across ∩ FUNNY down
    (4,3) L — LOVE #1 across ∩ LOVE #2 down
    (4,6) E — LOVE #1 across ∩ AMAZE #1 down
*/

const WORDS: PuzzleWord[] = [
  { id: "1A", number: 1, direction: "across", answer: "AMAZE",         clue: "What a great magic trick does to its audience", startRow: 0, startCol: 6 },
  { id: "2A", number: 2, direction: "across", answer: "MUUUSTAAAFAAA", clue: "We meet again…", startRow: 2, startCol: 0 },
  { id: "4A", number: 4, direction: "across", answer: "LOVE",          clue: "All you need, per the Beatles", startRow: 4, startCol: 3 },
  { id: "1D", number: 1, direction: "down",   answer: "AMAZE",         clue: "To fill with wonder or astonishment", startRow: 0, startCol: 6 },
  { id: "2D", number: 2, direction: "down",   answer: "MAN",           clue: "Spider-___", startRow: 2, startCol: 0 },
  { id: "3D", number: 3, direction: "down",   answer: "FUNNY",         clue: "The kind of bone that makes you laugh", startRow: 2, startCol: 9 },
  { id: "4D", number: 4, direction: "down",   answer: "LOVE",          clue: "Rhymes with dove and above", startRow: 4, startCol: 3 },
];

const ROWS = 8;
const COLS = 13;

/* ─── Grid builder ─── */

interface CellMeta {
  letter: string;
  number?: number;
  acrossId?: string;
  downId?: string;
}

function buildCellMap() {
  const map = new Map<string, CellMeta>();

  for (const w of WORDS) {
    for (let i = 0; i < w.answer.length; i++) {
      const r = w.direction === "across" ? w.startRow : w.startRow + i;
      const c = w.direction === "across" ? w.startCol + i : w.startCol;
      const k = `${r},${c}`;

      if (!map.has(k)) map.set(k, { letter: w.answer[i] });
      const cell = map.get(k)!;
      if (i === 0 && cell.number === undefined) cell.number = w.number;
      if (w.direction === "across") cell.acrossId = w.id;
      else cell.downId = w.id;
    }
  }
  return map;
}

const CELL_MAP = buildCellMap();

function wordCellKeys(w: PuzzleWord): string[] {
  return Array.from({ length: w.answer.length }, (_, i) => {
    const r = w.direction === "across" ? w.startRow : w.startRow + i;
    const c = w.direction === "across" ? w.startCol + i : w.startCol;
    return `${r},${c}`;
  });
}

/* ─── Component ─── */

export default function Crossword() {
  /* Theme (mirrors portfolio hook) */
  const [dark, setDark] = useState(() => {
    const s = localStorage.getItem("portfolio-theme");
    return s ? s === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
  }, [dark]);

  /* Game state */
  const [input, setInput] = useState<Record<string, string>>({});
  const [sel, setSel] = useState<string | null>(null);
  const [dir, setDir] = useState<Direction>("across");
  const [solved, setSolved] = useState(false);
  const [taunt, setTaunt] = useState<{ key: string; id: number } | null>(null);
  const tauntTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [cheer, setCheer] = useState<number | null>(null);
  const cheerTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const gridRef = useRef<HTMLDivElement>(null);

  /* Derived: active word & its cells */
  const activeWord = useMemo(() => {
    if (!sel) return null;
    const c = CELL_MAP.get(sel);
    if (!c) return null;
    const primary = dir === "across" ? c.acrossId : c.downId;
    if (primary) return WORDS.find((w) => w.id === primary) ?? null;
    const fallback = dir === "across" ? c.downId : c.acrossId;
    return fallback ? WORDS.find((w) => w.id === fallback) ?? null : null;
  }, [sel, dir]);

  const activeCellSet = useMemo(
    () => (activeWord ? new Set(wordCellKeys(activeWord)) : new Set<string>()),
    [activeWord],
  );

  /* Hearts for victory (memoised so they don't flicker) */
  const hearts = useMemo(
    () =>
      Array.from({ length: 28 }, () => ({
        left: 5 + Math.random() * 90,
        size: 18 + Math.random() * 28,
        dur: 4 + Math.random() * 5,
        delay: Math.random() * 4,
      })),
    [],
  );

  /* Ambient falling hearts */
  const fallingHearts = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        left: Math.random() * 100,
        size: 10 + Math.random() * 16,
        dur: 6 + Math.random() * 8,
        delay: Math.random() * 10,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    [],
  );

  /* Helpers */
  const isSolved = useCallback((inp: Record<string, string>) => {
    for (const [k, c] of CELL_MAP) {
      if (inp[k] !== c.letter) return false;
    }
    return true;
  }, []);

  const adjacent = useCallback(
    (key: string, d: Direction, forward: boolean): string | null => {
      const c = CELL_MAP.get(key);
      if (!c) return null;
      const wid = d === "across" ? c.acrossId : c.downId;
      if (!wid) return null;
      const w = WORDS.find((x) => x.id === wid);
      if (!w) return null;
      const cells = wordCellKeys(w);
      const i = cells.indexOf(key);
      return cells[forward ? i + 1 : i - 1] ?? null;
    },
    [],
  );

  /* Interactions */
  const focusGrid = () => gridRef.current?.focus();

  const handleCellClick = useCallback(
    (k: string) => {
      if (solved || !CELL_MAP.has(k)) return;
      if (sel === k) {
        const c = CELL_MAP.get(k)!;
        const newDir: Direction = dir === "across" ? "down" : "across";
        if (newDir === "across" ? c.acrossId : c.downId) setDir(newDir);
      } else {
        const c = CELL_MAP.get(k)!;
        if (!(dir === "across" ? c.acrossId : c.downId))
          setDir((d) => (d === "across" ? "down" : "across"));
        setSel(k);
      }
      focusGrid();
    },
    [sel, dir, solved],
  );

  const handleClue = useCallback(
    (w: PuzzleWord) => {
      if (solved) return;
      setDir(w.direction);
      setSel(wordCellKeys(w)[0]);
      focusGrid();
    },
    [solved],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (solved || !sel) return;

      /* Tab — cycle words */
      if (e.key === "Tab") {
        e.preventDefault();
        const list = WORDS.filter((w) => w.direction === dir);
        const c = CELL_MAP.get(sel);
        const cid = c ? (dir === "across" ? c.acrossId : c.downId) : null;
        const ci = list.findIndex((w) => w.id === cid);
        const ni = e.shiftKey
          ? (ci - 1 + list.length) % list.length
          : (ci + 1) % list.length;
        setSel(wordCellKeys(list[ni])[0]);
        return;
      }

      /* Arrows */
      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        const [r, c] = sel.split(",").map(Number);
        let nr = r,
          nc = c;
        if (e.key === "ArrowRight") nc++;
        if (e.key === "ArrowLeft") nc--;
        if (e.key === "ArrowDown") nr++;
        if (e.key === "ArrowUp") nr--;
        const nk = `${nr},${nc}`;
        if (CELL_MAP.has(nk)) {
          setSel(nk);
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") setDir("across");
          else setDir("down");
        }
        return;
      }

      /* Backspace */
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        const next = { ...input };
        if (input[sel]) {
          delete next[sel];
        } else {
          const p = adjacent(sel, dir, false);
          if (p) {
            delete next[p];
            setSel(p);
          }
        }
        setInput(next);
        return;
      }

      /* Letter entry */
      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        const typed = e.key.toUpperCase();
        const next = { ...input, [sel]: typed };
        setInput(next);

        const correct = CELL_MAP.get(sel)?.letter;
        if (correct && typed !== correct) {
          clearTimeout(tauntTimer.current);
          clearTimeout(cheerTimer.current);
          setCheer(null);
          setTaunt({ key: sel, id: Date.now() });
          tauntTimer.current = setTimeout(() => setTaunt(null), 1600);
        } else if (correct && typed === correct) {
          clearTimeout(cheerTimer.current);
          clearTimeout(tauntTimer.current);
          setTaunt(null);
          setCheer(Date.now());
          cheerTimer.current = setTimeout(() => setCheer(null), 1200);
        }

        if (isSolved(next)) {
          setSolved(true);
          setSel(null);
          setTaunt(null);
          setCheer(null);
        } else {
          const n = adjacent(sel, dir, true);
          if (n) setSel(n);
        }
      }
    },
    [sel, dir, input, solved, adjacent, isSolved],
  );

  const across = WORDS.filter((w) => w.direction === "across");
  const down = WORDS.filter((w) => w.direction === "down");

  /* ─── Render ─── */

  return (
    <div className="geo-bg min-h-screen bg-lavender-50 text-lavender-700 dark:bg-lavender-900 dark:text-lavender-300 transition-colors duration-500">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-lg bg-lavender-50/70 dark:bg-lavender-900/70 border-b border-lavender-300/30 dark:border-lavender-700/10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div />
          <button
            onClick={() => setDark((d) => !d)}
            className="p-2 rounded-lg text-lavender-400 hover:text-lavender-700 dark:hover:text-lavender-100 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Ambient falling hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
        {fallingHearts.map((h, i) => (
          <span
            key={i}
            className="absolute cw-fall text-pink-400 dark:text-pink-300"
            style={{
              left: `${h.left}%`,
              top: 0,
              fontSize: h.size,
              opacity: h.opacity,
              ["--fall-dur" as string]: `${h.dur}s`,
              ["--fall-delay" as string]: `${h.delay}s`,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      <main className="relative z-10 pt-16 sm:pt-24 pb-12 sm:pb-20 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="sec-num text-lavender-400 dark:text-lavender-600 block mb-2">
              Puzzle
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-lavender-700 dark:text-lavender-100">
              <span className="line-through opacity-50 mr-1">Monday</span> Love Crossword <span className="text-pink-400 dark:text-pink-300">♥</span>
            </h1>
            <p className="mt-3 text-sm text-lavender-500 dark:text-lavender-500">
              Solve every clue to reveal a{" "}
              <span className="relative group inline-block">
                <span className="text-pink-500 dark:text-pink-400 font-semibold bg-pink-100/60 dark:bg-pink-500/15 px-1.5 py-0.5 rounded-md cursor-default">
                  flirty message
                </span>
                <span className="pointer-events-none absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-lavender-800 dark:bg-lavender-200 text-white dark:text-lavender-900 text-xs px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  from shootz
                </span>
              </span>
            </p>
          </div>

          {/* Active clue banner */}
          {activeWord && !solved && (
            <div className="max-w-xl mx-auto mb-4 sm:mb-6 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-pink-100/60 dark:bg-pink-500/10 border border-pink-300/40 dark:border-pink-400/20 text-xs sm:text-sm">
              <span className="font-bold text-pink-500 dark:text-pink-400 mr-2">
                {activeWord.number}
                {activeWord.direction === "across" ? "-Across" : "-Down"}
              </span>
              <span className="text-lavender-600 dark:text-lavender-400">
                {activeWord.clue}
              </span>
            </div>
          )}

          {/* Grid + Clues */}
          <div className="flex flex-col items-center gap-8">
            {/* Grid */}
            <div
              ref={gridRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              className="relative w-full outline-none rounded-xl focus-visible:ring-2 focus-visible:ring-iris/40 dark:focus-visible:ring-iris-light/30"
            >
              <div
                className="grid gap-[2px] bg-lavender-700 dark:bg-lavender-950 rounded-xl overflow-hidden p-[2px] mx-auto w-full"
                style={{
                  gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                  maxWidth: `${COLS * 80 + (COLS + 1) * 2}px`,
                }}
              >
                {Array.from({ length: ROWS * COLS }, (_, i) => {
                  const r = Math.floor(i / COLS);
                  const c = i % COLS;
                  const k = `${r},${c}`;
                  const cell = CELL_MAP.get(k);

                  if (!cell) {
                    return (
                      <div
                        key={k}
                        className="aspect-square bg-lavender-700 dark:bg-lavender-950"
                      />
                    );
                  }

                  const isSel = sel === k;
                  const isInWord = activeCellSet.has(k);
                  const letter = input[k] || "";
                  const isWrong = taunt?.key === k;

                  return (
                    <div
                      key={k}
                      onClick={() => handleCellClick(k)}
                      className={[
                        "aspect-square relative flex items-center justify-center cursor-pointer select-none transition-colors duration-100",
                        isWrong ? "cw-shake" : "",
                        isSel
                          ? "bg-gold/30 dark:bg-gold-light/25 ring-2 ring-inset ring-gold/60 dark:ring-gold-light/50"
                          : isInWord
                            ? "bg-pink-200/60 dark:bg-pink-300/25 ring-1 ring-inset ring-pink-400/50 dark:ring-pink-300/40"
                            : "bg-white dark:bg-lavender-900",
                      ].join(" ")}
                    >
                      {cell.number != null && (
                        <span className="absolute top-[2px] left-[2px] sm:top-[4px] sm:left-[5px] text-[8px] sm:text-xs md:text-sm font-bold leading-none text-lavender-400 dark:text-lavender-500 pointer-events-none">
                          {cell.number}
                        </span>
                      )}
                      <span
                        className={`text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold pointer-events-none ${
                          solved
                            ? "text-iris dark:text-iris-light"
                            : "text-lavender-700 dark:text-lavender-100"
                        }`}
                      >
                        {letter}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Taunt overlay on grid */}
              {taunt && (
                <div key={taunt.id} className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none cw-taunt-in">
                  <div className="w-[65%] max-h-[75%] flex flex-col items-center justify-center bg-white/90 dark:bg-lavender-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                    <img
                      src="/taunt.png"
                      alt=""
                      className="w-3/5 max-w-56 aspect-square object-contain rounded-2xl"
                    />
                    <span className="mt-4 text-xl sm:text-2xl font-bold text-love dark:text-love-light tracking-wide">
                      nope!
                    </span>
                  </div>
                </div>
              )}

              {/* Cheer overlay on grid (correct letter) */}
              {cheer && !solved && (
                <div key={cheer} className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none cw-taunt-in">
                  <div className="w-[65%] max-h-[75%] flex flex-col items-center justify-center bg-white/90 dark:bg-lavender-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                    <img
                      src="/victory.png"
                      alt=""
                      className="w-3/5 max-w-56 aspect-square object-contain rounded-2xl"
                    />
                    <span className="mt-4 text-xl sm:text-2xl font-bold text-pink-500 dark:text-pink-400 tracking-wide">
                      yes!
                    </span>
                  </div>
                </div>
              )}

              <p className="mt-3 text-center text-[11px] text-lavender-400 dark:text-lavender-600">
                Click a cell to start · click again to switch direction
              </p>
            </div>

            {/* Clues */}
            <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "Across", words: across },
                { label: "Down", words: down },
              ].map(({ label, words: list }) => (
                <div key={label}>
                  <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-iris dark:text-iris-light mb-3">
                    {label}
                  </h3>
                  <ul className="space-y-1">
                    {list.map((w) => {
                      const isActive = activeWord?.id === w.id;
                      return (
                        <li
                          key={w.id}
                          onClick={() => handleClue(w)}
                          className={[
                            "text-sm cursor-pointer px-3 py-2 rounded-lg transition-colors",
                            isActive
                              ? "bg-pink-100/60 dark:bg-pink-500/10 text-pink-600 dark:text-pink-300"
                              : "text-lavender-600 dark:text-lavender-400 hover:bg-lavender-100 dark:hover:bg-lavender-800/40",
                          ].join(" ")}
                        >
                          <strong className="text-lavender-700 dark:text-lavender-200 mr-1">
                            {w.number}.
                          </strong>
                          {w.clue}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ── Victory overlay ── */}
      {solved && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-lavender-900/90 dark:bg-black/90 backdrop-blur-md cw-fade-in" />

          {hearts.map((h, i) => (
            <span
              key={i}
              className="absolute pointer-events-none text-love/50 dark:text-love-light/50 cw-heart"
              style={{
                left: `${h.left}%`,
                fontSize: `${h.size}px`,
                animationDuration: `${h.dur}s`,
                animationDelay: `${h.delay}s`,
              }}
            >
              ♥
            </span>
          ))}

          <div className="relative z-10 text-center px-6 cw-msg">
            <img
              src="/victory.png"
              alt=""
              className="mx-auto w-40 h-40 sm:w-52 sm:h-52 object-contain rounded-3xl mb-6"
            />
            <p className="text-lavender-400 dark:text-lavender-500 text-base sm:text-lg mb-6 tracking-wide font-medium">
              You solved it!
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[-0.02em] text-white/80 mb-2">
              funny man mustafa
            </p>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.1] text-love dark:text-love-light">
              love love
            </h2>
            <p className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.02em] text-white">
              amaze amaze
            </p>
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => {
                  setSolved(false);
                  setInput({});
                  setSel(null);
                }}
                className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
