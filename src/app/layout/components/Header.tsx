import React from "react";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <nav className="top-0 left-0 right-0 border-b bg-white mb-4">
      <Link to={`/`}>
        <h1 className="text-xl font-semibold p-4">Rick & Morty Explorer</h1>
      </Link>
    </nav>
  );
};
