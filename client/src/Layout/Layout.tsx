import React from "react";
import { Link } from "react-router-dom";
import { Feedback } from "../components";
import "./layout.less";

const Layout: React.FC = ({ children }) => {
  return (
    <div className="layoutContainer">
      <div id="navbar">
        <Link className="logo" to="/">
          <img
            className="icon"
            src="https://storage.googleapis.com/givespace-pictures/Logo%20Rounded.png"
            alt="kuoly"
          />
          <div>
            Kuo<span className="secondary-text">ly</span>
          </div>
        </Link>
        <div className="routes">
          <Link to={`/`}>My Lists</Link>
          <Link to={`/`}>Make a List</Link>
        </div>
      </div>
      <div className="false-nav" />
      {children}
      <div id="footer">
        <div className="footer-text">
          Got questions or comments? Contact us at{" "}
          <strong>contact@kuoly.com</strong>
        </div>
        <Feedback />
      </div>
    </div>
  );
};

export default Layout;
