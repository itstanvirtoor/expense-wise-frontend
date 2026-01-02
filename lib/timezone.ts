// Location to timezone and currency mappings
export interface LocationConfig {
  country: string;
  timezone: string;
  currency: string;
  currencySymbol: string;
  dateFormat: string;
}

export const LOCATIONS: LocationConfig[] = [
  {
    country: "United States",
    timezone: "America/New_York",
    currency: "USD",
    currencySymbol: "$",
    dateFormat: "MM/DD/YYYY",
  },
  {
    country: "India",
    timezone: "Asia/Kolkata",
    currency: "INR",
    currencySymbol: "₹",
    dateFormat: "DD/MM/YYYY",
  },
  {
    country: "United Kingdom",
    timezone: "Europe/London",
    currency: "GBP",
    currencySymbol: "£",
    dateFormat: "DD/MM/YYYY",
  },
  {
    country: "Germany",
    timezone: "Europe/Berlin",
    currency: "EUR",
    currencySymbol: "€",
    dateFormat: "DD.MM.YYYY",
  },
  {
    country: "France",
    timezone: "Europe/Paris",
    currency: "EUR",
    currencySymbol: "€",
    dateFormat: "DD/MM/YYYY",
  },
  {
    country: "Japan",
    timezone: "Asia/Tokyo",
    currency: "JPY",
    currencySymbol: "¥",
    dateFormat: "YYYY/MM/DD",
  },
  {
    country: "Australia",
    timezone: "Australia/Sydney",
    currency: "AUD",
    currencySymbol: "A$",
    dateFormat: "DD/MM/YYYY",
  },
  {
    country: "Canada",
    timezone: "America/Toronto",
    currency: "CAD",
    currencySymbol: "C$",
    dateFormat: "DD/MM/YYYY",
  },
  {
    country: "Singapore",
    timezone: "Asia/Singapore",
    currency: "SGD",
    currencySymbol: "S$",
    dateFormat: "DD/MM/YYYY",
  },
  {
    country: "United Arab Emirates",
    timezone: "Asia/Dubai",
    currency: "AED",
    currencySymbol: "د.إ",
    dateFormat: "DD/MM/YYYY",
  },
];

// Get location config by country
export const getLocationConfig = (country: string): LocationConfig | undefined => {
  return LOCATIONS.find((loc) => loc.country === country);
};

// Get location config by timezone
export const getLocationConfigByTimezone = (timezone: string): LocationConfig => {
  const config = LOCATIONS.find((loc) => loc.timezone === timezone);
  if (config) return config;
  
  // Fallback: try to match by timezone prefix
  const tzPrefix = timezone.split('/')[0];
  const fallback = LOCATIONS.find((loc) => loc.timezone.startsWith(tzPrefix));
  
  // Default to United States if no match
  return fallback || LOCATIONS[0];
};

// Detect user's location based on browser timezone
export const detectUserLocation = (): LocationConfig => {
  try {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return getLocationConfigByTimezone(userTimezone);
  } catch (error) {
    console.error("Failed to detect timezone:", error);
    return LOCATIONS[0]; // Default to United States
  }
};

// Format currency based on locale and currency
export const formatCurrency = (
  amount: number,
  currency: string = "USD",
  locale?: string
): string => {
  const locationConfig = LOCATIONS.find((loc) => loc.currency === currency);
  
  // Determine locale based on currency if not provided
  if (!locale) {
    switch (currency) {
      case "INR":
        locale = "en-IN";
        break;
      case "GBP":
        locale = "en-GB";
        break;
      case "EUR":
        locale = "de-DE";
        break;
      case "JPY":
        locale = "ja-JP";
        break;
      case "AUD":
        locale = "en-AU";
        break;
      case "CAD":
        locale = "en-CA";
        break;
      case "SGD":
        locale = "en-SG";
        break;
      case "AED":
        locale = "ar-AE";
        break;
      default:
        locale = "en-US";
    }
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date based on timezone
export const formatDate = (
  date: Date | string,
  timezone: string = "America/New_York",
  format: "short" | "long" | "full" = "short"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: "numeric",
    month: format === "short" ? "short" : "long",
    day: "numeric",
  };

  if (format === "full") {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return dateObj.toLocaleDateString("en-US", options);
};

// Get current date/time in specific timezone
export const getCurrentDateTime = (timezone: string = "America/New_York"): Date => {
  const now = new Date();
  const offsetString = now.toLocaleString("en-US", { timeZone: timezone });
  return new Date(offsetString);
};

// Format date-time for display
export const formatDateTime = (
  date: Date | string,
  timezone: string = "America/New_York"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleString("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get month start and end dates in specific timezone
export const getMonthBoundaries = (
  timezone: string = "America/New_York",
  monthOffset: number = 0
): { start: Date; end: Date } => {
  const now = getCurrentDateTime(timezone);
  const year = now.getFullYear();
  const month = now.getMonth() + monthOffset;

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return { start, end };
};

// Format month/year display
export const formatMonthYear = (
  date: Date | string,
  timezone: string = "America/New_York"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("en-US", {
    timeZone: timezone,
    month: "long",
    year: "numeric",
  });
};
