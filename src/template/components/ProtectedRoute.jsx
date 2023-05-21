/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import "../css/template.css";
import Sidebar from "./layouts/Sidebar";
import ContentSection from "./sections/ContentSection";
import { routes } from "../../routes";

const ProtectedRoute = ({ children }) => {
  const { auth, navigation } = useStateContext();
  const { pathname } = useLocation();

  const [page, setPage] = useState(null);
  const [mod, setMod] = useState(null);

  useEffect(() => {
    if (auth !== null && routes?.protected?.length > 0 && pathname !== "") {
      const pg = routes?.protected?.filter((nav) => nav?.url === pathname)[0];
      setPage(pg);
    }
  }, [auth, routes, pathname]);

  useEffect(() => {
    if (page !== null) {
      const md = navigation?.filter((nav) => nav?.url === page?.url);
      const exists = md?.length > 0 ? md[0] : null;

      if (exists !== null) {
        if (exists?.type === "application") {
          setMod(exists);
        } else {
          setMod(navigation?.filter((nav) => nav?.id == exists?.parentId)[0]);
        }
      } else {
        setMod(null);
      }
    }
  }, [page]);

  return (
    <div className="wrapper">
      {/* Sidebar Here */}
      <Sidebar />
      {auth ? (
        <ContentSection title={page?.name}>
          <div className="content">
            <div className="mb-5">{children}</div>
            {mod !== null && mod?.children?.length > 0 && (
              <div className="page__navigation">
                <nav>
                  <ul>
                    {mod?.children?.map((menu, i) => (
                      <li key={i} className="nav__lists">
                        <Link
                          to={menu?.url}
                          className={`nav__links ${
                            pathname === menu?.url && "nav__active__link"
                          }`}
                        >
                          <div className="navigation__card">
                            <span className="material-icons-sharp">
                              {menu.icon}
                            </span>
                            <small>{menu?.name}</small>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </ContentSection>
      ) : (
        <Navigate to="/auth/login" />
      )}
    </div>
  );
};

export default ProtectedRoute;
