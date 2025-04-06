import React from "react";
import SideNavBar from "../static/SideNavBar";

const Home = () => {
  return (
    <div className="dashboard-container" style={{ display: "flex" }}>
      <SideNavBar />
      <div className="dashboard-content" style={{ flex: 1, padding: "20px" }}>
        <h1>Home</h1>
      </div>
    </div>
  );
};

export default Home;