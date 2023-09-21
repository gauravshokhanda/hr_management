import * as React from "react";
import { useState } from "react";
import { API_URL } from "../../../config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import { useSoftUIController, dispatchSetToken, setUser } from "context";
import CoverLayout from "layouts/authentication/components/CoverLayout";
// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";
import { Switch, Typography } from "@mui/material";
import { useEffect } from "react";
import { setUserAndToken } from "../../../store/authSlice"; // Update the path
import { clearUserAndToken } from "../../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [controller, dispatch] = useSoftUIController();
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const dispatchRedux = useDispatch();

  const data = useSelector((state) => state.auth);

  const user = data.user;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!userName || !password) {
        setError("Username and password are required");
        console.log("Error set to:", error); // Debugging statement
        return;
      }

      const response = await axios.post(`${API_URL}/employes/login`, {
        userName: userName,
        password: password,
      });

      if (response.status === 200) {
        console.log("Successfully login");
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setError("");
        console.log("Error cleared:", error);
        navigate("/attendence", { replace: true });
        dispatchSetToken(dispatch, response.data.token);
        dispatchRedux(setUserAndToken({ user: response.data.user, token: response.data.token }));
        setUser(dispatch, response.data.user);
        localStorage.removeItem("hasSeenDialog");
      }
    } catch (error) {
      console.error(error, "There is some issue");
      if (error.response.status === 401) {
        setError("Please Enter Correct Username or Password");
      }
    }
  };

  return (
    <CoverLayout
      title={user ? `Welcome ${user.userName}` : 'Welcome Back'}
      description={user ? "" : "Enter your email and password to sign in"}
      image={curved9}
    >
      {!user ? (
        <SoftBox component="form" onSubmit={handleSubmit} role="form">
          <SoftBox mb={2}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Email
              </SoftTypography>
            </SoftBox>
            <SoftInput
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                setError(""); // Clear error when user types
              }}
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
              onChange={(e) => {
                setPassword(e.target.value);
                setError(""); // Clear error when user types
              }}
              type="password"
              placeholder="Password"
            />
          </SoftBox>
          {error && (
            <SoftBox mb={2}>
              <SoftBox mb={1} ml={0.5}>
                <SoftTypography component="label" variant="caption" color="error" fontWeight="bold">
                  {error}
                </SoftTypography>
              </SoftBox>
            </SoftBox>
          )}
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
      ) : (
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <Typography variant="h2">You are already signed in</Typography>
          </SoftBox>
          <SoftBox mb={3} ml={0.5}>
            <Typography variant="h6">Logout to sign-in in another account</Typography>
          </SoftBox>
          <Link to="/attendence">
            <SoftButton variant="contained" color="success">
              Home
            </SoftButton>
          </Link>
        </SoftBox>
      )}
    </CoverLayout>
  );
}

export default SignIn;
