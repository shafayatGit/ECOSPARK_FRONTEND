export function formatCurrency(
  amount: number | string,
  currency = "USD",
): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;

  if (Number.isNaN(value)) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatStatusLabel(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function truncateText(text: string, maxLength = 40): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}
