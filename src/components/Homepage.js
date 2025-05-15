import React, { useState } from "react";
import Carousel from 'react-bootstrap/Carousel';
import SideNavBar from "../static/SideNavBar";
import "../component styles/Homepage.css";
import "../component styles/HomepageMedia.css";
import usePreventBackNavigation from "../hooks/usePreventBackNavigation";
import 'bootstrap/dist/css/bootstrap.min.css';

import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';
import MushKitPDF from '../assets/MushKitPDF.pdf';

const Home = () => {
  usePreventBackNavigation();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="home-container">
      <SideNavBar onToggle={setIsSidebarExpanded} />
      <div className={`home-header ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <h1>Home</h1>
        <a href={MushKitPDF} download="MushKitPDF.pdf" style={{ textDecoration: 'none' }}>
          <button className="download-btn">
            Download PDF
          </button>
        </a>
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {[img1, img2, img3, img4, img5].map((image, idx) => (
            <Carousel.Item key={idx}>
              <img
                className="d-block w-100"
                src={image}
                alt={`Slide ${idx + 1}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Home;
