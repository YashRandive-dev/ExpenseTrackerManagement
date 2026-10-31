import { format } from "date-fns";

export const LOCALE = "en-US";

export const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "CNY", "AUD", "CAD", "CHF", "SGD", "AED", "SAR", "ZAR", "BRL", "MXN", "KRW", "NZD", "SEK", "NOK", "TRY", "RUB", "IDR", "PHP", "THB", "MYR", "PKR", "BDT", "LKR", "NGN", "KES", "EGP"];

// The signed-in user's currency; set from UserContext whenever the user changes.
let currentCurrency = "USD";
export const setCurrency = (code) => {
  if (CURRENCIES.includes(code)) currentCurrency = code;
};
export const getCurrencyName = (code) => {
  try {
    return new Intl.DisplayNames([LOCALE], { type: "currency" }).of(code);
  } catch {
    return code;
  }
};

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const formatCurrency = (value) =>
  new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: currentCurrency,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export const formatDate = (date) => {
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? "" : format(d, "do MMM yyyy");
};

export const toInputDate = (date = new Date()) => format(date, "yyyy-MM-dd");

export const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");

export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") =>
  error?.response?.data?.message || (error?.code === "ERR_NETWORK" ? "Cannot reach the server." : fallback);

/** Sum amounts per calendar day, ascending: [{ label, amount }] */
export const groupByDate = (items = []) => {
  const map = new Map();
  items.forEach((item) => {
    const key = format(new Date(item.date), "yyyy-MM-dd");
    map.set(key, (map.get(key) || 0) + item.amount);
  });
  return [...map.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, amount]) => ({
      label: format(new Date(`${key}T00:00:00`), "do MMM"),
      amount,
    }));
};

/** Sum amounts per field (source / category): [{ name, amount }] */
export const groupByField = (items = [], field) => {
  const map = new Map();
  items.forEach((item) => {
    map.set(item[field], (map.get(item[field]) || 0) + item.amount);
  });
  return [...map.entries()].map(([name, amount]) => ({ name, amount }));
};

/** Save a Blob response from axios as a file */
export const downloadBlob = (data, filename) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
