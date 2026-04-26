import HeroSection from "../components/HeroSection";

export default function HomePage() {
    return (
        <div className="bg-white">

            {/* HERO */}
            <HeroSection />

            {/* FEATURED DRINKS */}
            <section className="bg-white px-6 py-20 md:px-12">
                <div className="mb-12 text-center">
                    <p className="tracking-[0.08em] mb-3 text-xs font-semibold uppercase text-[#2d6a4f]">
                        Featured drinks
                    </p>
                    <h2 className="mb-4 text-4xl font-medium">
                        What's popular right now
                    </h2>
                    <p className="mx-auto max-w-md text-base text-[#555]">
                        Fresh seasonal drinks and crowd favorites, ready to order.
                    </p>
                </div>

                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
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
                                <div className="-translate-x-1/2 absolute -top-3 left-1/2 whitespace-nowrap rounded-full bg-[#7bf1a8] px-4 py-1 font-medium text-[#1a4731] text-[11px]">
                                    Most popular
                                </div>
                            )}

                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#7bf1a8] text-3xl">
                                {drink.emoji}
                            </div>

                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#2d6a4f]">
                                {drink.tag}
                            </p>

                            <p className="mb-2 text-lg font-semibold">{drink.name}</p>

                            <p className="mb-5 text-sm leading-relaxed text-[#555]">
                                {drink.desc}
                            </p>

                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold">{drink.price}</span>
                                <a
                                    href="/order"
                                    className="rounded-full bg-[#7bf1a8] px-5 py-2 text-sm font-medium text-[#1a4731]"
                                >
                                    Add to order
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <a
                        href="/order"
                        className="rounded-full border border-[#ccc] px-8 py-3 text-sm font-medium text-black hover:bg-gray-50"
                    >
                        See full menu
                    </a>
                </div>
            </section>

            {/* REWARDS */}
            <section className="bg-[#1a4731] px-6 py-20 md:px-12">
                <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 lg:flex-row">

                    {/* LEFT */}
                    <div className="flex-1">
                        <p className="tracking-[0.08em] mb-3 text-xs font-medium uppercase text-[#7bf1a8]">
                            Lions rewards
                        </p>

                        <h2 className="mb-4 text-4xl font-medium leading-tight text-white">
                            Earn stars,<br />get free drinks.
                        </h2>

                        <p className="mb-8 max-w-md leading-relaxed text-white/70">
                            Join Lions Rewards and earn 1 star for every dollar spent.
                            Redeem stars for free drinks, food, and exclusive perks.
                        </p>

                        <div className="flex gap-4">
                            <a
                                href="/rewards"
                                className="rounded-full bg-[#7bf1a8] px-8 py-3 text-sm font-medium text-[#1a4731]"
                            >
                                Join now — it's free
                            </a>

                            <a
                                href="/rewards"
                                className="rounded-full border border-white/30 px-8 py-3 text-sm font-medium text-white"
                            >
                                Learn more
                            </a>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-1 justify-center gap-5">
                        {[
                            { stat: "1★", label: "Per dollar spent" },
                            { stat: "25★", label: "Free drink reward" },
                            { stat: "2x", label: "Stars on birthdays" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="max-w-[140px] flex-1 rounded-xl border border-white/20 bg-white/10 p-6 text-center"
                            >
                                <p className="mb-2 text-3xl font-semibold text-[#7bf1a8]">
                                    {item.stat}
                                </p>
                                <p className="text-xs text-white/70">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* QUICK ORDER */}
            <section className="bg-white px-6 py-20 md:px-12">
                <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 lg:flex-row">

                    {/* LEFT */}
                    <div className="flex-1">
                        <p className="tracking-[0.08em] mb-3 text-xs font-medium uppercase text-[#2d6a4f]">
                            Quick order
                        </p>

                        <h2 className="mb-4 text-4xl font-medium">
                            Reorder your favorites in seconds.
                        </h2>

                        <p className="mb-8 max-w-md text-base leading-relaxed text-[#555]">
                            Sign in to see your recent orders and reorder with one tap.
                            Skip the line, pick up in store.
                        </p>

                        <a
                            href="/profile"
                            className="rounded-full bg-[#7bf1a8] px-8 py-3 text-sm font-medium text-[#1a4731]"
                        >
                            Sign in to order
                        </a>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-1 flex-col gap-4">
                        {[
                            { emoji: "☕", name: "Supernova", detail: "Large · Sweet cream" },
                            { emoji: "🌿", name: "Green Machine", detail: "Medium · Extra matcha" },
                            { emoji: "🍂", name: "Strawberry Limeade", detail: "Small · Oat milk" },
                        ].map((item) => (
                            <div
                                key={item.name}
                                className="flex items-center justify-between rounded-xl border border-[#e0e0e0] bg-[#f9f9f9] p-5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7bf1a8] text-xl">
                                        {item.emoji}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <p className="text-xs text-[#555]">{item.detail}</p>
                                    </div>
                                </div>

                                <a
                                    href="/order"
                                    className="rounded-full bg-[#7bf1a8] px-5 py-2 text-sm font-medium text-[#1a4731]"
                                >
                                    Reorder
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-[#e0e0e0] bg-[#f9f9f9] px-6 py-12 md:px-12">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
                    <div>
                        <p className="text-lg font-semibold">Caffeinated Lions</p>
                        <p className="text-xs text-[#555]">
                            © 2026 Caffeinated Lions. All rights reserved.
                        </p>
                    </div>

                    <div className="flex gap-8">
                        {[].map((link) => (
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
