import { useNavigate } from "react-router-dom";

const STARS = 72;
const NEXT_REWARD = 100;
const TOTAL_SPEND = 200; // example total spend
const MAX_DISCOUNT = +(TOTAL_SPEND * 0.10).toFixed(2);
const USED_DISCOUNT = 0;

const rewards = [
    {
        
        name: "Free Bakery Item",
        desc: "A complimentary muffin, croissant, or cookie of your choice.",
        cost: 25,
    },
    {
        
        name: "Free Handcrafted Drink",
        desc: "Any size handcrafted drink — hot, iced, or blended.",
        cost: 50,
    },
    {
        emoji: "⚡",
        name: "Double Stars Day",
        desc: "Earn 2× stars on everything you purchase that day.",
        cost: 100,
    },
    {
        emoji: "🎁",
        name: "Merchandise Item",
        desc: "A branded tumbler, mug, or tote bag from our collection.",
        cost: 150,
    },
];

export default function RewardsPage() {
    const navigate = useNavigate();
    const progress = Math.min((STARS / NEXT_REWARD) * 100, 100);

    return (
        <div className="min-h-screen bg-[#f9fdf9] flex flex-col">
            <div className="flex-1 max-w-3xl mx-auto w-full px-6 md:px-12 py-16">

                {/* PAGE HEADER */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-px bg-[#2d6a4f]" />
                    <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2d6a4f]">
                        Lions Rewards
                    </p>
                </div>
                <h1
                    className="font-light leading-tight tracking-tight mb-10"
                    style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontFamily: "Georgia, serif" }}
                >
                    Your stars, your{" "}
                    <span className="italic text-[#1a4731]">rewards.</span>
                </h1>

                {/* BALANCE CARD */}
                <div className="bg-[#1a4731] rounded-2xl p-7 mb-10">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* LEFT — star count */}
                        <div className="flex-1">
                            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#7bf1a8] mb-3">
                                Current Balance
                            </p>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-6xl font-light text-[#7bf1a8]">{STARS}</span>
                                <span className="text-lg text-white/70">★ Stars</span>
                            </div>
                            <p className="text-sm text-white/50">Earn 1 star for every $1 spent</p>
                        </div>

                        {/* RIGHT — progress + cap info */}
                        <div className="flex-1 flex flex-col justify-between gap-4">
                            {/* Progress bar */}
                            <div>
                                <div className="flex justify-between text-xs text-white/60 mb-2">
                                    <span>{STARS} stars</span>
                                    <span>Next reward at {NEXT_REWARD} ★</span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{ width: `${progress}%`, background: "#7bf1a8" }}
                                    />
                                </div>
                            </div>

                            {/* 10% cap notice */}
                            <div className="bg-white/10 border border-white/10 rounded-xl p-4">
                                <div className="flex gap-2">
                                    <span className="text-[#7bf1a8] mt-0.5 text-sm">ℹ</span>
                                    <p className="text-xs text-white/70 leading-relaxed">
                                        Rewards are capped at{" "}
                                        <span className="text-white font-semibold">10% of your total spend.</span>{" "}
                                        Your current max discount is{" "}
                                        <span className="text-[#7bf1a8] font-semibold">${MAX_DISCOUNT.toFixed(2)}.</span>{" "}
                                        You've used{" "}
                                        <span className="text-[#7bf1a8] font-semibold">${USED_DISCOUNT.toFixed(2)}</span>{" "}
                                        of that.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* REDEEM SECTION */}
                <h2 className="text-xl font-medium mb-5" style={{ fontFamily: "Georgia, serif" }}>
                    Redeem your stars
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {rewards.map((reward) => {
                        const canRedeem = STARS >= reward.cost && USED_DISCOUNT < MAX_DISCOUNT;
                        const starsNeeded = reward.cost - STARS;

                        return (
                            <div
                                key={reward.name}
                                className="bg-white border border-[#e0e0e0] rounded-2xl p-5 flex flex-col gap-3"
                            >
                                <div className="flex items-start justify-between">
                                    <span className="text-3xl">{reward.emoji}</span>
                                    <span className="text-xs font-semibold text-[#2d6a4f] bg-[#f0fdf4] border border-[#b7f5d0] px-3 py-1 rounded-full">
                                        ★ {reward.cost} stars
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold text-base mb-1">{reward.name}</p>
                                    <p className="text-sm text-[#555] leading-relaxed">{reward.desc}</p>
                                </div>
                                {canRedeem ? (
                                    <button className="w-full bg-[#7bf1a8] text-[#1a4731] font-semibold text-sm py-3 rounded-xl hover:bg-[#5ce090] transition-colors">
                                        Redeem
                                    </button>
                                ) : USED_DISCOUNT >= MAX_DISCOUNT ? (
                                    <div className="w-full bg-[#f5f5f5] text-[#aaa] text-sm py-3 rounded-xl flex items-center justify-center gap-2">
                                        🔒 Discount cap reached
                                    </div>
                                ) : (
                                    <div className="w-full bg-[#f5f5f5] text-[#aaa] text-sm py-3 rounded-xl flex items-center justify-center gap-2">
                                        🔒 Need {starsNeeded} more stars
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* EARN MORE BANNER */}
                <div className="bg-white border border-[#e0e0e0] rounded-2xl p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">⭐</span>
                        <div>
                            <p className="font-semibold text-sm">Want more stars?</p>
                            <p className="text-xs text-[#555]">Order a drink today and earn stars instantly. Bonus stars on your birthday!</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/order")}
                        className="bg-[#7bf1a8] text-[#1a4731] font-semibold text-sm px-6 py-3 rounded-full whitespace-nowrap hover:bg-[#5ce090] transition-colors"
                    >
                        Order now
                    </button>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-[#1a4731] py-12 px-6 md:px-12">
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