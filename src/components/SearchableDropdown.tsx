import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  icon?: string;
  subtitle?: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  required?: boolean;
  error?: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlighted index when search term changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm]);

  // Scroll to highlighted option
  useEffect(() => {
    if (highlightedIndex >= 0 && highlightedIndex < optionsRef.current.length) {
      optionsRef.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [highlightedIndex]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;

      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;

      case 'Home':
        e.preventDefault();
        setHighlightedIndex(0);
        break;

      case 'End':
        e.preventDefault();
        setHighlightedIndex(filteredOptions.length - 1);
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-gray-300 text-sm font-medium mb-2">
          {label} {required && <span className="text-pink-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full bg-gray-800 border ${
          error ? 'border-red-500' : 'border-gray-700'
        } rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-gray-600 focus:outline-none focus:border-pink-500 transition-colors`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label}
      >
        <span className="flex items-center gap-2 overflow-hidden">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="text-xl flex-shrink-0">{selectedOption.icon}</span>}
              <span className="truncate">{selectedOption.label}</span>
              {selectedOption.subtitle && (
                <span className="text-sm text-gray-400 truncate">({selectedOption.subtitle})</span>
              )}
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type to search..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                autoFocus
                aria-label="Search options"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-64" role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  ref={el => optionsRef.current[index] = el}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full px-4 py-3 text-left transition-colors flex items-center gap-3 ${
                    value === option.value
                      ? 'bg-gray-700 text-pink-400'
                      : highlightedIndex === index
                      ? 'bg-gray-700 text-white'
                      : 'text-white hover:bg-gray-700'
                  }`}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.icon && <span className="text-xl flex-shrink-0">{option.icon}</span>}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{option.label}</div>
                    {option.subtitle && (
                      <div className="text-sm text-gray-400 truncate">{option.subtitle}</div>
                    )}
                  </div>
                  {value === option.value && (
                    <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0"></div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-400">
                No results found for "{searchTerm}"
              </div>
            )}
          </div>

          {filteredOptions.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-700 text-xs text-gray-400 flex items-center justify-between">
              <span>Use ↑↓ to navigate</span>
              <span>Enter to select</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
