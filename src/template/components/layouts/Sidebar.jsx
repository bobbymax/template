import React from "react";
import logo from "../../assets/images/ncdmb-logo.png";
import { useStateContext } from "../../../context/ContextProvider";

const Sidebar = () => {
  const { openSideMenu } = useStateContext();
  return (
    <aside>
      <div className="top">
        <div className="logo">
          <img src={logo} alt="Brand Logo" />
          <h2>
            NC<span className="warning">DMB</span>
          </h2>
        </div>
        <div
          className="close"
          id="close-btn"
          onClick={() => openSideMenu("close")}
        >
          <span className="material-icons-sharp">close</span>
        </div>
      </div>
      <div className="sidebar">
        <a href="#" className="active">
          <span className="material-icons-sharp">grid_view</span>
          <h3>Dashboard</h3>
        </a>
        <a href="#">
          <span className="material-icons-sharp">people</span>
          <h3>Staff</h3>
        </a>
        <a href="#">
          <span className="material-icons-sharp">receipt_long</span>
          <h3>Report</h3>
        </a>
        <a href="#">
          <span className="material-icons-sharp">insights</span>
          <h3>Insights</h3>
          <span className="message-count">26</span>
        </a>
        <a href="#">
          <span className="material-icons-sharp">mail_outline</span>
          <h3>Mail</h3>
        </a>
        <a href="#">
          <span className="material-icons-sharp">logout</span>
          <h3>Logout</h3>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
