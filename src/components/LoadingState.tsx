// LoadingState component - Shown while searching
// 加载状态组件 - 搜索时显示

import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-16 flex flex-col items-center justify-center">
      {/* Spinning loader */}
      <Loader2 size={48} className="text-[#ff6b35] animate-spin mb-4" />

      {/* Loading text */}
      <p className="text-[#a0a0a0] text-lg">正在搜索电影...</p>
      <p className="text-[#666666] text-sm mt-2">AI正在分析你的描述</p>
    </div>
  );
}
