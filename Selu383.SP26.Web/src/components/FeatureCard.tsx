type FeatureCardProps = {
    title: string;
    text: string;
    buttonText: string;
    image: string;
};

export default function FeatureCard({ title, text, buttonText, image }: FeatureCardProps) {
    return (
        <div className="feature-card">
            <img src={image} alt={title} />

            <div className="feature-content">
                <h2>{title}</h2>
                <p>{text}</p>
                <button>{buttonText}</button>
            </div>
        </div>
    );
}
