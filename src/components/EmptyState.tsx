// EmptyState component - Shown when no results or initial state
// 空状态组件 - 无结果或初始状态时显示

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
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Icon */}
      <Film size={64} className="text-gray-700 mb-6" />

      {/* Message based on type */}
      {type === "initial" && (
        <>
          <p className="text-xl text-gray-400 mb-2 font-light">{t("results.initial")}</p>
          <p className="text-gray-600 text-sm mb-8">{t("results.initialHint")}</p>
        </>
      )}

      {type === "no-results" && (
        <>
          <p className="text-xl text-gray-400 mb-2 font-light">{t("results.empty")}</p>
          <p className="text-gray-600 text-sm mb-8">{t("results.emptyHint")}</p>
        </>
      )}

      {type === "error" && (
        <>
          <p className="text-xl text-red-400 mb-2">{t("results.error")}</p>
          <p className="text-gray-600 text-sm mb-8">{message || ""}</p>
        </>
      )}

      {/* Example queries */}
      {type !== "error" && onExampleClick && (
        <div className="w-full max-w-xl">
          <p className="text-gray-600 text-sm mb-4">{t("results.tryThese")}</p>
          <div className="flex flex-col gap-3">
            {exampleList.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => onExampleClick(example)}
                className="px-6 py-3 rounded-xl border border-white/10 bg-white/5
                           text-gray-300 text-sm text-left
                           hover:border-[#ff6b35]/40 hover:bg-[#ff6b35]/10 hover:text-white
                           transition-all duration-200"
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
