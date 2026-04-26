export default function RewardsPage() {
    return (
        <div className="rewards-page">
            <h2>Your Rewards</h2>

            <div className="points-box">
                <h3>120 Points</h3>
                <p>You're 30 points away from a free drink!</p>
            </div>

            <div className="reward-options">
                <div className="reward-card">
                    <h4>Free Small Coffee</h4>
                    <p>150 points</p>
                </div>

                <div className="reward-card">
                    <h4>$2 Off Any Drink</h4>
                    <p>200 points</p>
                </div>
            </div>
        </div>
    );
}