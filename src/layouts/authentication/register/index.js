import { useEffect, useState } from "react";
// react-router-dom components
import { Link, useNavigate, useParams } from "react-router-dom";

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
import { Box, Button, Grid, Input, Typography } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../../config";

function Register() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if 'id' is available and fetch employee data if it exists
    if (id) {
      axios
        .get(`${API_URL}/employes/view/${id}`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const employeeData = response.data;
          setFormData({
            ...employeeData,
          });
          console.log(employeeData, "Employee data register");
        })
        .catch((error) => {
          console.error("Error fetching employee data", error);
        });
    }
  }, [id]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    isAdmin: false,
    isStaff: false,
    salary: "",
    dateOfJoining: "",
    image: "",
    userEmail: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImgPath, setSelectedImgPath] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log(file, "Selected image");
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      console.log(imageUrl, "Selected image URL");
      setSelectedImgPath(imageUrl);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      if (selectedImage) {
        formDataToSend.append("image", selectedImage, selectedImage.name);
      }
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("userName", formData.userName);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("isAdmin", formData.isAdmin);
      formDataToSend.append("isStaff", formData.isStaff);
      formDataToSend.append("salary", formData.salary);
      formDataToSend.append("userEmail", formData.userEmail);

      const response = id
        ? await axios.put(`${API_URL}/employes/update/${id}`, formDataToSend)
        : await axios.post(`${API_URL}/employes/register`, formDataToSend);

      console.log(`Employee ${id ? 'updated' : 'registered'} successfully`);
      navigate("/attendence", { replace: true });

      setFormData({
        firstName: "",
        lastName: "",
        userName: "",
        password: "",
        isAdmin: false,
        isStaff: false,
        salary: "",
        userEmail: "",
        image: "",
      });

      setSelectedImage("");
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
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="User Name"
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                type="email"
                placeholder="User Email"
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                type="number"
                placeholder="Salary"
              />
            </SoftBox>
            <SoftBox mb={2}>
              <Box
                sx={{
                  padding: "20px",
                  border: "0.0625rem solid #d2d6da",
                  borderRadius: "0.5rem!important",
                  display: "flex",
                  alignItems: "center",
                  gap: "22px",
                }}
              >
                <Box>
                  <Typography sx={{ mb: 1 }} variant="h5">
                    Upload an Image
                  </Typography>
                  <Input
                  name="image"
                    accept="image/*"
                    type="file"
                    id="image-input"
                    onChange={handleImageChange}
                    sx={{ display: "none!important" }}
                  />

                  <label htmlFor="image-input">
                    <Button variant="contained" component="span">
                      Choose Image
                    </Button>
                  </label>
                </Box>
                <Box>
                  {selectedImage && (
                    <div>
                      <img src={selectedImgPath} alt="Selected" style={{ maxWidth: "100%" }} />
                      <Typography variant="body1">{selectedImgPath}</Typography>
                    </div>
                  )}
                </Box>
              </Box>
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                type="date"
                placeholder="Date of joining"
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
