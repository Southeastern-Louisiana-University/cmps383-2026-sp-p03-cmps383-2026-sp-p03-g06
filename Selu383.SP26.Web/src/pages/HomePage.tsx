import HeroSection from "../components/HeroSection";

export default function HomePage() {
    return (
        <div className="bg-white">

            {/* HERO */}
            <HeroSection />

            {/* FEATURED DRINKS */}
            <section className="py-20 px-6 md:px-12 bg-white">
                <div className="text-center mb-12">
                    <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#2d6a4f] mb-3">
                        Featured drinks
                    </p>
                    <h2 className="text-4xl font-medium mb-4">
                        What's popular right now
                    </h2>
                    <p className="text-base text-[#555] max-w-md mx-auto">
                        Fresh seasonal drinks and crowd favorites, ready to order.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[
                        {
                            emoji: "🥪",
                            tag: "Favorite Eats",
                            name: "Travis Special",
                            desc: "Cream cheese, salmon, spinach, and a fried egg served on a freshly toasted bagel",
                            price: "$14.00",
                            popular: true,
                        },
                        {
                            emoji: "☕",
                            tag: "Fan favorite",
                            name: "Supernova",
                            desc: "A unique coffee blend with a complex, balanced profile and subtle sweetness. Delicious as espresso or paired with milk.",
                            price: "$7.95",
                            popular: true,
                        },
                        {
                            emoji: "☕",
                            tag: "New arrival",
                            name: "Roaring Frappe",
                            desc: "Cold brew, milk, and ice blended together with a signature syrup or flavor, topped with whipped cream.",
                            price: "$6.20",
                            popular: false,
                        },
                    ].map((drink) => (
                        <div
                            key={drink.name}
                            className={`relative rounded-xl p-7 bg-[#f9f9f9] border ${drink.popular
                                    ? "border-[#7bf1a8] border-2"
                                    : "border-[#e0e0e0]"
                                }`}
                        >
                            {drink.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7bf1a8] text-[#1a4731] text-[11px] font-medium px-4 py-1 rounded-full whitespace-nowrap">
                                    Most popular
                                </div>
                            )}

                            <div className="w-16 h-16 bg-[#7bf1a8] rounded-full flex items-center justify-center text-3xl mb-5">
                                {drink.emoji}
                            </div>

                            <p className="text-xs uppercase tracking-wide text-[#2d6a4f] font-semibold mb-1">
                                {drink.tag}
                            </p>

                            <p className="text-lg font-semibold mb-2">{drink.name}</p>

                            <p className="text-sm text-[#555] leading-relaxed mb-5">
                                {drink.desc}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold">{drink.price}</span>
                                <a
                                    href="/order"
                                    className="bg-[#7bf1a8] text-[#1a4731] px-5 py-2 rounded-full text-sm font-medium"
                                >
                                    Add to order
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <a
                        href="/order"
                        className="border border-[#ccc] text-black px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-50"
                    >
                        See full menu
                    </a>
                </div>
            </section>

            {/* REWARDS */}
            <section className="bg-[#1a4731] py-20 px-6 md:px-12">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">

                    {/* LEFT */}
                    <div className="flex-1">
                        <p className="text-xs uppercase tracking-[0.08em] text-[#7bf1a8] font-medium mb-3">
                            Lions rewards
                        </p>

                        <h2 className="text-4xl font-medium text-white leading-tight mb-4">
                            Earn stars,<br />get free drinks.
                        </h2>

                        <p className="text-white/70 max-w-md leading-relaxed mb-8">
                            Join Lions Rewards and earn 1 star for every dollar spent.
                            Redeem stars for free drinks, food, and exclusive perks.
                        </p>

                        <div className="flex gap-4">
                            <a
                                href="/rewards"
                                className="bg-[#7bf1a8] text-[#1a4731] px-8 py-3 rounded-full font-medium text-sm"
                            >
                                Join now — it's free
                            </a>

                            <a
                                href="/rewards"
                                className="border border-white/30 text-white px-8 py-3 rounded-full font-medium text-sm"
                            >
                                Learn more
                            </a>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex-1 flex gap-5 justify-center">
                        {[
                            { stat: "1★", label: "Per dollar spent" },
                            { stat: "25★", label: "Free drink reward" },
                            { stat: "2x", label: "Stars on birthdays" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="bg-white/10 border border-white/20 rounded-xl p-6 text-center max-w-[140px] flex-1"
                            >
                                <p className="text-3xl font-semibold text-[#7bf1a8] mb-2">
                                    {item.stat}
                                </p>
                                <p className="text-xs text-white/70">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* QUICK ORDER */}
            <section className="py-20 px-6 md:px-12 bg-white">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">

                    {/* LEFT */}
                    <div className="flex-1">
                        <p className="text-xs uppercase tracking-[0.08em] text-[#2d6a4f] font-medium mb-3">
                            Quick order
                        </p>

                        <h2 className="text-4xl font-medium mb-4">
                            Reorder your favorites in seconds.
                        </h2>

                        <p className="text-base text-[#555] max-w-md leading-relaxed mb-8">
                            Sign in to see your recent orders and reorder with one tap.
                            Skip the line, pick up in store.
                        </p>

                        <a
                            href="/profile"
                            className="bg-[#7bf1a8] text-[#1a4731] px-8 py-3 rounded-full font-medium text-sm"
                        >
                            Sign in to order
                        </a>
                    </div>

                    {/* RIGHT */}
                    <div className="flex-1 flex flex-col gap-4">
                        {[
                            { emoji: "☕", name: "Cold brew cloud", detail: "Large · Sweet cream" },
                            { emoji: "🌿", name: "Matcha oat latte", detail: "Medium · Extra matcha" },
                            { emoji: "🍂", name: "Honey cinnamon flat white", detail: "Small · Oat milk" },
                        ].map((item) => (
                            <div
                                key={item.name}
                                className="bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl p-5 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-[#7bf1a8] rounded-full flex items-center justify-center text-xl">
                                        {item.emoji}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{item.name}</p>
                                        <p className="text-xs text-[#555]">{item.detail}</p>
                                    </div>
                                </div>

                                <a
                                    href="/order"
                                    className="bg-[#7bf1a8] text-[#1a4731] px-5 py-2 rounded-full text-sm font-medium"
                                >
                                    Reorder
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#f9f9f9] border-t border-[#e0e0e0] py-12 px-6 md:px-12">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <p className="text-lg font-semibold">Caffeinated Lions</p>
                        <p className="text-xs text-[#555]">
                            © 2026 Caffeinated Lions. All rights reserved.
                        </p>
                    </div>

                    <div className="flex gap-8">
                        {["Menu", "Rewards", "Careers", "Contact"].map((link) => (
                            <a key={link} href="#" className="text-sm text-[#555]">
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>

        </div>
    );
}
