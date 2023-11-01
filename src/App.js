import React from "react";
import { useState, useEffect, useMemo } from "react";
// react-router components
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { clearUserAndToken } from "store/authSlice";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { setEmployeeData } from "./store/userStatus"; 

import fanfareSfx from "./assets/sound/notification.wav";

// Hr Management Dashboard React components
import SoftBox from "components/SoftBox";

// Hr Management Dashboard React examples
import Sidenav from "examples/Sidenav";
// import Configurator from "examples/Configurator";

// Hr Management Dashboard React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Hr Management Dashboard React routes
import routes from "routes";

// Hr Management Dashboard React contexts
import { useSoftUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brand from "assets/images/logo-ct.png";
import jwtDecode from "jwt-decode";
import { API_URL } from "config";
import { Alert, AlertTitle, Snackbar } from "@mui/material";
import useSound from "use-sound";

export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [play, { stop }] = useSound(fanfareSfx);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const data = useSelector((state) => state.auth);
  const user = data.user;
  const reduxDispatch = useDispatch();

  // Cache for the rtl
  const isAdmin = user ? user.isAdmin : false;

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const token = localStorage.getItem("token");

  if (token) {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      console.log("Token is expired");
      reduxDispatch(clearUserAndToken());
    }
  }

  const filteredRoutes = isAdmin
    ? routes // If user is an admin, all routes are accessible
    : routes.filter((route) => !route.adminOnly);

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (filteredRoutes) =>
    filteredRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  // Socket start

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  const socket = io(API_URL);

  const alertNotification = async (data) => {
    setNotificationMessage(data.message);
    setNotificationOpen(true);
    setSeverity(data.type);
  };

  socket.on("connect", () => {
    console.log(socket.id, "connect");
  });
  socket.on("disconnect", () => {
    console.log(socket.id);
  });
  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });
  socket.on("notification", (data) => {
    // Handle the 'notification' event here
    play();
    alertNotification(data);
    setTimeout(() => {
      stop();
    }, 1000);
  });

  socket.on("onlineUsers", (data) => {
    console.log(data, "onine Data");
    reduxDispatch(setEmployeeData(data));
  });

  // Socket end

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />
        {layout === "attendence" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={brand}
              brandName="Hr Management Dashboard"
              routes={filteredRoutes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            {/* <Configurator /> */}
            {/* {configsButton} */}
          </>
        )}
        {layout === "vr"}
        <Routes>
          {getRoutes(filteredRoutes)}
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {layout === "attendence" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={brand}
            brandName="Hr Management Dashboard"
            routes={filteredRoutes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          {/* <Configurator /> */}
          {/* {configsButton} */}
        </>
      )}
      {layout === "vr"}
      {/* {isAdmin ? } */}
      <Routes>
        {getRoutes(filteredRoutes)}
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>

      {/* Alert toast */}
      <Snackbar
        autoHideDuration={5000}
        open={notificationOpen}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseNotification} severity={`info`} sx={{ width: "100%" }}>
          <AlertTitle>{severity}</AlertTitle>
          {notificationMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
