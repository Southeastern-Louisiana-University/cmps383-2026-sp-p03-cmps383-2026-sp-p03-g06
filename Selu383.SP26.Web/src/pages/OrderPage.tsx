import DrinkCard from "../components/DrinkCard";

const drinks = [
    { name: "Latte", price: 4.50, image: "/images/latte.jpg" },
    { name: "Cappuccino", price: 4.25, image: "/images/cappuccino.jpg" },
    { name: "Cold Brew", price: 3.95, image: "/images/coldbrew.jpg" },
    { name: "Mocha", price: 4.75, image: "/images/mocha.jpg" },
];

export default function OrderPage() {
    return (
        <div className="order-page">
            <h2>Order Drinks</h2>

            <div className="drink-list">
                {drinks.map((d) => (
                    <DrinkCard key={d.name} {...d} />
                ))}
            </div>
        </div>
    );
}