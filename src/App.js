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
import axios from "axios";

export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [play, { stop }] = useSound(fanfareSfx);
  const [rtlCache, setRtlCache] = useState(null);
  const [attendanceId, setAttendanceId] = useState("");
  const [attendance, setAttendance] = useState("");
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


  const fetchData = async () => {
    if (user) {
      try {
        const response = await axios.get(
          `${API_URL}/attendance/view/${user._id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const lastAttendance = response.data.slice(-1)[0];
          setAttendanceId(lastAttendance.id);
          setAttendance(lastAttendance);
        }
      } catch (error) {
        console.error("There is some issue " + error);
      }
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const checkoutEve = async (checkoutData) => {
    if (user) {
      try {
        const response = await axios.post(
          `${API_URL}/attendance/checkout`,
          checkoutData,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          console.log(response, "Successfully submitted attendance");
          const message = "Successfully Check Out";
        }
      } catch (error) {
        console.log(error, "There is some error in submitting data");
      }
    }
  };

  if (token) {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      console.log("Token is expired");

      if (attendance.checkOut === null) {
        if (user && attendanceId) {
          const checkOutData = {
            attendanceId: attendanceId,
            checkOut: new Date().toISOString(),
          };

          checkoutEve(checkOutData);
        }
      }
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

  
  const alertNotification = async (data) => {
    setNotificationMessage(data.message);
    setNotificationOpen(true);
    setSeverity(data.type);
  };
  
  useEffect(() => {
    const socket = io(API_URL);
    
    const handleConnectError = (error) => {
      console.error("Socket connection error:", error);
    };

    const handleNotification = (data) => {
      play();
      alertNotification(data);
      setTimeout(() => {
        stop();
      }, 1000);
    };

    // Add event listeners
    socket.on("connect_error", handleConnectError);
    socket.on("notification", handleNotification);

    // Cleanup function to remove event listeners and disconnect the socket
    return () => {
      socket.off("connect_error", handleConnectError);
      socket.off("notification", handleNotification);
      socket.disconnect();
    };
  }, []);


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
