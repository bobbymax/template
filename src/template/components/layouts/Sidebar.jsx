/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import logo from "../../assets/images/ncdmb-logo.png";
import { useStateContext } from "../../../context/ContextProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { splitRoute } from "../../../services/helpers";
import { useDispatch } from "react-redux";
import { disembark } from "../../../features/userSlice";

const Sidebar = () => {
  const { openSideMenu, navigation } = useStateContext();
  const { pathname } = useLocation();
  const [url, setUrl] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(disembark());
    navigate("/");
  };

  useEffect(() => {
    setUrl(splitRoute(pathname));
  }, [pathname]);

  return (
    <aside>
      <div className="top">
        <div className="logo">
          <img src={logo} alt="Brand Logo" />
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
        <Link
          to="/"
          className={`${url === "/" ? "active" : ""}`}
          title="Insights"
        >
          <span className="material-icons-sharp">dashboard</span>
          <h3>Insights</h3>
        </Link>
        {navigation
          .filter((nav) => nav?.type === "application")
          .map((nav, i) => (
            <Link
              to={nav.url}
              key={i}
              className={nav.url === url ? "active" : ""}
              title={nav.name}
            >
              <span className="material-icons-sharp">{nav.icon}</span>
              <h3>{nav.name}</h3>
            </Link>
          ))}
        <Link to="#" onClick={logout}>
          <span className="material-icons-sharp">logout</span>
          <h3>Logout</h3>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
