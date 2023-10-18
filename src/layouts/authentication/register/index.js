import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Input,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../../../config";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import PropTypes from "prop-types";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

function Register({ backButton, setAddEmployee }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  const displayNotification = (message, alertType) => {
    setNotificationOpen(true);
    setNotificationMessage(message);
    setSeverity(alertType);
  };

  useEffect(() => {
    // Check if 'id' is available and fetch employee data if it exists
    if (id) {
      axios
        .get(`${API_URL}/employes/view/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const employeeData = response.data;
            setFormData({
              ...employeeData,
            });
            console.log(employeeData, "Employee data registered");
          } else {
            console.error("Error fetching employee data. Status code:", response.status);
          }
        })
        .catch((error) => {
          console.error("Error fetching employee data:", error);
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
    accountNumber: "",
    ifscCode: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log(file, "Selected image");
      setSelectedImage(file);
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
    setButtonLoading(true);

    try {
      const formDataToSend = new FormData();
        formDataToSend.append("image", selectedImage, selectedImage.name);
      // if (selectedImage) {
      // }
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("userName", formData.userName);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("isAdmin", formData.isAdmin);
      formDataToSend.append("isStaff", formData.isStaff);
      formDataToSend.append("salary", formData.salary);
      formDataToSend.append("userEmail", formData.userEmail);
      formDataToSend.append("accountNumber", formData.accountNumber);
      formDataToSend.append("ifscCode", formData.ifscCode);
      formDataToSend.append("dateOfJoining", formData.dateOfJoining);

      const response = await (id
        ? axios.put(`${API_URL}/employes/update/${id}`, formDataToSend)
        : axios.post(`${API_URL}/employes/register`, formDataToSend));

      if (response.status === 201 || response.status === 200) {
        console.log(`Employee ${id ? "updated" : "registered"} successfully`);

        const message = `Successfully ${id ? "Updated" : "Register"} employee`;
        const alertType = "success";
        displayNotification(message, alertType);
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
          accountNumber: "",
          ifscCode: "",
        });

        setSelectedImage(null);
        setButtonLoading(false);
        setTimeout(() => {
          navigate("/manage-employee", { replace: true });
        }, 1000);
      }
    } catch (error) {
      const message = `Internal server error`;
      const alertType = "error";
      displayNotification(message, alertType);
      setButtonLoading(false);
      console.error("Registration failed", error);
    }
  };

  return (
    <>
      {id ? (
        <DashboardLayout>
          <RegisterWrapper
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            selectedImage={selectedImage}
            handleImageChange={handleImageChange}
            id={id}
            notificationOpen={notificationOpen}
            handleCloseNotification={handleCloseNotification}
            severity={severity}
            notificationMessage={notificationMessage}
            buttonLoading={buttonLoading}
            backButton={backButton}
            setAddEmployee={setAddEmployee}
          />
        </DashboardLayout>
      ) : (
        <RegisterWrapper
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          selectedImage={selectedImage}
          handleImageChange={handleImageChange}
          id={id}
          notificationOpen={notificationOpen}
          handleCloseNotification={handleCloseNotification}
          severity={severity}
          notificationMessage={notificationMessage}
          buttonLoading={buttonLoading}
          backButton={backButton}
          setAddEmployee={setAddEmployee}
        />
      )}
    </>
  );
}

function RegisterWrapper({
  formData,
  handleChange,
  handleSubmit,
  selectedImage,
  handleImageChange,
  id,
  notificationOpen,
  handleCloseNotification,
  severity,
  notificationMessage,
  buttonLoading,
  backButton,
  setAddEmployee,
}) {
  return (
    <SoftBox>
      <Grid container justifyContent={`center`}>
        <Grid item xs={12}>
          <Card>
            <SoftBox px={3} pt={3} pb={1} display="flex" alignItems="center" gap="12px">
              {id ? (
                <Link to={`/manage-employee`}>
                  <SoftButton color="info" circular iconOnly>
                    <KeyboardBackspaceIcon />
                  </SoftButton>
                </Link>
              ) : null}
              {backButton ? (
                <SoftButton
                  onClick={() => {
                    setAddEmployee(true);
                  }}
                  color="info"
                  circular
                  iconOnly
                >
                  <KeyboardBackspaceIcon />
                </SoftButton>
              ) : null}
              <SoftTypography variant="h3" fontWeight="bold">
                {id ? "Edit Employee" : "Register"}
              </SoftTypography>
            </SoftBox>
            <SoftBox pt={2} pb={3} px={3}>
              <SoftBox component="form" role="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <SoftBox>
                      <SoftInput
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SoftBox>
                      <SoftInput
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SoftBox>
                      <SoftInput
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        placeholder="User Name"
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SoftBox>
                      <SoftInput
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleChange}
                        type="email"
                        placeholder="User Email"
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SoftBox>
                      <SoftInput
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        type="number"
                        placeholder="Salary"
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SoftBox>
                      <SoftInput
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        type="number"
                        placeholder="Account Number"
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SoftBox>
                      <SoftInput
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                        placeholder="IFSC Code"
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SoftBox>
                      <SoftInput
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Password"
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <SoftBox>
                      <SoftInput
                        name="dateOfJoining"
                        value={formData.dateOfJoining}
                        onChange={handleChange}
                        type="date"
                        placeholder="Date of joining"
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grid container>
                      <Grid item xs={6}>
                        <label>
                          <Checkbox
                            name="isAdmin"
                            checked={formData.isAdmin}
                            onChange={handleChange}
                          />
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
                          <Checkbox
                            name="isStaff"
                            checked={formData.isStaff}
                            onChange={handleChange}
                          />
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
                  </Grid>
                  <Grid item xs={12}>
                    <SoftBox>
                      <Stack
                      display={'flex'}
                      alignItems={{sm: 'start', md: 'center'}}
                      flexDirection={{sm:'column', md: 'row'}}
                      spacing={2}
                      justifyContent={'space-between'}
                        sx={{
                          padding: "20px",
                          border: "0.0625rem solid #d2d6da",
                          borderRadius: "0.5rem!important",
                        }}
                      >
                        <Box>
                          <Typography sx={{ mb: 1 }} variant="h5">
                            {id ? "Update" : "Upload"} User Image
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
                        <Box maxWidth={400}>
                          {selectedImage ? (
                            <div>
                              <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Selected"
                                style={{ width: "100%", height: "250px", objectFit: "cover" }}
                              />
                              <Typography variant="body1">{selectedImage.name}</Typography>
                            </div>
                          ) : (
                            <div>
                              {formData.image && (
                                <>
                                  <img
                                    src={API_URL + "/" + formData.image}
                                    alt={formData.image ? formData.heading : "Add image"}
                                    style={{ maxWidth: "100%" }}
                                  />
                                  <Typography variant="body1">{formData.image}</Typography>
                                </>
                              )}
                            </div>
                          )}
                        </Box>
                      </Stack>
                    </SoftBox>
                  </Grid>
                </Grid>

                <SoftBox mt={4} mb={1} display="flex" justifyContent="end">
                  <SoftButton
                    disabled={buttonLoading}
                    variant="gradient"
                    type="submit"
                    color="dark"
                  >
                    Register
                    {buttonLoading ? (
                      <CircularProgress color="secondary" sx={{ ml: 2 }} size={22} />
                    ) : null}
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            </SoftBox>
          </Card>
        </Grid>
      </Grid>

      {/* Alert toast */}
      <Snackbar
        autoHideDuration={5000}
        open={notificationOpen}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseNotification} severity={severity} sx={{ width: "100%" }}>
          {notificationMessage}
        </Alert>
      </Snackbar>
    </SoftBox>
  );
}

RegisterWrapper.propTypes = {
  formData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    userName: PropTypes.string,
    password: PropTypes.string,
    isAdmin: PropTypes.bool,
    isStaff: PropTypes.bool,
    salary: PropTypes.string,
    dateOfJoining: PropTypes.string,
    image: PropTypes.string,
    userEmail: PropTypes.string,
    accountNumber: PropTypes.string,
    ifscCode: PropTypes.string,
    severity: PropTypes.string,
    notificationMessage: PropTypes.string,
    notificationOpen: PropTypes.bool,
    buttonLoading: PropTypes.bool,
    backButton: PropTypes.bool,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  selectedImage: PropTypes.object,
  handleImageChange: PropTypes.func.isRequired,
  handleCloseNotification: PropTypes.func.isRequired,
  id: PropTypes.func.isRequired,
  setAddEmployee: PropTypes.func.isRequired,
};

export default Register;
