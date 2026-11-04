import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiChevronDown, FiSearch } from "react-icons/fi";
import { CURRENCIES, getCurrencyName } from "../../utils/helper";

const labelOf = (code) => `${code} - ${getCurrencyName(code)}`;

/** Input-style currency picker: click or type to search by code or name, pick with mouse or keyboard. */
const CurrencySelect = ({ label, value, onChange, hint }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const options = useMemo(() => CURRENCIES.map((code) => ({ code, name: getCurrencyName(code) })), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.code.toLowerCase().includes(q) || o.name.toLowerCase().includes(q));
  }, [options, query]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const choose = (code) => {
    onChange(code);
    close();
    inputRef.current?.blur();
  };

  const openList = () => {
    if (open) return;
    setOpen(true);
    setQuery("");
    setActive(Math.max(0, options.findIndex((o) => o.code === value)));
  };

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // keep the highlighted row in view
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return openList();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (filtered.length ? (i + step + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && filtered[active]) choose(filtered[active].code);
    } else if (e.key === "Escape" || e.key === "Tab") {
      close();
    }
  };

  return (
    <div className="block" ref={rootRef}>
      {label && <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>}

      <div className="relative">
        <FiSearch size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="currency-listbox"
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          className="field pl-10 pr-10"
          placeholder="Search currency…"
          value={open ? query : labelOf(value)}
          onFocus={openList}
          onClick={openList}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            if (!open) setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Toggle currency list"
          onClick={() => (open ? close() : (inputRef.current?.focus(), openList()))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-ink"
        >
          <FiChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              ref={listRef}
              id="currency-listbox"
              role="listbox"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-glass-border bg-[rgba(22,24,52,0.98)] p-1.5 shadow-glow backdrop-blur-xl"
            >
              {filtered.length === 0 && <li className="px-3 py-3 text-center text-sm text-muted">No currency found</li>}
              {filtered.map((o, i) => (
                <li
                  key={o.code}
                  data-idx={i}
                  role="option"
                  aria-selected={o.code === value}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => {
                    e.preventDefault(); // keep input focus so blur/close doesn't race the click
                    choose(o.code);
                  }}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                    i === active ? "bg-primary-soft text-ink" : "text-muted"
                  }`}
                >
                  <span className="w-10 shrink-0 font-semibold text-ink">{o.code}</span>
                  <span className="flex-1 truncate">{o.name}</span>
                  {o.code === value && <FiCheck size={16} className="shrink-0 text-income" />}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </div>
  );
};

export default CurrencySelect;
