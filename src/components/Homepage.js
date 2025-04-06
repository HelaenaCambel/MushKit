import React from "react";
import SideNavBar from "../static/SideNavBar";
import "../component styles/Homepage.css";

const Home = () => {
  return (
    <div className="home-container">
      <SideNavBar />
      <div>
        <h1>Home</h1>
      </div>
    </div>
  );
};

export default Home;