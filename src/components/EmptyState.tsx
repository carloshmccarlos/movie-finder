// EmptyState component - Shown when no results or initial state
// 空状态组件 - 无结果或初始状态时显示

import { Film } from "lucide-react";

interface EmptyStateProps {
  type: "initial" | "no-results" | "error";
  message?: string;
  onExampleClick?: (example: string) => void;
}

// Example search queries to help users
const exampleQueries = [
  "一个男人失去记忆，用纹身记录线索追查真相",
  "机器人和小男孩的感人故事，未来世界",
  "韩国电影，穷人一家住进富人家地下室",
  "时间循环，女主角不断重复同一天",
  "太空探索，父亲穿越虫洞寻找新家园",
];

export function EmptyState({ type, message, onExampleClick }: EmptyStateProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-16 flex flex-col items-center justify-center text-center px-4">
      {/* Icon */}
      <Film size={64} className="text-[#333333] mb-4" />

      {/* Message based on type */}
      {type === "initial" && (
        <>
          <p className="text-[#a0a0a0] text-lg mb-2">输入电影描述开始搜索</p>
          <p className="text-[#666666] text-sm mb-6">
            描述剧情、演员、场景或任何你记得的细节
          </p>
        </>
      )}

      {type === "no-results" && (
        <>
          <p className="text-[#a0a0a0] text-lg mb-2">没有找到匹配的电影</p>
          <p className="text-[#666666] text-sm mb-6">
            试试其他描述或调整筛选条件
          </p>
        </>
      )}

      {type === "error" && (
        <>
          <p className="text-red-400 text-lg mb-2">搜索出错了</p>
          <p className="text-[#666666] text-sm mb-6">
            {message || "请稍后重试"}
          </p>
        </>
      )}

      {/* Example queries - only show for initial and no-results */}
      {type !== "error" && onExampleClick && (
        <div className="w-full">
          <p className="text-[#666666] text-sm mb-3">试试这些描述：</p>
          <div className="flex flex-col gap-2">
            {exampleQueries.map((example) => (
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
