import React from "react";
import avatar from "../../assets/images/avatars/user.png";
import { useStateContext } from "../../../context/ContextProvider";

const RightSection = ({ children }) => {
  const { currentMode, setMode, openSideMenu } = useStateContext();
  return (
    <div className="right">
      <div className="top">
        <button
          type="button"
          id="menu-btn"
          onClick={() => openSideMenu("open")}
        >
          <span className="material-icons-sharp">menu</span>
        </button>
        <div className="theme-toggler">
          <span
            onClick={() => setMode("Light")}
            className={`material-icons-sharp ${
              currentMode === "Light" && "active"
            }`}
          >
            light_mode
          </span>
          <span
            onClick={() => setMode("Dark")}
            className={`material-icons-sharp ${
              currentMode === "Dark" && "active"
            }`}
          >
            dark_mode
          </span>
        </div>
        <div className="profile">
          <div className="info">
            <p>
              Hey, <b>Bobby</b>
            </p>
            <small className="text-muted">Admin</small>
          </div>
          <div className="avatar">
            <img src={avatar} alt="avatar" />
          </div>
        </div>
      </div>
      <div style={{ marginTop: "1.5rem" }}>
        <div className="container">
          <div className="row">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default RightSection;
