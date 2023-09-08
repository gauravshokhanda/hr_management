import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import curved6 from "assets/images/curved-images/curved14.jpg";
import { Grid } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../../config";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    isAdmin: false,
    isStaff: false,
    salary: "",
    dateOfJoining: new Date(),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  const data = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    userName: formData.userName,
    password:formData.password,
    isAdmin: formData.isAdmin, 
    isStaff: formData.isStaff,
    salary: formData.salary,
    dateOfJoining: formData.dateOfJoining,
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/employes/register`, data);

      console.log("Registration successful", response.data);

      setFormData({
        firstName: "",
        lastName: "",
        userName: "",
        password: "",
        isAdmin: false,
        isStaff: false,
        salary: "",
      });
    } catch (error) {
      console.error("Registration failed", error);
    }
  };
  return (
    <BasicLayout
      title="Welcome!"
      description="Use these awesome forms to login or create new account in your project for free."
      image={curved6}
    >
      <Card>
        <SoftBox p={3} mb={1} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            Register
          </SoftTypography>
        </SoftBox>
        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox component="form" role="form" onSubmit={handleSubmit}>
            <SoftBox mb={2}>
              <SoftInput
              name='firstName'
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
              name='lastName'
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
              name='userName'
                value={formData.userName}
                onChange={handleChange}
                placeholder="User Name"
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
              name='salary'
                value={formData.salary}
                onChange={handleChange}
                type="number"
                placeholder="Salary"
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
              name='password'
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
              />
            </SoftBox>
            <Grid container>
              <Grid item xs={6}>
                <label>
                  <Checkbox name="isAdmin" checked={formData.isAdmin} onChange={handleChange} />
                  <SoftTypography
                    variant="button"
                    fontWeight="regular"
                    sx={{ cursor: "pointer", userSelect: "none" }}
                  >
                    &nbsp;Is Admin
                  </SoftTypography>
                </label>
              </Grid>
              <Grid item xs={6}>
                <label>
                  <Checkbox name="isStaff" checked={formData.isStaff} onChange={handleChange} />
                  <SoftTypography
                    variant="button"
                    fontWeight="regular"
                    sx={{ cursor: "pointer", userSelect: "none" }}
                  >
                    &nbsp;Is Staff
                  </SoftTypography>
                </label>
              </Grid>
            </Grid>

            <SoftBox mt={4} mb={1}>
              <SoftButton variant="gradient" type="submit" color="dark" fullWidth>
                Register
              </SoftButton>
            </SoftBox>
            <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="button" color="text" fontWeight="regular">
                Already have an account?&nbsp;
                <SoftTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
                >
                  Sign in
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default Register;
