import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./profilepage.css";

type Tab = "orders" | "payment";

const pastOrders = [
    { id: "#10245", status: "Picked up", date: "Apr 22, 2026", items: "Iced Latte (L)", total: "$6.50" },
    { id: "#10198", status: "Picked up", date: "Apr 18, 2026", items: "Supernova Espresso (M)", total: "$7.95" },
    { id: "#10134", status: "Picked up", date: "Apr 11, 2026", items: "Roaring Frappe (L), Banana Foster", total: "$15.15" },
];

type FieldDef = { label: string; key: string; icon: string; value: string };

const API_KEY_MAP: Record<string, string> = {
    email: "email",
    phone: "phoneNumber",
    address: "address",
    name: "name",
    birthday: "birthday",
};

function FieldRow({ field }: { field: FieldDef }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(field.value);
    const [draft, setDraft] = useState(field.value);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (saving) return;

        setSaving(true);
        setError(null);

        try {
            const apiKey = API_KEY_MAP[field.key];

            if (apiKey) {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ [apiKey]: draft }),
                });

                if (!res.ok) {
                    const errBody = await res.json().catch(() => ({}));
                    throw new Error(errBody.message || `Server error ${res.status}`);
                }
            }

            setValue(draft);
            setEditing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not save. Try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setDraft(value);
        setEditing(false);
        setError(null);
    };

    return (
        <div className="mb-5 border-b border-[#f0f0f0] pb-5 last:mb-0 last:border-0 last:pb-0">
            <div className="mb-1 flex items-center gap-2">
                <span className="text-xs">{field.icon}</span>
                <p className="tracking-[0.1em] font-semibold uppercase text-[10px] text-[#999]">
                    {field.label}
                </p>
            </div>

            {editing ? (
                <div className="mt-1 flex flex-col gap-2">
                    <input
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        className="w-full text-sm border border-[#7bf1a8] rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-[#7bf1a8]/40"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                            if (e.key === "Escape") handleCancel();
                        }}
                    />

                    {error && <p className="text-xs text-red-500">{error}</p>}

                    <div className="flex gap-2">
                        <button onClick={handleSave} disabled={saving} className="primary w-full">
                            {saving ? "Saving..." : "Save"}
                        </button>

                        <button onClick={handleCancel} className="secondary w-full">
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-[#333]">{value}</p>

                    <button onClick={() => setEditing(true)} className="icon">
                        ✏️
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<Tab>("orders");
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        birthday: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!res.ok) return;

                const data = await res.json();

                setUserData({
                    name: data.name ?? "",
                    email: data.email ?? "",
                    phone: data.phoneNumber ?? "",
                    birthday: data.birthday ?? "",
                });
            } catch {}
        };

        fetchUser();
    }, []);

    const fields: FieldDef[] = useMemo(
        () => [
            { label: "FULL NAME", key: "name", icon: "👤", value: userData.name },
            { label: "EMAIL", key: "email", icon: "✉️", value: userData.email },
            { label: "PHONE NUMBER", key: "phone", icon: "📱", value: userData.phone },
            { label: "BIRTHDAY", key: "birthday", icon: "🎂", value: userData.birthday },
        ],
        [userData]
    );

    return (
        <div className="profile-page flex min-h-screen flex-col bg-[#f9fdf9]">

            <div className="flex-1">

                {/* HEADER */}
                <div className="mx-auto flex max-w-5xl items-center gap-5 px-6 pb-8 pt-12 md:px-12">
                    <div>
                        <h1 className="text-3xl font-medium" style={{ fontFamily: "Georgia, serif" }}>
                            Your Profile
                        </h1>
                        <p className="mt-1 text-sm text-[#555]">
                            Manage your account details and orders
                        </p>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 pb-16 md:px-12 lg:flex-row">

                    {/* LEFT */}
                    <div className="w-full shrink-0 lg:w-72">

                        <div className="profile-info">
                            <h2 className="mb-6 text-base font-semibold text-[#1a4731]">
                                Personal Info
                            </h2>

                            {fields.map((field) => (
                                <FieldRow key={field.key} field={field} />
                            ))}
                        </div>

                        <button onClick={() => navigate("/")} className="logout-btn">
                            Log out
                        </button>
                    </div>

                    {/* RIGHT */}
                    <div className="flex-1">

                        {/* TABS */}
                        <div className="mb-6 flex gap-2">
                            <button
                                onClick={() => setActiveTab("orders")}
                                className="primary"
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
                                className="primary"
                                style={{
                                    background: activeTab === "payment" ? "#7bf1a8" : "white",
                                    color: activeTab === "payment" ? "#1a4731" : "#555",
                                    border: activeTab === "payment" ? "none" : "1px solid #e0e0e0",
                                }}
                            >
                                💳 Payment
                            </button>
                        </div>

                        {/* ORDERS (UPDATED LAYOUT) */}
                        {activeTab === "orders" && (
                            <div className="rounded-2xl border border-[#e0e0e0] bg-white">
                                {pastOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-start justify-between gap-6 p-5 border-b border-[#f0f0f0] last:border-0"
                                    >
                                        {/* LEFT */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold text-[#1a4731]">
                                                    {order.id}
                                                </span>

                                                <span className="rounded-full border border-[#b7f5d0] bg-[#f0fdf4] px-2.5 py-0.5 text-[11px] text-[#2d6a4f]">
                                                    {order.status}
                                                </span>
                                            </div>

                                            <p className="text-xs text-[#999]">{order.date}</p>

                                            <p className="text-sm text-[#555] mt-1">
                                                {order.items}
                                            </p>
                                        </div>

                                        {/* RIGHT (STACKED) */}
                                        <div className="flex flex-col items-end justify-between min-h-full gap-3">
                                            <span className="text-sm font-semibold">
                                                {order.total}
                                            </span>

                                            <button
                                                onClick={() => navigate("/order")}
                                                className="primary"
                                            >
                                                Reorder
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* PAYMENT */}
                        {activeTab === "payment" && (
                            <div className="rounded-2xl border border-[#e0e0e0] bg-white p-8 text-center">
                                <div className="mb-4 text-4xl">💳</div>
                                <p className="mb-2 text-base font-medium">
                                    No payment methods saved
                                </p>
                                <p className="mb-6 text-sm text-[#555]">
                                    Add a card to speed up checkout
                                </p>

                                <button className="primary">
                                    Add payment method
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="mt-8 bg-[#1a4731] px-6 py-12 md:px-12">
                <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="font-semibold text-white">
                                Caffeinated Lions
                            </span>
                        </div>
                        <p className="text-sm text-white/60">
                            Handcrafted with care. Open daily 6am – 8pm.
                        </p>
                    </div>

                    <div className="flex gap-8">
                        {["Menu", "Rewards", "Careers", "Contact"].map((link) => (
                            <a key={link} href="#" className="text-sm text-white/60 hover:text-white">
                                {link}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
                    <p className="text-xs text-white/40">
                        © 2026 Caffeinated Lions. All rights reserved.
                    </p>

                    <div className="flex gap-6">
                        {["Privacy", "Terms", "Cookies"].map((link) => (
                            <a key={link} href="#" className="text-xs text-white/40 hover:text-white/70">
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}