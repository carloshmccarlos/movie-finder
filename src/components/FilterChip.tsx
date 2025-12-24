// FilterChip component - Individual filter option button
// 筛选标签组件 - 单个筛选选项按钮

interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function FilterChip({ label, selected, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-full text-sm transition-all duration-150
        ${
          selected
            ? "bg-[#ff6b35] text-white border-[#ff6b35]"
            : "bg-transparent text-[#a0a0a0] border-[#333333] hover:border-[#ff6b35] hover:text-white"
        }
        border cursor-pointer
      `}
    >
      {label}
    </button>
  );
}
