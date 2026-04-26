import travisSpecialImg from "../assets/travis-special.png";
import bonjourImg from "../assets/bonjour.png";
import bonjour2Img from "../assets/bonjour2.png";
import meanieImg from "../assets/meanie.png";
import fancyImg from "../assets/fancy.png";
import classicImg from "../assets/classic.png";
import breakfastImg from "../assets/breakfast.png";
import cremeImg from "../assets/creme.png";
import bananaImg from "../assets/banana.png";
import strawImg from "../assets/straw.png";
import manImg from "../assets/man.png";
import smoreImg from "../assets/smore.png";
import funkImg from "../assets/funk.png";
import pairImg from "../assets/pair.png";
import farmImg from "../assets/farm.png";
import fromageImg from "../assets/fromage.png";
import greenImg from "../assets/green.png";
import turkeyImg from "../assets/turkey.png";
import eggImg from "../assets/egg.png";
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

type Size = "Small" | "Medium" | "Large";
type MilkType = "Whole" | "Skim" | "Soy" | "Almond" | "Oat" | "No Milk";

type CartItem = MenuItem & {
    quantity: number;
    size?: Size;
    milk?: MilkType;
    itemTotal: number;
};

const MILK_UPCHARGE = 0.70;
const PREMIUM_MILKS: MilkType[] = ["Soy", "Almond", "Oat"];

const SIZE_PRICES: Record<Size, number> = {
    Small: 0,
    Medium: 0.50,
    Large: 1.00,
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
    { name: "Mannino Honey Crepe", price: 10.00, category: "Sweet Crepes", image: manImg, description: "A sweet crepe drizzled with Mannino honey and topped with mixed berries." },
    { name: "Downtowner", price: 10.75, category: "Sweet Crepes", image: bonjourImg, description: "Strawberries and bananas wrapped in a crepe, finished with Nutella and Hershey's chocolate sauce." },
    { name: "Funky Monkey", price: 10.00, category: "Sweet Crepes", image: funkImg, description: "Nutella and bananas wrapped in a crepe, served with whipped cream." },
    { name: "Le S'mores", price: 9.50, category: "Sweet Crepes", image: smoreImg, description: "Marshmallow cream and chocolate sauce inside a crepe, topped with graham cracker crumbs." },
    { name: "Strawberry Fields", price: 10.00, category: "Sweet Crepes", image: strawImg, description: "Fresh strawberries with Hershey's chocolate drizzle and a dusting of powdered sugar." },
    { name: "Bonjour", price: 8.50, category: "Sweet Crepes", image: bonjour2Img, description: "A sweet crepe filled with syrup and cinnamon, finished with powdered sugar." },
    { name: "Banana Foster", price: 8.95, category: "Sweet Crepes", image: bananaImg, description: "Bananas with cinnamon in a crepe, topped with a generous drizzle of caramel sauce." },

    // SAVORY CREPES
    { name: "Matt's Scrambled Eggs", price: 5.00, category: "Savory Crepes", image: eggImg, description: "Scrambled eggs and melted mozzarella cheese wrapped in a crepe." },
    { name: "Meanie Mushroom", price: 10.50, category: "Savory Crepes", image: meanieImg, description: "Sautéed mushrooms, mozzarella, tomato, and bacon inside a delicate crepe." },
    { name: "Turkey Club", price: 10.50, category: "Savory Crepes", image: turkeyImg, description: "Sliced turkey, bacon, spinach, and tomato wrapped in a savory crepe." },
    { name: "Green Machine", price: 10.00, category: "Savory Crepes", image: greenImg, description: "Spinach, artichokes, and mozzarella cheese inside a fresh crepe." },
    { name: "Perfect Pair", price: 10.00, category: "Savory Crepes", image: pairImg, description: "A unique combination of bacon and Nutella wrapped in a crepe." },
    { name: "Crepe Fromage", price: 8.00, category: "Savory Crepes", image: fromageImg, description: "A savory crepe filled with a blend of cheeses." },
    { name: "Farmers Market Crepe", price: 10.50, category: "Savory Crepes", image: farmImg, description: "Turkey, spinach, and mozzarella wrapped in a savory crepe." },

    // BAGELS
    { name: "Travis Special", price: 14.00, category: "Bagels", image: travisSpecialImg, description: "Cream cheese, salmon, spinach, and a fried egg served on a freshly toasted bagel." },
    { name: "Crème Brulagel", price: 8.00, category: "Bagels", image: cremeImg, description: "A toasted bagel with a caramelized sugar crust inspired by crème brûlée, served with cream cheese." },
    { name: "The Fancy One", price: 13.00, category: "Bagels", image: fancyImg, description: "Smoked salmon, cream cheese, and fresh dill on a toasted bagel." },
    { name: "Breakfast Bagel", price: 9.50, category: "Bagels", image: breakfastImg, description: "A toasted bagel with your choice of ham, bacon, or sausage, a fried egg, and cheddar cheese." },
    { name: "The Classic", price: 5.25, category: "Bagels", image: classicImg, description: "A toasted bagel with cream cheese." },
];

const categories: Category[] = ["All", "Drinks", "Sweet Crepes", "Savory Crepes", "Bagels"];

const categoryEmoji: Record<Category, string> = {
    "All": "",
    "Drinks": "☕",
    "Sweet Crepes": "🥞",
    "Savory Crepes": "🍳",
    "Bagels": "🥯",
};

function calcItemTotal(basePrice: number, size: Size, milk: MilkType): number {
    const sizeAdd = SIZE_PRICES[size];
    const milkAdd = PREMIUM_MILKS.includes(milk) ? MILK_UPCHARGE : 0;
    return basePrice + sizeAdd + milkAdd;
}

// --- MODAL ---
function DrinkOptionsModal({
    item,
    onConfirm,
    onClose,
}: {
    item: MenuItem;
    onConfirm: (size: Size, milk: MilkType) => void;
    onClose: () => void;
}) {
    const [size, setSize] = useState<Size>("Medium");
    const [milk, setMilk] = useState<MilkType>("Whole");

    const previewPrice = calcItemTotal(item.price, size, milk);

    const sizes: Size[] = ["Small", "Medium", "Large"];
    const milks: { label: MilkType; upcharge?: boolean }[] = [
        { label: "Whole" },
        { label: "Skim" },
        { label: "Soy", upcharge: true },
        { label: "Almond", upcharge: true },
        { label: "Oat", upcharge: true },
        { label: "No Milk" },
    ];

    return (
        <div
            className="z-[200] fixed inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="relative h-36 overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-sm text-white transition-colors hover:bg-black/50"
                    >
                        ✕
                    </button>
                    <div className="absolute bottom-3 left-4">
                        <p className="text-lg font-semibold leading-tight text-white">{item.name}</p>
                        <p className="text-xs text-white/70">Customize your order</p>
                    </div>
                </div>

                <div className="p-5">
                    {/* SIZE */}
                    <div className="mb-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#2d6a4f]">Size</p>
                        <div className="flex gap-2">
                            {sizes.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSize(s)}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border"
                                    style={{
                                        background: size === s ? "#1a4731" : "transparent",
                                        color: size === s ? "white" : "#555",
                                        borderColor: size === s ? "#1a4731" : "#e0e0e0",
                                    }}
                                >
                                    {s}
                                    {SIZE_PRICES[s] > 0 && (
                                        <span className="mt-0.5 block text-[10px] opacity-70">
                                            +${SIZE_PRICES[s].toFixed(2)}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* MILK */}
                    <div className="mb-6">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#2d6a4f]">Milk</p>
                        <div className="grid grid-cols-3 gap-2">
                            {milks.map(({ label, upcharge }) => (
                                <button
                                    key={label}
                                    onClick={() => setMilk(label)}
                                    className="py-2.5 px-2 rounded-xl text-sm font-medium transition-all border"
                                    style={{
                                        background: milk === label ? "#1a4731" : "transparent",
                                        color: milk === label ? "white" : "#555",
                                        borderColor: milk === label ? "#1a4731" : "#e0e0e0",
                                    }}
                                >
                                    {label}
                                    {upcharge && (
                                        <span className="mt-0.5 block text-[10px] opacity-70">
                                            +${MILK_UPCHARGE.toFixed(2)}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CONFIRM */}
                    <button
                        onClick={() => onConfirm(size, milk)}
                        className="w-full py-3.5 rounded-full font-semibold text-sm transition-opacity hover:opacity-90"
                        style={{ background: "#7bf1a8", color: "#1a4731" }}
                    >
                        Add to order — ${previewPrice.toFixed(2)}
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- MAIN PAGE ---
export default function OrderPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const activeCategory = (searchParams.get("category") as Category) ?? "All";
    const [cart, setCart] = useState<CartItem[]>([]);
    const [modalItem, setModalItem] = useState<MenuItem | null>(null);

    const filtered = activeCategory === "All"
        ? menuItems
        : menuItems.filter(d => d.category === activeCategory);

    const handleAddClick = (item: MenuItem) => {
        if (item.category === "Drinks") {
            setModalItem(item);
        } else {
            setCart(prev => {
                const existing = prev.find(i => i.name === item.name && !i.size);
                if (existing) return prev.map(i => i.name === item.name && !i.size ? { ...i, quantity: i.quantity + 1 } : i);
                return [...prev, { ...item, quantity: 1, itemTotal: item.price }];
            });
        }
    };

    const handleModalConfirm = (size: Size, milk: MilkType) => {
        if (!modalItem) return;
        const itemTotal = calcItemTotal(modalItem.price, size, milk);
        
        setCart(prev => {
            const existing = prev.find(i => i.name === modalItem.name && i.size === size && i.milk === milk);
            if (existing) {
                return prev.map(i =>
                    i.name === modalItem.name && i.size === size && i.milk === milk
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...modalItem, quantity: 1, size, milk, itemTotal }];
        });
        setModalItem(null);
    };

    const updateQty = (name: string, delta: number, size?: Size, milk?: MilkType) => {
        setCart(prev =>
            prev.map(i =>
                i.name === name && i.size === size && i.milk === milk
                    ? { ...i, quantity: i.quantity + delta }
                    : i
            ).filter(i => i.quantity > 0)
        );
    };

    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = cart.reduce((sum, i) => sum + i.itemTotal * i.quantity, 0);
    const tax = subtotal * 0.085;
    const total = subtotal + tax;

    return (
        <div style={{ paddingBottom: cart.length > 0 ? 100 : 0 }}>

            {/* DRINK OPTIONS MODAL */}
            {modalItem && (
                <DrinkOptionsModal
                    item={modalItem}
                    onConfirm={handleModalConfirm}
                    onClose={() => setModalItem(null)}
                />
            )}

            {/* PAGE HEADER */}
            <div className="px-6 pb-0 pt-10 md:px-12">
                <p className="tracking-[0.08em] mb-2 text-xs font-semibold uppercase text-[#2d6a4f]">
                    Caffeinated Lions
                </p>
                <h1 className="mb-6 text-3xl font-medium">Order</h1>

                {/* CATEGORY FILTER */}
                <div className="mb-8 flex flex-wrap gap-2">
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
            <div className="grid grid-cols-1 gap-5 px-6 pb-12 sm:grid-cols-2 md:px-12 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map(item => (
                    <div
                        key={item.name}
                        className="flex flex-col overflow-hidden rounded-xl border border-[#e0e0e0] bg-white shadow-sm"
                    >
                        <div className="h-40 w-full overflow-hidden bg-[#f0fdf4]">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&fit=crop&auto=format";
                                }}
                            />
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                            <p className="mb-1 font-semibold uppercase tracking-wide text-[11px] text-[#2d6a4f]">
                                {item.category}
                            </p>
                            <p className="mb-1 text-sm font-semibold">{item.name}</p>
                            <p className="mb-4 flex-1 text-xs leading-relaxed text-[#555]">
                                {item.description}
                            </p>
                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
                                <button
                                    onClick={() => handleAddClick(item)}
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
                                <div key={`${item.name}-${item.size}-${item.milk}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    {i > 0 && <div style={{ width: "0.5px", height: 32, background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />}
                                    <img src={item.image} alt={item.name} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(255,255,255,0.3)" }} />
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 500, color: "white", whiteSpace: "nowrap" }}>
                                            {item.name}{item.size ? ` (${item.size})` : ""}
                                        </p>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                                            <button onClick={() => updateQty(item.name, -1, item.size, item.milk)} style={{ width: 18, height: 18, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "white", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>×{item.quantity}</span>
                                            <button onClick={() => updateQty(item.name, 1, item.size, item.milk)} style={{ width: 18, height: 18, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "white", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>${(item.itemTotal * item.quantity).toFixed(2)}</span>
                                        </div>
                                        {item.milk && (
                                            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>{item.milk} milk</p>
                                        )}
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