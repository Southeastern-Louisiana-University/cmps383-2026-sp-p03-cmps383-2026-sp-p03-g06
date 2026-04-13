import { Link } from "react-router-dom";

export default function ProfilePage() {
    return (
        <div className="profile-page">
            <h2>Your Profile</h2>

            <div className="profile-info">
                <p><strong>Name:</strong> John Doe</p>
                <p><strong>Email:</strong> john@example.com</p>
                <p><strong>Phone:</strong> (555) 123‑4567</p>
                <p><strong>Birthday:</strong> 01/15/1999</p>
            </div>

            <div className="profile-links">
                <Link to="/orders">Past Orders</Link>
                <Link to="/payment">Payment Methods</Link>
            </div>

            <button className="logout-btn">Log Out</button>
        </div>
    );
}