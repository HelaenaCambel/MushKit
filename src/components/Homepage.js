import React, { useState } from "react";
import SideNavBar from "../static/SideNavBar";
import "../component styles/Homepage.css";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";

const Home = () => {
  usePreventBackNavigation(); 

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="home-container">
      <SideNavBar onToggle={setIsSidebarExpanded} />
      <div className={`page-header ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <h1>Home</h1>
      </div>
    </div>
  );
};

export default Home;