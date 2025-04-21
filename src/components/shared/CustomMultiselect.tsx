// CustomMultiSelect.tsx
import React, { useState, useRef, useEffect } from "react";

type Option = { label: string; value: string };

interface CustomMultiSelectProps {
  options: Option[];
  selected: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select options",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleOption = (option: Option) => {
    const exists = selected.find((s) => s.value === option.value);
    if (exists) {
      onChange(selected.filter((s) => s.value !== option.value));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-md min-w-[200px] text-sm">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border border-gray-400 rounded px-1.5 py-0.5 flex flex-wrap items-center gap-1 h-7 cursor-pointer"
      >
        {selected.length > 0 ? (
          selected.map((opt) => (
            <div
              key={opt.value}
              className="bg-gray-100 text-[13px] font-bold text-gray-700 px-1.5 py-0.5 rounded flex items-center"
            >
              {opt.label}
              <button
                className="ml-1 text-gray-500 hover:text-red-600 text-md"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(opt);
                }}
              >
                &times;
              </button>
            </div>
          ))
        ) : (
          <span className="text-gray-400 text-[13px] py-0">{placeholder}</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto rounded-lg shadow-md z-10">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => toggleOption(opt)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                selected.find((s) => s.value === opt.value)
                  ? "bg-gray-100 font-medium"
                  : ""
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomMultiSelect;
