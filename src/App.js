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

// Hr Management Dashboard React components
import SoftBox from "components/SoftBox";

// Hr Management Dashboard React examples
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

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

export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
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

  const configsButton = (
    <SoftBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </SoftBox>
  );

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
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(filteredRoutes)}
          <Route path="*" element={<Navigate to="/attendence" />} />
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
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      {/* {isAdmin ? } */}
      <Routes>
        {getRoutes(filteredRoutes)}
        <Route path="*" element={<Navigate to="/attendence" />} />
      </Routes>
    </ThemeProvider>
  );
}
