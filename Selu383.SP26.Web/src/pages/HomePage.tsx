export default function HomePage() {
    return (
        <div>

            {/* HERO */}
            <section style={{ background: "#f9fdf9", display: "flex", alignItems: "center", gap: 64, minHeight: 520, padding: "80px 48px" }}>
                <div style={{ flex: 1, maxWidth: 520 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2d6a4f", marginBottom: 12 }}>
                        Welcome to Caffeinated Lions
                    </p>
                    <h1 style={{ fontSize: 52, fontWeight: 500, lineHeight: 1.15, marginBottom: 20 }}>
                        Your perfect cup,{" "}
                        <span style={{ color: "#2d6a4f" }}>every single day.</span>
                    </h1>
                    <p style={{ fontSize: 16, lineHeight: 1.7, color: "#555", maxWidth: 400, marginBottom: 36 }}>
                        Handcrafted drinks made with care. Earn rewards, skip the line, and start your morning right.
                    </p>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <a href="/order" style={{ background: "#7bf1a8", color: "#1a4731", border: "none", padding: "14px 32px", borderRadius: 24, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
                            Order now
                        </a>
                        <a href="/order" style={{ background: "transparent", color: "#000", border: "1.5px solid #ccc", padding: "13px 32px", borderRadius: 24, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
                            View menu
                        </a>
                    </div>
                </div>
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <div style={{ width: 340, height: 340, borderRadius: "50%", background: "#7bf1a8", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 80, lineHeight: 1 }}>☕</div>
                            <p style={{ fontSize: 18, fontWeight: 500, color: "#1a4731", marginTop: 12 }}>Caffeinated Lions</p>
                        </div>
                        <div style={{ position: "absolute", top: 24, right: 24, background: "white", borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 500, color: "#1a4731", border: "0.5px solid #b7f5d0" }}>
                            Now open
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED DRINKS */}
            <section style={{ padding: "80px 48px", background: "white" }}>
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2d6a4f", marginBottom: 12 }}>Featured drinks</p>
                    <h2 style={{ fontSize: 36, fontWeight: 500, marginBottom: 16 }}>What's popular right now</h2>
                    <p style={{ fontSize: 16, color: "#555", maxWidth: 480, margin: "0 auto" }}>Fresh seasonal drinks and crowd favorites, ready to order.</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 960, margin: "0 auto" }}>

                    {[
                        { emoji: "🌿", tag: "Seasonal", name: "Matcha oat latte", desc: "Ceremonial grade matcha with silky oat milk and a touch of vanilla.", price: "$6.50", popular: false },
                        { emoji: "☁️", tag: "Fan favorite", name: "Cold brew cloud", desc: "Smooth cold brew topped with sweet cream cold foam and caramel.", price: "$7.00", popular: true },
                        { emoji: "🍂", tag: "New arrival", name: "Honey cinnamon flat white", desc: "Double ristretto shots with warm honey, cinnamon, and steamed whole milk.", price: "$6.00", popular: false },
                    ].map((drink) => (
                        <div key={drink.name} style={{ background: "#f9f9f9", borderRadius: 12, padding: 28, border: drink.popular ? "2px solid #7bf1a8" : "0.5px solid #e0e0e0", position: "relative" }}>
                            {drink.popular && (
                                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#7bf1a8", color: "#1a4731", fontSize: 11, fontWeight: 500, padding: "4px 14px", borderRadius: 12, whiteSpace: "nowrap" }}>
                                    Most popular
                                </div>
                            )}
                            <div style={{ width: 64, height: 64, background: "#7bf1a8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 20 }}>
                                {drink.emoji}
                            </div>
                            <p style={{ fontSize: 12, color: "#2d6a4f", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{drink.tag}</p>
                            <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>{drink.name}</p>
                            <p style={{ fontSize: 14, color: "#555", marginBottom: 20, lineHeight: 1.6 }}>{drink.desc}</p>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 18, fontWeight: 500 }}>{drink.price}</span>
                                <a href="/order" style={{ background: "#7bf1a8", color: "#1a4731", border: "none", padding: "10px 20px", borderRadius: 24, fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
                                    Add to order
                                </a>
                            </div>
                        </div>
                    ))}

                </div>
                <div style={{ textAlign: "center", marginTop: 40 }}>
                    <a href="/order" style={{ background: "transparent", color: "#000", border: "1.5px solid #ccc", padding: "13px 32px", borderRadius: 24, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
                        See full menu
                    </a>
                </div>
            </section>

            {/* REWARDS */}
            <section style={{ background: "#1a4731", padding: "80px 48px", display: "flex", alignItems: "center", gap: 64 }}>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "#7bf1a8", marginBottom: 12 }}>Lions rewards</p>
                    <h2 style={{ fontSize: 36, fontWeight: 500, color: "white", marginBottom: 16 }}>Earn stars,<br />get free drinks.</h2>
                    <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: 400, marginBottom: 36, lineHeight: 1.7 }}>
                        Join Lions Rewards and earn 1 star for every dollar spent. Redeem stars for free drinks, food, and exclusive perks.
                    </p>
                    <div style={{ display: "flex", gap: 16 }}>
                        <a href="/rewards" style={{ background: "#7bf1a8", color: "#1a4731", padding: "14px 32px", borderRadius: 24, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
                            Join now — it's free
                        </a>
                        <a href="/rewards" style={{ background: "transparent", color: "white", border: "1.5px solid rgba(255,255,255,0.3)", padding: "13px 32px", borderRadius: 24, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
                            Learn more
                        </a>
                    </div>
                </div>
                <div style={{ flex: 1, display: "flex", gap: 20, justifyContent: "center" }}>
                    {[
                        { stat: "1★", label: "Per dollar spent" },
                        { stat: "25★", label: "Free drink reward" },
                        { stat: "2x", label: "Stars on birthdays" },
                    ].map((item) => (
                        <div key={item.label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "28px 24px", textAlign: "center", border: "0.5px solid rgba(255,255,255,0.12)", flex: 1, maxWidth: 160 }}>
                            <p style={{ fontSize: 36, fontWeight: 500, color: "#7bf1a8", marginBottom: 8 }}>{item.stat}</p>
                            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{item.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* QUICK ORDER */}
            <section style={{ padding: "80px 48px", background: "white" }}>
                <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", gap: 64 }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2d6a4f", marginBottom: 12 }}>Quick order</p>
                        <h2 style={{ fontSize: 36, fontWeight: 500, marginBottom: 16 }}>Reorder your favorites in seconds.</h2>
                        <p style={{ fontSize: 16, color: "#555", marginBottom: 32, maxWidth: 400, lineHeight: 1.7 }}>
                            Sign in to see your recent orders and reorder with one tap. Skip the line, pick up in store.
                        </p>
                        <a href="/profile" style={{ background: "#7bf1a8", color: "#1a4731", padding: "14px 32px", borderRadius: 24, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
                            Sign in to order
                        </a>
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                        {[
                            { emoji: "☕", name: "Cold brew cloud", detail: "Large · Sweet cream" },
                            { emoji: "🌿", name: "Matcha oat latte", detail: "Medium · Extra matcha" },
                            { emoji: "🍂", name: "Honey cinnamon flat white", detail: "Small · Oat milk" },
                        ].map((item) => (
                            <div key={item.name} style={{ background: "#f9f9f9", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", border: "0.5px solid #e0e0e0" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <div style={{ width: 44, height: 44, background: "#7bf1a8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                                        {item.emoji}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 500, fontSize: 15 }}>{item.name}</p>
                                        <p style={{ fontSize: 13, color: "#555" }}>{item.detail}</p>
                                    </div>
                                </div>
                                <a href="/order" style={{ background: "#7bf1a8", color: "#1a4731", padding: "10px 20px", borderRadius: 24, fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
                                    Reorder
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ background: "#f9f9f9", borderTop: "0.5px solid #e0e0e0", padding: 48, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Caffeinated Lions</p>
                    <p style={{ fontSize: 13, color: "#555" }}>© 2026 Caffeinated Lions. All rights reserved.</p>
                </div>
                <div style={{ display: "flex", gap: 32 }}>
                    {["Menu", "Rewards", "Careers", "Contact"].map((link) => (
                        <a key={link} href="#" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>{link}</a>
                    ))}
                </div>
            </footer>

        </div>
    );
}