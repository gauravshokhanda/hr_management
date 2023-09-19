import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../layouts/store/actions";
import { API_URL } from "../../../config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import { useSoftUIController, setUser, setToken } from "../../../context/index";
import * as yup from "yup";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";
// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";
import { Switch } from "@mui/material";

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  // Define Yup validation schema
  const validationSchema = yup.object().shape({
    userName: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

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
        setError(""); // Clear any previous errors
        console.log("Error cleared:", error); // Debugging statement
        navigate("/attendence", { replace: true });
      } else if (response.status === 401) {
        setError("Please Enter Correct Username or Password");
        console.log("Error set to:", error); // Debugging statement
      }
    } catch (error) {
      console.error(error, "There is some issue");
    }
  };
  
  console.log("Error right before rendering:", error);
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
    </CoverLayout>
  );
}

export default SignIn;
