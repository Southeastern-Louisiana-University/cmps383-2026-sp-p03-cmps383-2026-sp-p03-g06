import FeatureCard from "../components/FeatureCard";

export default function HomePage() {
    return (
        <div className="home-container">
            <div className="feature-section">
                <FeatureCard
                    title="Your day awaits"
                    text="Explore various potential rewards and offers you can redeem with your points."
                    buttonText="Learn More"
                    image="/images/coffee-pour.jpg"
                />

                <FeatureCard
                    title="Quick Order"
                    text="Reorder your favorites"
                    buttonText="Order Now"
                    image="/images/coffee-cups.jpg"
                />
            </div>
        </div>
    );
}