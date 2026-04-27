import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import HomePage from "./pages/HomePage";
import OrderPage from "./pages/OrderPage";
import RewardsPage from "./pages/RewardsPage";
import ProfilePage from "./pages/ProfilePage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { HeaderMegaMenu } from "./components/HeaderMegaMenu";
import "./App.css";

export default function App() {

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) return;

        try {
            const parsed = JSON.parse(storedUser);

            // 🔥 basic validation so junk/stale data doesn't persist
            if (!parsed?.email) {
                localStorage.removeItem("user");
            }

        } catch {
            // 🔥 corrupt data cleanup
            localStorage.removeItem("user");
        }

        // ⚠️ OPTIONAL (use only if you want FULL reset on every deploy/reload)
        // localStorage.removeItem("user");

    }, []);

    return (
        <BrowserRouter>
            <HeaderMegaMenu />

            <div className="page-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/order" element={<OrderPage />} />
                    <Route path="/rewards" element={<RewardsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />

                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}