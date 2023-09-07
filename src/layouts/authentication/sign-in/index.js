import { useEffect, useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Hr Management Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import axios from "axios";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";
import { API_URL } from "../../../config";

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleUserName = (event) => {
    const { value } = event.target;
    setUserName(value);
    console.log(value, "Username");
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
      console.log(response.data, "Response");
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
    </CoverLayout>
  );
}

export default SignIn;
