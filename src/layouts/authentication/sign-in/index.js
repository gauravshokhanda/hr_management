import * as React from "react";
import { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../layouts/store/actions"; 
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { API_URL } from "../../../config";
import axios from "axios";
import Switch from "@mui/material/Switch";
import { Link, useNavigate } from "react-router-dom";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import { useSoftUIController, setUser, setToken } from "../../../context/index";

// react-router-dom components

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";
// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";
import NoticeBoard from "layouts/noticeBoard";
import { DialogContent } from "@mui/material";

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [open, setOpen] = useState(false);
  const [buttonShow, setButtonShow] = useState(false);
  const [signInTrue, setSignInTrue] = useState(false);

  const handleCloseAfterDelay = () => {
    setTimeout(() => {
      setButtonShow(true);
    }, 3000);
  };

  const handleClickOpen = () => {
    setOpen(true);
    setButtonShow(false);
    handleCloseAfterDelay();
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/notice", { replace: true });
    setSignInTrue(false);
  };

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const navigate = useNavigate();

  const handleUserName = (event) => {
    const { value } = event.target;
    setUserName(value);
  };

  const handlePassword = (event) => {
    const { value } = event.target;
    setPassword(value);
    console.log(value, "Password");
  };

  const loginData = {
    userName: userName,
    password: password,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!userName || !password) {
        console.error("Username and password are required");
        return;
      }
  
      const response = await axios.post(`${API_URL}/employes/login`, loginData);
      if (response.status === 200) {
        console.log("Successfully login");
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
    
        handleClickOpen();
        setSignInTrue(true);
      }
      console.log(response.data.user, "Response");
    } catch (error) {
      console.error(error, "There is some issue");
    }
  };

  return (
    <CoverLayout
      title="Welcome back"
      description="Enter your email and password to sign in"
      image={curved9}
    >
      <SoftBox component="form" onSubmit={handleSubmit} role="form">
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Email
            </SoftTypography>
          </SoftBox>
          <SoftInput
            value={userName}
            onChange={handleUserName}
            type="text"
            placeholder="Username"
          />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Password
            </SoftTypography>
          </SoftBox>
          <SoftInput
            value={password}
            onChange={handlePassword}
            type="password"
            placeholder="Password"
          />
        </SoftBox>
        <SoftBox display="flex" alignItems="center">
          <Switch checked={rememberMe} onChange={handleSetRememberMe} />
          <SoftTypography
            variant="button"
            fontWeight="regular"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            &nbsp;&nbsp;Remember me
          </SoftTypography> 
        </SoftBox>
        <SoftBox mt={4} mb={1}>
          <SoftButton type="submit" variant="gradient" color="info" fullWidth>
            sign in
          </SoftButton>
        </SoftBox>
      </SoftBox>

      {/* Modal */}
      <Dialog fullScreen open={open} onClose={null}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            {buttonShow && (
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        <DialogContent>
          <NoticeBoard signInTrue={signInTrue} />
        </DialogContent>
      </Dialog>
    </CoverLayout>
  );
}

export default SignIn;
