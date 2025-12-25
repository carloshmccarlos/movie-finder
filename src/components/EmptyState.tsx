// EmptyState component - Shown when no results or initial state
// 空状态组件 - 无结果或初始状态时显示 (SSR-compatible)

import { Film } from "lucide-react";
import { useI18n } from "../lib/i18n-context";

interface EmptyStateProps {
  type: "initial" | "no-results" | "error";
  message?: string;
  onExampleClick?: (example: string) => void;
  examples?: string[];
}

export function EmptyState({ type, message, onExampleClick, examples }: EmptyStateProps) {
  const { t, examples: defaultExamples } = useI18n();
  const exampleList = examples || defaultExamples;

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 flex flex-col items-center justify-center text-center px-4">
      {/* Icon */}
      <Film size={64} className="text-[#333333] mb-4" />

      {/* Message based on type */}
      {type === "initial" && (
        <>
          <p className="text-[#a0a0a0] text-lg mb-2">{t("results.initial")}</p>
          <p className="text-[#666666] text-sm mb-6">{t("results.initialHint")}</p>
        </>
      )}

      {type === "no-results" && (
        <>
          <p className="text-[#a0a0a0] text-lg mb-2">{t("results.empty")}</p>
          <p className="text-[#666666] text-sm mb-6">{t("results.emptyHint")}</p>
        </>
      )}

      {type === "error" && (
        <>
          <p className="text-red-400 text-lg mb-2">{t("results.error")}</p>
          <p className="text-[#666666] text-sm mb-6">{message || ""}</p>
        </>
      )}

      {/* Example queries */}
      {type !== "error" && onExampleClick && (
        <div className="w-full">
          <p className="text-[#666666] text-sm mb-3">{t("results.tryThese")}</p>
          <div className="flex flex-col gap-2">
            {exampleList.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => onExampleClick(example)}
                className="px-4 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg
                           text-[#a0a0a0] text-sm text-left
                           hover:border-[#ff6b35] hover:text-white transition-colors"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
