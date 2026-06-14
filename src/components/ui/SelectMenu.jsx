import { useEffect, useId, useRef, useState } from "react";
import AppIcon from "./AppIcon.jsx";

export default function SelectMenu({ id, value, options, onChange, placeholder = "Select..." }) {
  const generatedId = useId();
  const buttonId = id ?? generatedId;
  const menuId = `${buttonId}-menu`;
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function selectOption(option) {
    onChange(option.value);
    setOpen(false);
  }

  return (
    <div className="select-menu" ref={wrapperRef}>
      <button
        id={buttonId}
        type="button"
        className={`select-trigger ${open ? "open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selectedOption?.label ?? placeholder}</span>
        <AppIcon name="ChevronDown" size={18} />
      </button>

      {open && (
        <div id={menuId} className="select-popover" role="listbox" aria-labelledby={buttonId}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`select-option ${option.value === value ? "selected" : ""}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => selectOption(option)}
            >
              <span>{option.label}</span>
              {option.value === value && <AppIcon name="Check" size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
