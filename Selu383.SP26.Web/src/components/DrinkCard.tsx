import "./DrinkCard.css";

type DrinkCardProps = {
    name: string;
    price: number;
    image: string;
};

export default function DrinkCard({ name, price, image }: DrinkCardProps) {
    return (
        <div className="drink-card">
            <img src={image} alt={name} />

            <div className="drink-info">
                <h3>{name}</h3>
                <p>${price.toFixed(2)}</p>
            </div>

            <button className="add-btn">Add</button>
        </div>
    );
}