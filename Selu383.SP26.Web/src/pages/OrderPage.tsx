import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

type Category = "All" | "Drinks" | "Sweet Crepes" | "Savory Crepes" | "Bagels";

type MenuItem = {
    name: string;
    price: number;
    category: Exclude<Category, "All">;
    image: string;
    description: string;
};

const menuItems: MenuItem[] = [
    // DRINKS
    { name: "Iced Latte", price: 5.50, category: "Drinks", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&fit=crop&auto=format", description: "Espresso and milk served over ice for a refreshing coffee drink." },
    { name: "Supernova", price: 7.95, category: "Drinks", image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&fit=crop&auto=format", description: "A unique coffee blend with a complex, balanced profile and subtle sweetness." },
    { name: "Roaring Frappe", price: 6.20, category: "Drinks", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&fit=crop&auto=format", description: "Cold brew, milk, and ice blended together with a signature syrup, topped with whipped cream." },
    { name: "Black & White Cold Brew", price: 5.15, category: "Drinks", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&fit=crop&auto=format", description: "Cold brew made with both dark and light roast beans, finished with a drizzle of condensed milk." },
    { name: "Strawberry Limeade", price: 5.00, category: "Drinks", image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400&fit=crop&auto=format", description: "Fresh lime juice blended with strawberry purée for a refreshing, tangy drink." },
    { name: "Shaken Lemonade", price: 5.00, category: "Drinks", image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&fit=crop&auto=format", description: "Fresh lemon juice and simple syrup vigorously shaken for a bright, refreshing lemonade." },

    // SWEET CREPES
    { name: "Mannino Honey Crepe", price: 10.00, category: "Sweet Crepes", image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&fit=crop&auto=format", description: "A sweet crepe drizzled with Mannino honey and topped with mixed berries." },
    { name: "Downtowner", price: 10.75, category: "Sweet Crepes", image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&fit=crop&auto=format", description: "Strawberries and bananas wrapped in a crepe, finished with Nutella and Hershey's chocolate sauce." },
    { name: "Funky Monkey", price: 10.00, category: "Sweet Crepes", image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&fit=crop&auto=format", description: "Nutella and bananas wrapped in a crepe, served with whipped cream." },
    { name: "Le S'mores", price: 9.50, category: "Sweet Crepes", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&fit=crop&auto=format", description: "Marshmallow cream and chocolate sauce inside a crepe, topped with graham cracker crumbs." },
    { name: "Strawberry Fields", price: 10.00, category: "Sweet Crepes", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&fit=crop&auto=format", description: "Fresh strawberries with Hershey's chocolate drizzle and a dusting of powdered sugar." },
    { name: "Bonjour", price: 8.50, category: "Sweet Crepes", image: "https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=400&fit=crop&auto=format", description: "A sweet crepe filled with syrup and cinnamon, finished with powdered sugar." },
    { name: "Banana Foster", price: 8.95, category: "Sweet Crepes", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&fit=crop&auto=format", description: "Bananas with cinnamon in a crepe, topped with a generous drizzle of caramel sauce." },

    // SAVORY CREPES
    { name: "Matt's Scrambled Eggs", price: 5.00, category: "Savory Crepes", image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&fit=crop&auto=format", description: "Scrambled eggs and melted mozzarella cheese wrapped in a crepe." },
    { name: "Meanie Mushroom", price: 10.50, category: "Savory Crepes", image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&fit=crop&auto=format", description: "Sautéed mushrooms, mozzarella, tomato, and bacon inside a delicate crepe." },
    { name: "Turkey Club", price: 10.50, category: "Savory Crepes", image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&fit=crop&auto=format", description: "Sliced turkey, bacon, spinach, and tomato wrapped in a savory crepe." },
    { name: "Green Machine", price: 10.00, category: "Savory Crepes", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&fit=crop&auto=format", description: "Spinach, artichokes, and mozzarella cheese inside a fresh crepe." },
    { name: "Perfect Pair", price: 10.00, category: "Savory Crepes", image: "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&fit=crop&auto=format", description: "A unique combination of bacon and Nutella wrapped in a crepe." },
    { name: "Crepe Fromage", price: 8.00, category: "Savory Crepes", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&fit=crop&auto=format", description: "A savory crepe filled with a blend of cheeses." },
    { name: "Farmers Market Crepe", price: 10.50, category: "Savory Crepes", image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&fit=crop&auto=format", description: "Turkey, spinach, and mozzarella wrapped in a savory crepe." },

    // BAGELS
    { name: "Travis Special", price: 14.00, category: "Bagels", image: "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&fit=crop&auto=format", description: "Cream cheese, salmon, spinach, and a fried egg served on a freshly toasted bagel." },
    { name: "Crème Brulagel", price: 8.00, category: "Bagels", image: "https://images.unsplash.com/photo-1612240498936-65f5101365d2?w=400&fit=crop&auto=format", description: "A toasted bagel with a caramelized sugar crust inspired by crème brûlée, served with cream cheese." },
    { name: "The Fancy One", price: 13.00, category: "Bagels", image: "https://images.unsplash.com/photo-1598182198871-d3f4ab4fd181?w=400&fit=crop&auto=format", description: "Smoked salmon, cream cheese, and fresh dill on a toasted bagel." },
    { name: "Breakfast Bagel", price: 9.50, category: "Bagels", image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&fit=crop&auto=format", description: "A toasted bagel with your choice of ham, bacon, or sausage, a fried egg, and cheddar cheese." },
    { name: "The Classic", price: 5.25, category: "Bagels", image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&fit=crop&auto=format", description: "A toasted bagel with cream cheese." },
];

const categories: Category[] = ["All", "Drinks", "Sweet Crepes", "Savory Crepes", "Bagels"];

const categoryEmoji: Record<Category, string> = {
    "All": "",
    "Drinks": "☕",
    "Sweet Crepes": "🥞",
    "Savory Crepes": "🍳",
    "Bagels": "🥯",
};

type CartItem = MenuItem & { quantity: number };

export default function OrderPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const activeCategory = (searchParams.get("category") as Category) ?? "All";
    const [cart, setCart] = useState<CartItem[]>([]);

    const filtered = activeCategory === "All"
        ? menuItems
        : menuItems.filter(d => d.category === activeCategory);

    const addToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.name === item.name);
            if (existing) return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { ...item, quantity: 1 }];
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
            <div className="px-6 md:px-12 pt-10 pb-0">
                <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#2d6a4f] mb-2">
                    Caffeinated Lions
                </p>
                <h1 className="text-3xl font-medium mb-6">Order</h1>

                {/* CATEGORY FILTER */}
                <div className="flex gap-2 flex-wrap mb-8">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => cat === "All"
                                ? navigate("/order")
                                : navigate(`/order?category=${encodeURIComponent(cat)}`)}
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

            {/* MENU GRID */}
            <div className="px-6 md:px-12 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map(item => (
                    <div
                        key={item.name}
                        className="bg-white border border-[#e0e0e0] rounded-xl overflow-hidden flex flex-col shadow-sm"
                    >
                        {/* IMAGE */}
                        <div className="w-full h-40 overflow-hidden bg-[#f0fdf4]">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&fit=crop&auto=format";
                                }}
                            />
                        </div>

                        {/* CONTENT */}
                        <div className="p-4 flex flex-col flex-1">
                            <p className="text-[11px] text-[#2d6a4f] font-semibold uppercase tracking-wide mb-1">
                                {item.category}
                            </p>
                            <p className="text-sm font-semibold mb-1">{item.name}</p>
                            <p className="text-xs text-[#555] leading-relaxed mb-4 flex-1">
                                {item.description}
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
                                <button
                                    onClick={() => addToCart(item)}
                                    className="bg-[#7bf1a8] text-[#1a4731] text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#5ce090] transition-colors"
                                >
                                    Add +
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* BOTTOM CART BAR */}
            {cart.length > 0 && (
                <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1a4731", padding: "18px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20, overflow: "hidden" }}>
                        <div style={{ background: "#7bf1a8", color: "#1a4731", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
                            {totalItems}
                        </div>
                        <div style={{ display: "flex", gap: 16, alignItems: "center", overflow: "hidden" }}>
                            {cart.slice(0, 3).map((item, i) => (
                                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    {i > 0 && <div style={{ width: "0.5px", height: 32, background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />}
                                    <img src={item.image} alt={item.name} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(255,255,255,0.3)" }} />
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