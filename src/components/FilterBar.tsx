// FilterBar component - Tencent Video style filter panel
// 筛选栏组件 - 腾讯视频风格筛选面板

import { FilterChip } from "./FilterChip";
import { filterCategories } from "../data/filters";
import type { SearchFilters } from "../lib/types";

interface FilterBarProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#333333]">
      {/* Render each filter category */}
      {filterCategories.map((category) => (
        <div key={category.key} className="mb-4 last:mb-0">
          {/* Category label */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#a0a0a0] text-sm min-w-[50px]">
              {category.label}
            </span>
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap gap-2">
            {category.options.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                selected={filters[category.key] === option.value}
                onClick={() => onFilterChange(category.key, option.value)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
