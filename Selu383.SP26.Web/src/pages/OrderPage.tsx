import { useState } from "react";

type Category = "All" | "Hot drinks" | "Cold drinks" | "Matcha & tea" | "Food" | "Seasonal";

type Drink = {
    name: string;
    price: number;
    category: Exclude<Category, "All">;
    emoji: string;
    description: string;
    seasonal?: boolean;
};

const drinks: Drink[] = [
    { emoji: "☕", name: "Latte", price: 4.50, category: "Hot drinks", description: "Espresso with steamed milk and light foam." },
    { emoji: "☕", name: "Cappuccino", price: 4.25, category: "Hot drinks", description: "Bold espresso with thick steamed milk foam." },
    { emoji: "🍂", name: "Honey cinnamon flat white", price: 6.00, category: "Hot drinks", description: "Ristretto shots with honey and cinnamon." },
    { emoji: "☁️", name: "Cold brew cloud", price: 7.00, category: "Cold drinks", description: "Smooth cold brew with sweet cream foam." },
    { emoji: "❄️", name: "Iced americano", price: 4.75, category: "Cold drinks", description: "Espresso shots over ice with cold water." },
    { emoji: "🌿", name: "Matcha oat latte", price: 6.50, category: "Matcha & tea", description: "Ceremonial matcha with silky oat milk." },
    { emoji: "🍵", name: "Chai latte", price: 5.50, category: "Matcha & tea", description: "Spiced chai concentrate with steamed milk." },
    { emoji: "🧁", name: "Butter croissant", price: 3.50, category: "Food", description: "Flaky, buttery croissant baked fresh daily." },
    { emoji: "🥪", name: "Avocado toast", price: 7.50, category: "Food", description: "Sourdough with smashed avocado and sea salt." },
    { emoji: "🌸", name: "Cherry blossom latte", price: 7.25, category: "Seasonal", description: "Espresso with cherry blossom syrup and oat milk.", seasonal: true },
];

const categories: Category[] = ["All", "Hot drinks", "Cold drinks", "Matcha & tea", "Food", "Seasonal"];

const categoryEmoji: Record<Category, string> = {
    "All": "",
    "Hot drinks": "🔥",
    "Cold drinks": "❄️",
    "Matcha & tea": "🌿",
    "Food": "🍪",
    "Seasonal": "✨",
};

type CartItem = Drink & { quantity: number };

export default function OrderPage() {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [cart, setCart] = useState<CartItem[]>([]);

    const filtered = activeCategory === "All" ? drinks : drinks.filter(d => d.category === activeCategory);

    const addToCart = (drink: Drink) => {
        setCart(prev => {
            const existing = prev.find(i => i.name === drink.name);
            if (existing) {
                return prev.map(i => i.name === drink.name ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...drink, quantity: 1 }];
        });
    };

    const updateQty = (name: string, delta: number) => {
        setCart(prev =>
            prev.map(i => i.name === name ? { ...i, quantity: i.quantity + delta } : i)
                .filter(i => i.quantity > 0)
        );
    };

    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = subtotal * 0.085;
    const total = subtotal + tax;

    return (
        <div style={{ paddingBottom: cart.length > 0 ? 100 : 0 }}>

            {/* PAGE HEADER */}
            <div style={{ padding: "40px 48px 0" }}>
                <p style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "#2d6a4f", marginBottom: 8 }}>
                    Caffeinated Lions
                </p>
                <h1 style={{ fontSize: 32, fontWeight: 500, marginBottom: 28 }}>Order</h1>

                {/* CATEGORY FILTER */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 36 }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: "8px 20px",
                                borderRadius: 20,
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: "pointer",
                                border: activeCategory === cat ? "1.5px solid #1a4731" : "1.5px solid #ddd",
                                background: activeCategory === cat ? "#1a4731" : "transparent",
                                color: activeCategory === cat ? "white" : "#555",
                                transition: "all 0.15s",
                            }}
                        >
                            {categoryEmoji[cat] && `${categoryEmoji[cat]} `}{cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* DRINK GRID */}
            <div style={{ padding: "0 48px 48px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                {filtered.map(drink => (
                    <div
                        key={drink.name}
                        style={{
                            background: "#f9f9f9",
                            borderRadius: 12,
                            padding: 20,
                            border: drink.seasonal ? "2px solid #7bf1a8" : "0.5px solid #e0e0e0",
                            position: "relative",
                        }}
                    >
                        {drink.seasonal && (
                            <div style={{ position: "absolute", top: -10, left: 16, background: "#7bf1a8", color: "#1a4731", fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 10 }}>
                                Seasonal
                            </div>
                        )}
                        <div style={{ width: 52, height: 52, background: "#7bf1a8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>
                            {drink.emoji}
                        </div>
                        <p style={{ fontSize: 11, color: "#2d6a4f", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                            {drink.category}
                        </p>
                        <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{drink.name}</p>
                        <p style={{ fontSize: 13, color: "#555", marginBottom: 16, lineHeight: 1.5 }}>{drink.description}</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 15, fontWeight: 500 }}>${drink.price.toFixed(2)}</span>
                            <button
                                onClick={() => addToCart(drink)}
                                style={{ background: "#7bf1a8", color: "#1a4731", border: "none", padding: "9px 18px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                            >
                                Add +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* BOTTOM CART BAR */}
            {cart.length > 0 && (
                <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1a4731", padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "0.5px solid rgba(255,255,255,0.1)", zIndex: 100 }}>

                    {/* LEFT: item count + cart items */}
                    <div style={{ display: "flex", alignItems: "center", gap: 20, overflow: "hidden" }}>
                        <div style={{ background: "#7bf1a8", color: "#1a4731", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
                            {totalItems}
                        </div>
                        <div style={{ display: "flex", gap: 16, alignItems: "center", overflow: "hidden" }}>
                            {cart.slice(0, 3).map((item, i) => (
                                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    {i > 0 && <div style={{ width: "0.5px", height: 32, background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />}
                                    <span style={{ fontSize: 16 }}>{item.emoji}</span>
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 500, color: "white", whiteSpace: "nowrap" }}>{item.name}</p>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                                            <button onClick={() => updateQty(item.name, -1)} style={{ width: 18, height: 18, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "white", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>×{item.quantity}</span>
                                            <button onClick={() => updateQty(item.name, 1)} style={{ width: 18, height: 18, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "white", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {cart.length > 3 && (
                                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap" }}>+{cart.length - 3} more</p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: total + place order */}
                    <div style={{ display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}>
                        <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Total incl. tax</p>
                            <p style={{ fontSize: 20, fontWeight: 500, color: "white" }}>${total.toFixed(2)}</p>
                        </div>
                        <button style={{ background: "#7bf1a8", color: "#1a4731", border: "none", padding: "14px 32px", borderRadius: 24, fontSize: 15, fontWeight: 500, cursor: "pointer" }}>
                            Place order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}