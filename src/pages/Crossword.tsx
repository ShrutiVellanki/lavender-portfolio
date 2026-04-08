import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sun, Moon } from "lucide-react";

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
  Grid layout (6 × 7):

       0  1  2  3  4  5  6
   0: [1]M  U  S  T  A [2]F  A       ← 1-Across: MUSTAFA
   1:  A  ·  · [3]L  ·  U  ·       ← 1-Down: MAN, 3-Down: LOVE
   2:  N  · [4]L  O  ·  N  ·       ← 4-Down: LOVE
   3:  ·  ·  O  V  ·  N  ·
   4: [5]L  O  V  E  ·  Y  ·       ← 5-Across: LOVE
   5:  ·  ·  E  ·  ·  ·  ·

  Intersections:
    (0,0) M — shared by 1-Across & 1-Down
    (0,5) F — shared by 1-Across & 2-Down
    (4,2) V — shared by 5-Across & 4-Down
    (4,3) E — shared by 5-Across & 3-Down
*/

const WORDS: PuzzleWord[] = [
  { id: "1A", number: 1, direction: "across", answer: "MUSTAFA", clue: "The chosen one — or the funniest guy in the room", startRow: 0, startCol: 0 },
  { id: "5A", number: 5, direction: "across", answer: "LOVE",    clue: "All you need, per the Beatles", startRow: 4, startCol: 0 },
  { id: "1D", number: 1, direction: "down",   answer: "MAN",     clue: "Spider-___", startRow: 0, startCol: 0 },
  { id: "2D", number: 2, direction: "down",   answer: "FUNNY",   clue: "The kind of bone that makes you laugh", startRow: 0, startCol: 5 },
  { id: "3D", number: 3, direction: "down",   answer: "LOVE",    clue: "Zero, in tennis", startRow: 1, startCol: 3 },
  { id: "4D", number: 4, direction: "down",   answer: "LOVE",    clue: "Rhymes with dove", startRow: 2, startCol: 2 },
];

const ROWS = 6;
const COLS = 7;

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
        const next = { ...input, [sel]: e.key.toUpperCase() };
        setInput(next);
        if (isSolved(next)) {
          setSolved(true);
          setSel(null);
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
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-lavender-500 hover:text-iris dark:hover:text-iris-light transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Portfolio
          </Link>
          <button
            onClick={() => setDark((d) => !d)}
            className="p-2 rounded-lg text-lavender-400 hover:text-lavender-700 dark:hover:text-lavender-100 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="sec-num text-lavender-400 dark:text-lavender-600 block mb-2">
              Puzzle
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-lavender-700 dark:text-lavender-100">
              Crossword
            </h1>
            <p className="mt-3 text-sm text-lavender-500 dark:text-lavender-500">
              Solve every clue to reveal a secret message
            </p>
          </div>

          {/* Active clue banner */}
          {activeWord && !solved && (
            <div className="max-w-xl mx-auto mb-6 px-4 py-3 rounded-xl bg-iris/8 dark:bg-iris-light/8 border border-iris/20 dark:border-iris-light/15 text-sm">
              <span className="font-bold text-iris dark:text-iris-light mr-2">
                {activeWord.number}
                {activeWord.direction === "across" ? "-Across" : "-Down"}
              </span>
              <span className="text-lavender-600 dark:text-lavender-400">
                {activeWord.clue}
              </span>
            </div>
          )}

          {/* Grid + Clues */}
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            {/* Grid */}
            <div
              ref={gridRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              className="outline-none rounded-xl focus-visible:ring-2 focus-visible:ring-iris/40 dark:focus-visible:ring-iris-light/30"
            >
              <div
                className="inline-grid gap-[2px] bg-lavender-600 dark:bg-lavender-400/25 rounded-xl overflow-hidden p-[2px]"
                style={{
                  gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))`,
                  width: `min(100%, ${COLS * 50 + (COLS + 1) * 2}px)`,
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
                        className="aspect-square bg-lavender-600 dark:bg-lavender-700/80"
                      />
                    );
                  }

                  const isSel = sel === k;
                  const isInWord = activeCellSet.has(k);
                  const letter = input[k] || "";

                  return (
                    <div
                      key={k}
                      onClick={() => handleCellClick(k)}
                      className={[
                        "aspect-square relative flex items-center justify-center cursor-pointer select-none transition-colors duration-100",
                        isSel
                          ? "bg-iris/25 dark:bg-iris-light/25"
                          : isInWord
                            ? "bg-iris/8 dark:bg-iris-light/8"
                            : "bg-white dark:bg-lavender-900",
                      ].join(" ")}
                    >
                      {cell.number != null && (
                        <span className="absolute top-[2px] left-[3px] text-[9px] sm:text-[10px] font-bold leading-none text-lavender-400 dark:text-lavender-500 pointer-events-none">
                          {cell.number}
                        </span>
                      )}
                      <span
                        className={`text-base sm:text-lg font-bold pointer-events-none ${
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

              <p className="mt-3 text-center text-[11px] text-lavender-400 dark:text-lavender-600">
                Click a cell to start · click again to switch direction
              </p>
            </div>

            {/* Clues */}
            <div className="w-full lg:w-64 space-y-6">
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
                              ? "bg-iris/10 dark:bg-iris-light/10 text-lavender-700 dark:text-lavender-200"
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
            <p className="text-lavender-400 dark:text-lavender-500 text-base sm:text-lg mb-6 tracking-wide font-medium">
              You solved it!
            </p>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.1] text-white">
              funny man
              <br />
              mustafa
            </h2>
            <p className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.02em] text-love dark:text-love-light">
              love love love
            </p>
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-3">
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
              <Link
                to="/"
                className="px-6 py-2.5 rounded-full text-sm font-semibold bg-iris text-white hover:bg-iris/80 transition-colors"
              >
                Back to Portfolio
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
