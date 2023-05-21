import React from "react";
import avatar from "../../assets/images/avatars/user.png";
import { useStateContext } from "../../../context/ContextProvider";
import { useNavigate } from "react-router-dom";

const ContentSection = ({ children, title = "" }) => {
  const { auth, currentMode, setMode, openSideMenu } = useStateContext();
  const navigate = useNavigate();
  return (
    <main className="main___content__section">
      <div className="top__header">
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
                  Hey, <b>{auth?.name}</b>
                </p>
                <small className="text-muted">Admin</small>
              </div>
              <div className="avatar">
                <img src={avatar} alt="avatar" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <h2>{title}</h2>
              <button type="button" onClick={() => navigate(-1)}>
                <span className="material-icons-sharp">arrow_back</span>
              </button>
            </div>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
};

export default ContentSection;
