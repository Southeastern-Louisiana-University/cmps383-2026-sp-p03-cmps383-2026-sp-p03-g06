import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HERO_IMAGE =
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&auto=format&fit=crop";
const POUR_IMAGE =
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop";

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
            className="relative min-h-screen flex items-center overflow-hidden"
            style={{ background: "#f9fdf9" }}
        >
            {/* Radial background accents */}
            <div
                className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-25 pointer-events-none"
                style={{
                    background: "radial-gradient(circle, #7bf1a8 0%, transparent 70%)",
                }}
            />
            <div
                className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
                style={{
                    background: "radial-gradient(circle, #7bf1a8 0%, transparent 70%)",
                }}
            />

            {/* Content container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center min-h-[80vh]">
                    {/* LEFT SIDE */}
                    <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {/* Tagline */}
                            <div className="flex items-center gap-3 mb-7">
                                <div className="w-6 h-px" style={{ background: "#2d6a4f" }} />
                                <p
                                    className="text-xs font-semibold tracking-[0.18em] uppercase"
                                    style={{ color: "#2d6a4f" }}
                                >
                                    Welcome to Caffeinated Lions
                                </p>
                            </div>

                            {/* Heading */}
                            <h1
                                className="font-heading font-light leading-[0.95] tracking-tight text-foreground"
                                style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
                            >
                                Find your
                                <br />
                                pride,{" "}
                                <span
                                    className="italic font-normal"
                                    style={{ color: "#1a4731" }}
                                >
                                    in
                                    <br />
                                    every cup.
                                </span>
                            </h1>

                            {/* Description */}
                            <p
                                className="mt-8 text-base md:text-lg leading-relaxed font-light max-w-sm"
                                style={{ color: "#555" }}
                            >
                                Handcrafted drinks that awaken the lion in every sip. Earn rewards, skip the line,
                                and start your morning with a roar!
                            </p>

                            {/* Buttons */}
                            <div className="mt-10 flex flex-wrap gap-4">
                                <a
                                    href="/order"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg group"
                                    style={{ background: "#7bf1a8", color: "#1a4731" }}
                                >
                                    Order now
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </a>

                                
                            </div>

                            {/* Stats */}
                            <div
                                className="mt-14 pt-8 flex gap-10"
                                style={{
                                    borderTop: "0.5px solid rgba(45,106,79,0.15)",
                                }}
                            >
                                {STATS.map((s) => (
                                    <div key={s.label}>
                                        <p className="font-heading text-2xl font-semibold text-foreground">
                                            {s.val}
                                        </p>
                                        <p
                                            className="text-xs tracking-wide uppercase mt-1"
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
                    <div className="lg:col-span-7 relative flex items-center justify-center order-1 lg:order-2">
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
                                className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
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
                                    className="w-full h-full object-cover"
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
                                className="absolute top-6 -right-4 md:-right-10 rounded-2xl px-5 py-4 shadow-xl"
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
                                        className="w-2 h-2 rounded-full animate-pulse"
                                        style={{ background: "#7bf1a8" }}
                                    />
                                    <span
                                        className="text-xs font-semibold tracking-wider uppercase"
                                        style={{ color: "#1a4731" }}
                                    >
                                        Now open
                                    </span>
                                </div>
                            </motion.div>

                            {/* Floating small image */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1 }}
                                className="absolute -bottom-8 -left-4 md:-left-12 w-36 h-36 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl"
                                style={{
                                    border: "4px solid white",
                                    transform: `translate(${mousePos.x * -14}px, ${mousePos.y * -14
                                        }px)`,
                                    transition:
                                        "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                                }}
                            >
                                <img
                                    src={POUR_IMAGE}
                                    alt="Espresso pour"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
