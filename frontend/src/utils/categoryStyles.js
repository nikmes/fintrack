const categoryStyles = {
  food: {
    icon: "🍔",
    color: "#16a34a",
    background: "#dcfce7",
  },
  drinks: {
    icon: "☕",
    color: "#2563eb",
    background: "#dbeafe",
  },
  coffee: {
    icon: "☕",
    color: "#2563eb",
    background: "#dbeafe",
  },
  transport: {
    icon: "🚗",
    color: "#f97316",
    background: "#ffedd5",
  },
  shopping: {
    icon: "🛍️",
    color: "#9333ea",
    background: "#f3e8ff",
  },
  gym: {
    icon: "🏋️",
    color: "#dc2626",
    background: "#fee2e2",
  },
  fitness: {
    icon: "🏋️",
    color: "#dc2626",
    background: "#fee2e2",
  },
  bills: {
    icon: "🧾",
    color: "#0891b2",
    background: "#cffafe",
  },
  entertainment: {
    icon: "🎬",
    color: "#db2777",
    background: "#fce7f3",
  },
  health: {
    icon: "⚕️",
    color: "#059669",
    background: "#d1fae5",
  },
  education: {
    icon: "🎓",
    color: "#4f46e5",
    background: "#e0e7ff",
  },
  uncategorized: {
    icon: "📦",
    color: "#64748b",
    background: "#f1f5f9",
  },
};

export function getCategoryStyle(category) {
  const key = (category || "uncategorized").toLowerCase().trim();

  return (
    categoryStyles[key] || {
      icon: "📦",
      color: "#64748b",
      background: "#f1f5f9",
    }
  );
}