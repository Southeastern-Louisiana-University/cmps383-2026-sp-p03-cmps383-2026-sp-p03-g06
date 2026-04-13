import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OrderPage from "./pages/OrderPage";
import RewardsPage from "./pages/RewardsPage";
import ProfilePage from "./pages/ProfilePage";
import { HeaderMegaMenu } from "./components/HeaderMegaMenu";
import "./App.css";

export default function App() {
    return (
        <>
            <HeaderMegaMenu />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/order" element={<OrderPage />} />
                    <Route path="/rewards" element={<RewardsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
