import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import "./SideNavBar.css";
import "./SideNavBarMedia.css";
import { Home, LayoutDashboard, History, User, LogOut } from "lucide-react";

const SideNavBar = ( {onToggle} ) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle(newState); 
  };

  const menuItems = [
    { text: "Home", path: "/home", icon: <Home size={20} /> },
    { text: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { text: "Data History", path: "/history", icon: <History size={20} /> },
    { text: "User Profile", path: "/profile", icon: <User size={20} /> },
  ];

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className={isExpanded ? "side-nav-container" : "side-nav-container side-nav-container-NX"}>
      <div className="nav-upper">
        <div className="nav-heading">
          {isExpanded && (
            <div className="nav-brand">
              <h2>MushKit</h2>
            </div>
          )}
          <button
            className={isExpanded ? "hamburger hamburger-in" : "hamburger hamburger-out"}
            onClick={handleToggle}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div className="nav-menu">
          {menuItems.map(({ text, icon, path }) => (
            <Link
              key={path}
              className={`${isExpanded ? "menu-item" : "menu-item menu-item-NX"} ${location.pathname === path ? "active" : ""}`}
              to={path}
            >
              <span className="menu-item-icon">{icon}</span>
              {isExpanded && <p>{text}</p>}
            </Link>
          ))}
        </div>
      </div>

      <div className="nav-footer">
        {isExpanded && (
          <div className="nav-footer-info">
            {user ? (
              <p className="nav-footer-user-name">{user.email}</p>
            ) : (
              <p className="nav-footer-user-name">Not logged in</p>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className={isExpanded ? "logout-icon" : "logout-icon logout-icon-NX"}
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default SideNavBar;