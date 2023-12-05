import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardMedia, MenuItem, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { clearUserAndToken } from "store/authSlice";

// Hr Management Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";

// Hr Management Dashboard React examples
import Breadcrumbs from "examples/Breadcrumbs";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Hr Management Dashboard React context
import {
  useSoftUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

import { useDispatch, useSelector } from "react-redux";
// Images
import { Avatar } from "@mui/material";
import { API_URL } from "config";
import Notification from "./notification";
import axios from "axios";


function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [attendanceId, setAttendanceId] = useState("");
  const [attendance, setAttendance] = useState("");
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const data = useSelector((state) => state.auth);
  const user = data.user;

  console.log(user, "user");

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

      console.log("fetch");
    }
  };

  console.log(attendance, "attendance");

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
      console.log("check out");
    }
  };

  const dispatchRedux = useDispatch();

  const handleClickLogout = async () => {
    dispatchRedux(clearUserAndToken());
    localStorage.clear();
  
    // Update attendance state
    if (user && attendanceId) {
      const checkOutData = {
        attendanceId: attendanceId,
        checkOut: new Date().toISOString(),
      };
  
      try {
        await checkoutEve(checkOutData);
        console.log("Successfully checked out");
      } catch (error) {
        console.error("Error checking out:", error);
      }
    }
  
    // Reload the page
    window.location.reload();
  };
  
  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);

    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <Notification handleCloseMenu={handleCloseMenu} />
    </Menu>
  );

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <SoftBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </SoftBox>
        {isMini ? null : (
          <SoftBox sx={(theme) => navbarRow(theme, { isMini })}>
            <SoftBox sx={{ display: "flex" }} color={light ? "white" : "inherit"}>
              {data.user ? (
                <>
                  <Avatar
                    id="demo-positioned-button"
                    aria-controls={open ? "demo-positioned-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    src={`${API_URL}/${data.user.image}`}
                    alt={data.user.firstName}
                    sx={{
                      width: 30,
                      height: 30,
                      "& img": {
                        height: "100%!important",
                      },
                    }}
                    title={data.user.firstName}
                  />
                  <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <CardMedia
                      component="img"
                      alt="green iguana"
                      sx={{
                        borderRadius: "250px",
                        width: "140px",
                        height: "140px",
                        mx: "auto",
                      }}
                      image={`${API_URL}/${data.user.image}`}
                    />
                    <Typography gutterBottom sx={{ mt: 1 }} align="center" variant="h5">
                      {data.user.userName}
                    </Typography>
                    <Divider />
                    <CardContent>
                      <Stack
                        spacing={0.5}
                        justifyContent="center"
                        sx={{
                          "& li": {
                            justifyContent: "center",
                          },
                        }}
                      >
                        <MenuItem sx={{justifyContent:'center'}} component={Link} to={`/profile`}>Profile</MenuItem>
                        <MenuItem onClick={handleClickLogout}>Logout</MenuItem>
                      </Stack>
                    </CardContent>
                  </Menu>
                </>
              ) : (
                <Link to="/authentication/sign-in">
                  <IconButton sx={navbarIconButton} size="small">
                    <SoftTypography
                      variant="button"
                      fontWeight="medium"
                      color={light ? "white" : "dark"}
                    >
                      Sign in
                    </SoftTypography>
                  </IconButton>
                </Link>
              )}

              <IconButton
                size="small"
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon className={light ? "text-white" : "text-dark"}>
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                aria-controls="Notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon className={light ? "text-white" : "text-dark"}>notifications</Icon>
              </IconButton>
              {renderMenu()}
            </SoftBox>
          </SoftBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
export { useSoftUIController };
