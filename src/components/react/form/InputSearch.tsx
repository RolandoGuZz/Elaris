import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { debounce } from "../utils/debounce";

interface PropsInputSearch {
  options: string[];
  label?: string;
  placeholder?: string;
  onChange?: (selected: string[]) => void;
  debounceMs?: number;
  sanitize?: (value: string) => string;
  value?: string[];
}

export const InputSearch = ({
  options,
  label,
  placeholder = "Buscar...",
  onChange,
  debounceMs = 300,
  sanitize,
  value,
}: PropsInputSearch) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  //? metodo para busqueda
  const sanitizeValue = useCallback(
    (value: string) => (sanitize ? sanitize(value) : value),
    [sanitize],
  );

  const performSearch = useCallback(
    (term: string) => {
      const sanitizedTerm = sanitizeValue(term).trim();
      if (!sanitizedTerm) {
        setFilteredOptions([]);
        return;
      }

      const lowerTerm = sanitizedTerm.toLowerCase();
      const matches = options.filter((opt) => {
        const normalizedOption = sanitizeValue(opt).toLowerCase();
        return normalizedOption.includes(lowerTerm);
      });
      setFilteredOptions(matches);
    },
    [options, sanitizeValue],
  );
  //*Almacenas en memoria para el debounce
  const debouncedSearch = useMemo(
    () => debounce(performSearch, debounceMs),
    [performSearch, debounceMs],
  );

  //*Cada vez que se refresca se vuelve a ejcutar el metodo de busqueda
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    if (!value) {
      setSelectedOptions([]);
      return;
    }
    const sanitizedValues = value
      .map((item) => sanitizeValue(item).trim())
      .filter((item) => item.length > 0);
    const unique = Array.from(
      new Map(sanitizedValues.map((item) => [item.toLowerCase(), item] as const)).values(),
    );
    setSelectedOptions(unique);
  }, [value, sanitizeValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeValue(e.target.value);
    setSearchTerm(value);
    setIsOpen(true);
  };

  const addCustomOption = (rawValue: string) => {
    const sanitized = sanitizeValue(rawValue).trim();
    if (!sanitized) {
      return;
    }

    const alreadySelected = selectedOptions.some(
      (option) => sanitizeValue(option).toLowerCase() === sanitized.toLowerCase(),
    );
    const existsInOptions = options.some(
      (option) => sanitizeValue(option).toLowerCase() === sanitized.toLowerCase(),
    );
    if (alreadySelected || existsInOptions) {
      return;
    }

    const newSelected = [...selectedOptions, sanitized];
    setSelectedOptions(newSelected);
    setSearchTerm("");
    setFilteredOptions([]);
    setIsOpen(false);
    onChange?.(newSelected);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ",") {
      e.preventDefault();
      addCustomOption(searchTerm);
    }
  };

  const handleSelectOption = (option: string) => {
    const newSelected = selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option)
      : [...selectedOptions, option];

    setSelectedOptions(newSelected);
    setSearchTerm("");
    setFilteredOptions([]);
    setIsOpen(false);
    onChange?.(newSelected);
    inputRef.current?.focus();
  };

  const handleRemoveOption = (option: string) => {
    const newSelected = selectedOptions.filter((o) => o !== option);
    setSelectedOptions(newSelected);
    onChange?.(newSelected);
  };

  const showNoResults =
    isOpen && searchTerm.trim() && filteredOptions.length === 0;

  return (
    <div ref={containerRef} className="flex flex-col gap-2 w-[50%] relative">
      {label && (
        <label className="text-sm font-medium text-left text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedOptions.map((option) => (
            <span
              key={option}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium"
            >
              {option}
              <button
                type="button"
                onClick={() => handleRemoveOption(option)}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
      />

      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          {filteredOptions.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => handleSelectOption(option)}
                className="w-full px-4 py-2.5 text-left text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}

      {showNoResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg p-4 z-50">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            No se encontraron resultados
          </p>
        </div>
      )}
    </div>
  );
};
