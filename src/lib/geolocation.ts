// IP Geolocation service for smart search redirect
// IP 地理位置服务 - 智能搜索重定向

// Geolocation result interface
export interface GeoLocation {
  country: string;
  countryCode: string;
}

// Cache key and expiry (24 hours)
const CACHE_KEY = "user_region";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

interface CachedRegion {
  data: GeoLocation;
  timestamp: number;
}

/**
 * Detect user's region via IP geolocation
 * Uses ipapi.co (free, HTTPS, 1000 req/day limit)
 * Caches result in localStorage for 24 hours
 */
export async function detectUserRegion(): Promise<GeoLocation> {
  // Check cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp }: CachedRegion = JSON.parse(cached);
      // Return cached if not expired
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data;
      }
    }
  } catch {
    // Ignore cache errors
  }

  try {
    // Call free IP geolocation API (HTTPS)
    const response = await fetch("https://ipapi.co/json/");

    if (!response.ok) {
      throw new Error("Geolocation API failed");
    }

    const data = await response.json();
    const region: GeoLocation = {
      country: data.country_name || "Unknown",
      countryCode: data.country_code || "US",
    };

    // Cache the result
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data: region,
        timestamp: Date.now(),
      })
    );

    return region;
  } catch (error) {
    console.error("Geolocation detection failed:", error);
    // Default to US (Google) on failure
    return { country: "Unknown", countryCode: "US" };
  }
}

/**
 * Check if user is in China based on region
 */
export function isChina(region: GeoLocation): boolean {
  return region.countryCode === "CN";
}

/**
 * Build external search URL based on user region
 * China users → Bing, Others → Google
 * @param movieTitle - Movie title to search
 * @param isChineseRegion - Whether user is in China
 */
export function buildSearchUrl(
  movieTitle: string,
  isChineseRegion: boolean
): string {
  const query = encodeURIComponent(`${movieTitle} 在线观看`);

  if (isChineseRegion) {
    return `https://www.bing.com/search?q=${query}`;
  }
  return `https://www.google.com/search?q=${query}`;
}
