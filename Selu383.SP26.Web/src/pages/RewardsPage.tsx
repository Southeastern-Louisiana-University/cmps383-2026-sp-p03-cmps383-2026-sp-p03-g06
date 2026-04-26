import Logo from '../assets/Caff-logo.png';
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
        <div className="flex min-h-screen flex-col bg-[#f9fdf9]">
            <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 md:px-12">

                {/* PAGE HEADER */}
                <div className="mb-4 flex items-center gap-3">
                    <div className="h-px w-6 bg-[#2d6a4f]" />
                    <p className="tracking-[0.18em] text-xs font-semibold uppercase text-[#2d6a4f]">
                        Lions Rewards
                    </p>
                </div>
                <h1
                    className="mb-10 font-light leading-tight tracking-tight"
                    style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontFamily: "Georgia, serif" }}
                >
                    Your stars, your{" "}
                    <span className="italic text-[#1a4731]">rewards.</span>
                </h1>

                {/* BALANCE CARD */}
                <div className="mb-10 rounded-2xl bg-[#1a4731] p-7">
                    <div className="flex flex-col gap-8 lg:flex-row">

                        {/* LEFT — star count */}
                        <div className="flex-1">
                            <p className="tracking-[0.12em] mb-3 text-xs font-semibold uppercase text-[#7bf1a8]">
                                Current Balance
                            </p>
                            <div className="mb-2 flex items-baseline gap-2">
                                <span className="text-6xl font-light text-[#7bf1a8]">{STARS}</span>
                                <span className="text-lg text-white/70">★ Stars</span>
                            </div>
                            <p className="text-sm text-white/50">Earn 1 star for every $1 spent</p>
                        </div>

                        {/* RIGHT — progress + cap info */}
                        <div className="flex flex-1 flex-col justify-between gap-4">
                            {/* Progress bar */}
                            <div>
                                <div className="mb-2 flex justify-between text-xs text-white/60">
                                    <span>{STARS} stars</span>
                                    <span>Next reward at {NEXT_REWARD} ★</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{ width: `${progress}%`, background: "#7bf1a8" }}
                                    />
                                </div>
                            </div>

                            {/* 10% cap notice */}
                            <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                                <div className="flex gap-2">
                                    <span className="mt-0.5 text-sm text-[#7bf1a8]">ℹ</span>
                                    <p className="text-xs leading-relaxed text-white/70">
                                        Rewards are capped at{" "}
                                        <span className="font-semibold text-white">10% of your total spend.</span>{" "}
                                        Your current max discount is{" "}
                                        <span className="font-semibold text-[#7bf1a8]">${MAX_DISCOUNT.toFixed(2)}.</span>{" "}
                                        You've used{" "}
                                        <span className="font-semibold text-[#7bf1a8]">${USED_DISCOUNT.toFixed(2)}</span>{" "}
                                        of that.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* REDEEM SECTION */}
                <h2 className="mb-5 text-xl font-medium" style={{ fontFamily: "Georgia, serif" }}>
                    Redeem your stars
                </h2>

                <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {rewards.map((reward) => {
                        const canRedeem = STARS >= reward.cost && USED_DISCOUNT < MAX_DISCOUNT;
                        const starsNeeded = reward.cost - STARS;

                        return (
                            <div
                                key={reward.name}
                                className="flex flex-col gap-3 rounded-2xl border border-[#e0e0e0] bg-white p-5"
                            >
                                <div className="flex items-start justify-between">
                                    <span className="text-3xl">{reward.emoji}</span>
                                    <span className="rounded-full border border-[#b7f5d0] bg-[#f0fdf4] px-3 py-1 text-xs font-semibold text-[#2d6a4f]">
                                        ★ {reward.cost} stars
                                    </span>
                                </div>
                                <div>
                                    <p className="mb-1 text-base font-semibold">{reward.name}</p>
                                    <p className="text-sm leading-relaxed text-[#555]">{reward.desc}</p>
                                </div>
                                {canRedeem ? (
                                    <button className="w-full rounded-xl bg-[#7bf1a8] py-3 text-sm font-semibold text-[#1a4731] transition-colors hover:bg-[#5ce090]">
                                        Redeem
                                    </button>
                                ) : USED_DISCOUNT >= MAX_DISCOUNT ? (
                                    <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f5f5f5] py-3 text-sm text-[#aaa]">
                                        🔒 Discount cap reached
                                    </div>
                                ) : (
                                    <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f5f5f5] py-3 text-sm text-[#aaa]">
                                        🔒 Need {starsNeeded} more stars
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* EARN MORE BANNER */}
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#e0e0e0] bg-white p-5">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">⭐</span>
                        <div>
                            <p className="text-sm font-semibold">Want more stars?</p>
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
            <footer className="bg-[#1a4731] px-6 py-12 md:px-12">
                <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row">
                    <div>
                        <div className="flex items-center gap-2">
                            <img
                                src={Logo}
                                alt="Caffeinated Lions Logo"
                                className="rounded-full object-cover"
                                style={{ width: 40, height: 40 }}
                            />
                            <span className="font-semibold text-white">Caffeinated Lions</span>
                        </div>

                        <p className="text-sm text-white/60">Handcrafted with care. Open daily 6am – 8pm.</p>
                    </div>
                    <div className="flex gap-8">
                        {["Menu", "Rewards", "Careers", "Contact"].map((link) => (
                            <a key={link} href="#" className="text-sm text-white/60 transition-colors hover:text-white">{link}</a>
                        ))}
                    </div>
                </div>
                <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
                    <p className="text-xs text-white/40">© 2026 Caffeinated Lions. All rights reserved.</p>
                    <div className="flex gap-6">
                        {["Privacy", "Terms", "Cookies"].map((link) => (
                            <a key={link} href="#" className="text-xs text-white/40 transition-colors hover:text-white/70">{link}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}