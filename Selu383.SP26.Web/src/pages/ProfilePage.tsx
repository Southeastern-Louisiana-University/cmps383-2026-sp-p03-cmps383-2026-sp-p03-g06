import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Tab = "orders" | "payment";

const pastOrders = [
    { id: "#10245", status: "Picked up", date: "Apr 22, 2026", items: "Iced Latte (L), Blueberry Muffin", total: "$9.00" },
    { id: "#10198", status: "Picked up", date: "Apr 18, 2026", items: "Supernova Espresso (M)", total: "$7.95" },
    { id: "#10134", status: "Picked up", date: "Apr 11, 2026", items: "Roaring Frappe (L), Croissant", total: "$10.45" },
];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<Tab>("orders");
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f9fdf9] flex flex-col">

            {/* MAIN WRAPPER */}
            <div className="flex-1">

                {/* PAGE HEADER */}
                <div className="max-w-5xl mx-auto px-6 md:px-12 pt-12 pb-8 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-[#7bf1a8] flex items-center justify-center text-2xl font-bold text-[#1a4731]">
                        ?
                    </div>
                    <div>
                        <h1 className="text-3xl font-medium" style={{ fontFamily: "Georgia, serif" }}>Your Profile</h1>
                        <p className="text-sm text-[#555] mt-1">Manage your account details and orders</p>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="max-w-5xl mx-auto px-6 md:px-12 pb-16 flex flex-col lg:flex-row gap-8">

                    {/* LEFT — Personal Info */}
                    <div className="w-full lg:w-72 shrink-0">
                        <div className="bg-white rounded-2xl border border-[#e0e0e0] p-6">
                            <h2 className="text-base font-semibold mb-6 text-[#1a4731]">Personal Info</h2>

                            {[
                                { label: "FULL NAME", value: "John Doe", placeholder: "Your name", icon: "👤" },
                                { label: "EMAIL", value: "john@example.com", placeholder: "your@email.com", icon: "✉️" },
                                { label: "PHONE NUMBER", value: "(555) 123-4567", placeholder: "+1 (555) 000-0000", icon: "📱" },
                                { label: "BIRTHDAY", value: "Jan 15, 1999", placeholder: "Not set", icon: "🎂" },
                            ].map((field) => (
                                <div key={field.label} className="mb-5 pb-5 border-b border-[#f0f0f0] last:border-0 last:mb-0 last:pb-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs">{field.icon}</span>
                                        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#999]">{field.label}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-[#333]">{field.value || field.placeholder}</p>
                                        <button className="text-[#aaa] hover:text-[#1a4731] transition-colors text-xs">✏️</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Log out */}
                        <button
                            onClick={() => navigate("/")}
                            className="mt-4 w-full text-sm text-[#555] border border-[#e0e0e0] rounded-full py-2.5 hover:bg-white transition-colors"
                        >
                            Log out
                        </button>
                    </div>

                    {/* RIGHT — Tabs */}
                    <div className="flex-1">

                        {/* Tab bar */}
                        <div className="flex gap-2 mb-6">
                            <button
                                onClick={() => setActiveTab("orders")}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
                                style={{
                                    background: activeTab === "orders" ? "#7bf1a8" : "white",
                                    color: activeTab === "orders" ? "#1a4731" : "#555",
                                    border: activeTab === "orders" ? "none" : "1px solid #e0e0e0",
                                }}
                            >
                                🧾 Past Orders
                            </button>
                            <button
                                onClick={() => setActiveTab("payment")}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
                                style={{
                                    background: activeTab === "payment" ? "#7bf1a8" : "white",
                                    color: activeTab === "payment" ? "#1a4731" : "#555",
                                    border: activeTab === "payment" ? "none" : "1px solid #e0e0e0",
                                }}
                            >
                                💳 Payment
                            </button>
                        </div>

                        {/* Past Orders */}
                        {activeTab === "orders" && (
                            <div className="bg-white rounded-2xl border border-[#e0e0e0] divide-y divide-[#f0f0f0]">
                                {pastOrders.map((order) => (
                                    <div key={order.id} className="p-5 flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-sm font-semibold text-[#1a4731]">{order.id}</span>
                                                <span className="text-[11px] font-medium bg-[#f0fdf4] text-[#2d6a4f] px-2.5 py-0.5 rounded-full border border-[#b7f5d0]">
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#999] mb-1">{order.date}</p>
                                            <p className="text-sm text-[#555]">{order.items}</p>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <span className="text-sm font-semibold">{order.total}</span>
                                            <button
                                                onClick={() => navigate("/order")}
                                                className="bg-[#7bf1a8] text-[#1a4731] text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#5ce090] transition-colors"
                                            >
                                                Reorder
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Payment */}
                        {activeTab === "payment" && (
                            <div className="bg-white rounded-2xl border border-[#e0e0e0] p-8 text-center">
                                <div className="text-4xl mb-4">💳</div>
                                <p className="text-base font-medium mb-2">No payment methods saved</p>
                                <p className="text-sm text-[#555] mb-6">Add a card to speed up checkout</p>
                                <button className="bg-[#7bf1a8] text-[#1a4731] px-6 py-2.5 rounded-full text-sm font-semibold">
                                    Add payment method
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-[#1a4731] py-12 px-6 md:px-12 mt-8">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-[#7bf1a8] flex items-center justify-center text-sm">☕</div>
                            <span className="text-white font-semibold">Caffeinated Lions</span>
                        </div>
                        <p className="text-sm text-white/60">Handcrafted with care. Open daily 6am – 8pm.</p>
                    </div>
                    <div className="flex gap-8">
                        {["Menu", "Rewards", "Careers", "Contact"].map((link) => (
                            <a key={link} href="#" className="text-sm text-white/60 hover:text-white transition-colors">{link}</a>
                        ))}
                    </div>
                </div>
                <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/40">© 2026 Caffeinated Lions. All rights reserved.</p>
                    <div className="flex gap-6">
                        {["Privacy", "Terms", "Cookies"].map((link) => (
                            <a key={link} href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">{link}</a>
                        ))}
                    </div>
                </div>
            </footer>

        </div>
    );
}
