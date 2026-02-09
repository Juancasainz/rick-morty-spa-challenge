import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export const AppLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 mx-auto w-full max-w-5xl p-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

