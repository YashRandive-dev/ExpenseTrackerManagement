import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { AnimatePresence, motion } from "framer-motion";

/** Button showing the chosen icon; expands an inline emoji picker (inline so modals never clip it). */
const EmojiPickerPopup = ({ icon, onSelect, fallback = "🙂" }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 rounded-xl border border-glass-border bg-glass px-3 py-2 text-left transition hover:bg-glass-strong"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-2xl">
          {icon || fallback}
        </span>
        <span className="text-sm text-muted">{icon ? "Change icon" : "Pick an icon"}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 overflow-hidden"
          >
            <EmojiPicker
              theme="dark"
              width="100%"
              height={320}
              lazyLoadEmojis
              onEmojiClick={(e) => {
                onSelect(e.emoji);
                setOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmojiPickerPopup;
