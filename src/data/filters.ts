// Filter options data - Tencent Video style categories
// 筛选条件数据 - 腾讯视频风格分类
// Supports both Chinese and English

import type { FilterCategory } from "../lib/types";
import type { Locale } from "../lib/i18n";

// Chinese filter categories
const zhFilterCategories: FilterCategory[] = [
  {
    key: "genre",
    label: "类型",
    type: "hard",
    options: [
      { value: "", label: "全部" },
      { value: "动作", label: "动作" },
      { value: "爱情", label: "爱情" },
      { value: "科幻", label: "科幻" },
      { value: "剧情", label: "剧情" },
      { value: "喜剧", label: "喜剧" },
      { value: "恐怖", label: "恐怖" },
      { value: "悬疑", label: "悬疑" },
      { value: "动画", label: "动画" },
      { value: "纪录片", label: "纪录片" },
    ],
  },
  {
    key: "region",
    label: "地区",
    type: "hard",
    options: [
      { value: "", label: "全部" },
      { value: "内地", label: "内地" },
      { value: "香港", label: "香港" },
      { value: "台湾", label: "台湾" },
      { value: "日本", label: "日本" },
      { value: "韩国", label: "韩国" },
      { value: "美国", label: "美国" },
      { value: "欧洲", label: "欧洲" },
      { value: "其他", label: "其他" },
    ],
  },
  {
    key: "era",
    label: "年代",
    type: "hard",
    options: [
      { value: "", label: "全部" },
      { value: "2020s", label: "2020年代" },
      { value: "2010s", label: "2010年代" },
      { value: "2000s", label: "2000年代" },
      { value: "1990s", label: "1990年代" },
      { value: "更早", label: "更早" },
    ],
  },
];

// English filter categories
const enFilterCategories: FilterCategory[] = [
  {
    key: "genre",
    label: "Genre",
    type: "hard",
    options: [
      { value: "", label: "All" },
      { value: "Action", label: "Action" },
      { value: "Romance", label: "Romance" },
      { value: "Sci-Fi", label: "Sci-Fi" },
      { value: "Drama", label: "Drama" },
      { value: "Comedy", label: "Comedy" },
      { value: "Horror", label: "Horror" },
      { value: "Mystery", label: "Mystery" },
      { value: "Animation", label: "Animation" },
      { value: "Documentary", label: "Documentary" },
    ],
  },
  {
    key: "region",
    label: "Region",
    type: "hard",
    options: [
      { value: "", label: "All" },
      { value: "China", label: "China" },
      { value: "Hong Kong", label: "Hong Kong" },
      { value: "Taiwan", label: "Taiwan" },
      { value: "Japan", label: "Japan" },
      { value: "Korea", label: "Korea" },
      { value: "USA", label: "USA" },
      { value: "Europe", label: "Europe" },
      { value: "Other", label: "Other" },
    ],
  },
  {
    key: "era",
    label: "Era",
    type: "hard",
    options: [
      { value: "", label: "All" },
      { value: "2020s", label: "2020s" },
      { value: "2010s", label: "2010s" },
      { value: "2000s", label: "2000s" },
      { value: "1990s", label: "1990s" },
      { value: "Earlier", label: "Earlier" },
    ],
  },
];

// Get filter categories by locale
export function getFilterCategories(locale: Locale): FilterCategory[] {
  return locale === "en" ? enFilterCategories : zhFilterCategories;
}

// Legacy export for backward compatibility
export const filterCategories = zhFilterCategories;
