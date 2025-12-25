// FilterBar component - Modern chip-style filter panel
// 筛选栏组件 - 现代标签式筛选面板

import { getFilterCategories } from "../data/filters";
import { useI18n } from "../lib/i18n-context";
import type { SearchFilters } from "../lib/types";

interface FilterBarProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const { locale } = useI18n();
  const filterCategories = getFilterCategories(locale);

  return (
    <div className="mb-8 md:mb-12 space-y-4 md:space-y-6">
      {filterCategories.map((category) => (
        <div key={category.key} className="flex flex-wrap items-center gap-2 md:gap-4">
          {/* Category label */}
          <span className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest min-w-[50px] md:min-w-[60px]">
            {category.label}
          </span>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {category.options.map((option) => {
              const isActive = filters[category.key] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onFilterChange(category.key, option.value)}
                  className={`chip py-1 md:py-1.5 px-3 md:px-4 rounded-full border text-xs md:text-sm transition-all
                    ${isActive
                      ? "active"
                      : "border-white/10 hover:border-white/20 text-gray-300"
                    }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
