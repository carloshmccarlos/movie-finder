// LoadingState component - AI thinking animation
// 加载状态组件 - AI思考动画

import { useI18n } from "../lib/i18n-context";

export function LoadingState() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Thinking dots animation */}
      <div className="flex gap-1 mb-4">
        <div className="thinking-dot" />
        <div className="thinking-dot" />
        <div className="thinking-dot" />
      </div>

      {/* Loading text */}
      <h3 className="text-xl font-light text-gray-400 italic">
        {t("results.loading")}
      </h3>
    </div>
  );
}
