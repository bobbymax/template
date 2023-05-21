import React from "react";
import "../css/main.css";
import bg from "../assets/images/login-bg.webp";
import logo from "../assets/images/ncdmb-logo.png";

const GuardRoute = ({ children }) => {
  return (
    <div className="guard">
      <div className="left-side">
        <div className="bg-back">
          <img src={bg} alt="Background drop" />
        </div>
      </div>
      <div className="right-side">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="auth">
                <div className="brand">
                  <img
                    src={logo}
                    style={{ width: "60%", margin: "0 auto" }}
                    alt="Brand Logo"
                  />
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardRoute;
