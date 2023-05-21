import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { collection } from "../controllers";
import Loading from "../template/components/Loading";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const user = useSelector((state) => state?.auth?.value?.user);

  const [screenSize, setScreenSize] = useState(undefined);
  const [currentMode, setCurrentMode] = useState("Light");
  const [navigation, setNavigation] = useState([]);
  const [activeMenu, setActiveMenu] = useState(true);
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState(null);

  const setMode = (mode) => {
    setCurrentMode(mode);
    if (mode === "Dark") {
      document.body.classList.add("dark-theme-variables");
    } else {
      document.body.classList.remove("dark-theme-variables");
    }
    localStorage.setItem("themeMode", mode);
  };

  const openSideMenu = (action) => {
    const sidebar = document.querySelector("aside");
    action === "open"
      ? (sidebar.style.display = "block")
      : (sidebar.style.display = "none");
  };

  const showLoader = () => {
    return loading ? <Loading /> : null;
  };

  useEffect(() => {
    setAuth(user);
  }, [user]);

  useEffect(() => {
    if (auth !== null) {
      const { roles } = auth;

      try {
        collection("modules")
          .then((res) => {
            const response = res.data.data;
            const accessible = response?.filter((mod) =>
              mod?.roles?.some((rle) => roles?.includes(rle))
            );
            setNavigation(accessible);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  }, [auth]);

  // console.log(navigation);

  return (
    <StateContext.Provider
      value={{
        auth,
        loading,
        setLoading,
        showLoader,
        currentMode,
        activeMenu,
        screenSize,
        setScreenSize,
        setActiveMenu,
        setCurrentMode,
        openSideMenu,
        setMode,
        navigation,
        setNavigation,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
