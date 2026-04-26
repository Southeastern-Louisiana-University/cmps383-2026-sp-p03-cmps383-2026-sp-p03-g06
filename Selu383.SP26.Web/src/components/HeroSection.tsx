import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HERO_IMAGE =
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&auto=format&fit=crop";

const STATS = [
    { val: "2k+", label: "Happy customers" },
    { val: "4.9★", label: "Store rating" },
    
];

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            setMousePos({ x, y });
        };

        const el = containerRef.current;
        if (el) el.addEventListener("mousemove", handleMouseMove);

        return () => {
            if (el) el.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative flex min-h-screen items-center overflow-hidden"
            style={{ background: "#f9fdf9" }}
        >
            {/* Radial background accents */}
            <div
                className="pointer-events-none absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full opacity-25"
                style={{
                    background: "radial-gradient(circle, #7bf1a8 0%, transparent 70%)",
                }}
            />
            <div
                className="pointer-events-none absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full opacity-15"
                style={{
                    background: "radial-gradient(circle, #7bf1a8 0%, transparent 70%)",
                }}
            />

            {/* Content container */}
            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-24 md:px-12">
                <div className="grid min-h-[80vh] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-6">
                    {/* LEFT SIDE */}
                    <div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {/* Tagline */}
                            <div className="mb-7 flex items-center gap-3">
                                <div className="h-px w-6" style={{ background: "#2d6a4f" }} />
                                <p
                                    className="tracking-[0.18em] text-xs font-semibold uppercase"
                                    style={{ color: "#2d6a4f" }}
                                >
                                    Welcome to Caffeinated Lions
                                </p>
                            </div>

                            {/* Heading */}
                            <h1
                                className="font-heading leading-[0.95] text-foreground font-light tracking-tight"
                                style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
                            >
                                Find your
                                <br />
                                pride,{" "}
                                <span
                                    className="font-normal italic"
                                    style={{ color: "#1a4731" }}
                                >
                                    in
                                    <br />
                                    every cup.
                                </span>
                            </h1>

                            {/* Description */}
                            <p
                                className="mt-8 max-w-sm text-base font-light leading-relaxed md:text-lg"
                                style={{ color: "#555" }}
                            >
                                Handcrafted drinks that awaken the lion in every sip. Earn rewards, skip the line,
                                and start your morning with a roar!
                            </p>

                            {/* Buttons */}
                            <div className="mt-10 flex flex-wrap gap-4">
                                <a
                                    href="/order"
                                    className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg"
                                    style={{ background: "#7bf1a8", color: "#1a4731" }}
                                >
                                    Order now
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </a>

                                
                            </div>

                            {/* Stats */}
                            <div
                                className="mt-14 flex gap-10 pt-8"
                                style={{
                                    borderTop: "0.5px solid rgba(45,106,79,0.15)",
                                }}
                            >
                                {STATS.map((s) => (
                                    <div key={s.label}>
                                        <p className="font-heading text-foreground text-2xl font-semibold">
                                            {s.val}
                                        </p>
                                        <p
                                            className="mt-1 text-xs uppercase tracking-wide"
                                            style={{ color: "#999" }}
                                        >
                                            {s.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT SIDE — Images */}
                    <div className="relative order-1 flex items-center justify-center lg:order-2 lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 1,
                                ease: [0.22, 1, 0.36, 1],
                                delay: 0.2,
                            }}
                            className="relative w-full max-w-lg lg:max-w-none"
                        >
                            {/* Main image */}
                            <div
                                className="relative overflow-hidden rounded-[2.5rem] shadow-2xl"
                                style={{
                                    aspectRatio: "4/5",
                                    transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6
                                        }px)`,
                                    transition:
                                        "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
                                }}
                            >
                                <img
                                    src={HERO_IMAGE}
                                    alt="Coffee"
                                    className="h-full w-full object-cover"
                                />
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            "linear-gradient(to top, rgba(26,71,49,0.3) 0%, transparent 50%)",
                                    }}
                                />
                            </div>

                            {/* Floating badge */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 }}
                                className="absolute -right-4 top-6 rounded-2xl px-5 py-4 shadow-xl md:-right-10"
                                style={{
                                    background: "rgba(255,255,255,0.85)",
                                    backdropFilter: "blur(16px)",
                                    border: "0.5px solid rgba(123,241,168,0.4)",
                                    transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10
                                        }px)`,
                                    transition:
                                        "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-2 w-2 animate-pulse rounded-full"
                                        style={{ background: "#7bf1a8" }}
                                    />
                                    <span
                                        className="text-xs font-semibold uppercase tracking-wider"
                                        style={{ color: "#1a4731" }}
                                    >
                                        Now open
                                    </span>
                                </div>
                            </motion.div>

                            
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
