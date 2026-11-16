import { useState } from "react";

const NEW = "__new__";

type Props = {
  value: string;
  options: string[];
  label: (concept: string) => string;
  onChange: (concept: string) => void;
  /** called when the teacher types a concept that is not in the list yet */
  onCreate?: (concept: string) => void;
  ariaLabel?: string;
};

/** Course-concept select with an "Other…" option that lets the teacher type a new concept. */
export function ConceptPicker({ value, options, label, onChange, onCreate, ariaLabel }: Props) {
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");

  function commit() {
    const name = draft.trim().replace(/\s+/g, " ");
    if (name.length < 2) return;
    const existing = options.find((option) => option.toLowerCase() === name.toLowerCase());
    if (!existing) onCreate?.(name);
    onChange(existing ?? name);
    setDraft("");
    setTyping(false);
  }

  if (typing) {
    return (
      <span className="concept-picker">
        <input
          autoFocus
          className="text-input"
          placeholder="New concept, e.g. Confidence intervals"
          value={draft}
          aria-label={ariaLabel ? `${ariaLabel}: new concept` : "New concept"}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") commit();
            if (event.key === "Escape") setTyping(false);
          }}
        />
        <button className="btn primary small" disabled={draft.trim().length < 2} onClick={commit}>
          Add
        </button>
        <button className="btn text small" onClick={() => setTyping(false)}>
          Cancel
        </button>
      </span>
    );
  }

  return (
    <select
      value={value}
      aria-label={ariaLabel}
      onChange={(event) => {
        if (event.target.value === NEW) {
          if (onCreate) setTyping(true);
        } else onChange(event.target.value);
      }}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {label(option)}
        </option>
      ))}
      {onCreate && <option value={NEW}>Other… type a new concept</option>}
    </select>
  );
}
