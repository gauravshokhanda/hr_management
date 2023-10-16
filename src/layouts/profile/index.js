import React, { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import SoftBox from "components/SoftBox";

// Hr Management Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import axios from "axios";
import { API_URL } from "config";
import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Input,
  Snackbar,
  Typography,
} from "@mui/material";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loader from "loader";
import { useParams } from "react-router-dom";
import SoftButton from "components/SoftButton";
import EditIcon from "@mui/icons-material/Edit";
import SoftInput from "components/SoftInput";

function Overview() {
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImgPath, setSelectedImgPath] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [edit, setEdit] = useState(false);

  const data = useSelector((state) => state.auth);

  const { id } = useParams();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log(file, "Selected image");
      setSelectedImage(file);
      setSelectedImgPath(URL.createObjectURL(file));
      const imageName = file.name;
      setUserData((prevData) => ({
        ...prevData,
        imgPath: imageName,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setUserData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (data && data.user) {
      setUserId(data.user._id);
    }
  }, [data, userId]);

  // In your fetchData function
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/employes/view/${id ? id : userId}`, {
        headers: {
          Authorization: `${data.token}`,
        },
      });

      if (response.status === 200) {
        console.log("Successfully found user");
        setUserData(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("Something went wrong " + error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  const displayNotification = (message, alertType) => {
    setNotificationOpen(true);
    setNotificationMessage(message);
    setSeverity(alertType);
  };

  const userDataForm = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    userName: userData.userName,
    salary: userData.salary,
    image: userData.image,
    accountNumber: userData.accountNumber,
    ifscCode: userData.ifscCode,
    userEmail: userData.userEmail,
    isAdmin:userData.isAdmin,
    isStaff:userData.isStaff, 
  };

  const handleSubmit = async (e) => {
    setButtonLoading(true);
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", userDataForm.firstName);
      formDataToSend.append("lastName", userDataForm.lastName);
      formDataToSend.append("userName", userDataForm.userName);
      formDataToSend.append("userEmail", userDataForm.userEmail);
      formDataToSend.append("image", userDataForm.image);
      formDataToSend.append("accountNumber", userDataForm.accountNumber);
      formDataToSend.append("ifscCode", userDataForm.ifscCode);
      formDataToSend.append("isAdmin", userDataForm.isAdmin);
      formDataToSend.append("isStaff", userDataForm.isStaff);
      formDataToSend.append("salary", userDataForm.salary);

      // Append the image as binary data
      if (selectedImage) {
        formDataToSend.append("image", selectedImage, selectedImage.name);
      }

      const response = await axios.put(
        `${API_URL}/employes/update/${id ? id : userId}`,
        formDataToSend
      );

      if (response.status === 201 || response.status === 200) {
        console.log("User update successfully", response.data);

        setUserData({
          heading: "",
          description: "",
          imgPath: "",
          tags: [],
        });

        setSelectedImage("");
        const message = `Successfully updated user`;
        const alertType = "success";
        displayNotification(message, alertType);
        setButtonLoading(false);
        fetchData();
        setEdit(false);
      }
    } catch (error) {
      console.error("Notice saved failed", error);
      if (error.response.status === 500 || error.code === "ERR_NETWORK") {
        const message = "Internal server error";
        const alertType = "error";
        displayNotification(message, alertType);
        setButtonLoading(false);
      }
    }
  };

  console.log(userId, "user id");
  console.log(userData, "user data");

  const contentStyle = {
    // boxShadow: "2px 0px 16px rgb(223 216 216)",
    border: "1px dashed #ababab",
    p: 2,
    borderRadius: 2,
    display: "flex",
    gap: 0.5,
    mt: 3,
    flexDirection: "column",
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox mt={5} mb={3}>
        <Grid container justifyContent={"center"} spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                marginBottom={2}
              >
                <Typography variant="h2" fontWeight={700}>
                  Profile Details
                </Typography>
                {edit ? (
                  <SoftButton disabled={buttonLoading} onClick={handleSubmit} color="info">
                    Update{" "}
                    {buttonLoading ? (
                      <CircularProgress sx={{ ml: 1 }} color="inherit" size={14} />
                    ) : null}
                  </SoftButton>
                ) : null}
              </Box>
              {loading ? (
                <Loader />
              ) : (
                <Grid container justifyContent="space-between" alignItems="start">
                  <Grid
                    item
                    xs={12}
                    md={7}
                    flexWrap="wrap"
                    justifyContent="center"
                    flexDirection="column"
                    display="flex"
                    gap={0.5}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <SoftBox sx={contentStyle}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="h5" fontWeight={500}>
                              Full Name
                            </Typography>
                          </Box>
                          <Typography variant="subtitle1" color="#a9a9a9" fontWeight={400}>
                            {userData.firstName + " " + userData.lastName}
                          </Typography>
                        </SoftBox>
                        <SoftBox sx={contentStyle}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="h5" fontWeight={500}>
                              Last Name
                            </Typography>
                            <SoftButton
                              onClick={() => {
                                setEdit(true);
                              }}
                              color="info"
                              circular
                              iconOnly
                            >
                              <EditIcon />
                            </SoftButton>
                          </Box>

                          {edit ? (
                            <SoftInput
                              name="firstName"
                              type="text"
                              value={userData.lastName}
                              onChange={handleChange}
                            />
                          ) : (
                            <Typography variant="subtitle1" color="#a9a9a9" fontWeight={400}>
                              {userData.lastName}
                            </Typography>
                          )}
                        </SoftBox>
                        <SoftBox sx={contentStyle}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="h5" fontWeight={500}>
                              User Name
                            </Typography>
                            <SoftButton
                              onClick={() => {
                                setEdit(true);
                              }}
                              color="info"
                              circular
                              iconOnly
                            >
                              <EditIcon />
                            </SoftButton>
                          </Box>

                          {edit ? (
                            <SoftInput
                              name="userName"
                              type="text"
                              value={userData.userName}
                              onChange={handleChange}
                            />
                          ) : (
                            <Typography variant="subtitle1" color="#a9a9a9" fontWeight={400}>
                              {userData.userName}
                            </Typography>
                          )}
                        </SoftBox>
                        <SoftBox sx={contentStyle}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="h5" fontWeight={500}>
                              User Id
                            </Typography>
                            <SoftButton
                              onClick={() => {
                                setEdit(true);
                              }}
                              color="info"
                              circular
                              iconOnly
                            >
                              <EditIcon />
                            </SoftButton>
                          </Box>

                          {edit ? (
                            <SoftInput
                              name="_id"
                              type="text"
                              value={userData._id}
                              onChange={handleChange}
                            />
                          ) : (
                            <Typography variant="subtitle1" color="#a9a9a9" fontWeight={400}>
                              {userData._id}
                            </Typography>
                          )}
                        </SoftBox>
                        <SoftBox sx={contentStyle}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="h5" fontWeight={500}>
                              User Account Number
                            </Typography>
                            <SoftButton
                              onClick={() => {
                                setEdit(true);
                              }}
                              color="info"
                              circular
                              iconOnly
                            >
                              <EditIcon />
                            </SoftButton>
                          </Box>

                          {edit ? (
                            <SoftInput
                              name="accountNumber"
                              type="text"
                              value={userData.accountNumber}
                              onChange={handleChange}
                            />
                          ) : (
                            <Typography variant="subtitle1" color="#a9a9a9" fontWeight={400}>
                              {userData.accountNumber}
                            </Typography>
                          )}
                        </SoftBox>
                      </Grid>
                      <Grid item xs={6}>
                        <SoftBox sx={contentStyle}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="h5" fontWeight={500}>
                              First Name
                            </Typography>
                            <SoftButton
                              onClick={() => {
                                setEdit(true);
                              }}
                              color="info"
                              circular
                              iconOnly
                            >
                              <EditIcon />
                            </SoftButton>
                          </Box>

                          {edit ? (
                            <SoftInput
                              name="firstName"
                              type="text"
                              value={userData.firstName}
                              onChange={handleChange}
                            />
                          ) : (
                            <Typography variant="subtitle1" color="#a9a9a9" fontWeight={400}>
                              {userData.firstName}
                            </Typography>
                          )}
                        </SoftBox>
                        <SoftBox sx={contentStyle}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="h5" fontWeight={500}>
                              User Email
                            </Typography>
                            <SoftButton
                              onClick={() => {
                                setEdit(true);
                              }}
                              color="info"
                              circular
                              iconOnly
                            >
                              <EditIcon />
                            </SoftButton>
                          </Box>

                          {edit ? (
                            <SoftInput
                              name="userEmail"
                              type="text"
                              value={userData.userEmail}
                              onChange={handleChange}
                            />
                          ) : (
                            <Typography variant="subtitle1" color="#a9a9a9" fontWeight={400}>
                              {userData.userEmail}
                            </Typography>
                          )}
                        </SoftBox>
                        <SoftBox sx={contentStyle}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="h5" fontWeight={500}>
                              User Salary
                            </Typography>
                            {/* <SoftButton onClick={() => {
                          setEdit(true);
                        }} color="info" circular iconOnly>
                              <EditIcon />
                            </SoftButton> */}
                          </Box>
                          <Typography variant="subtitle1" color="#a9a9a9" fontWeight={400}>
                            {userData.salary}
                          </Typography>
                        </SoftBox>
                        <SoftBox sx={contentStyle}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="h5" fontWeight={500}>
                              User IFSC Code
                            </Typography>
                            <SoftButton
                              onClick={() => {
                                setEdit(true);
                              }}
                              color="info"
                              circular
                              iconOnly
                            >
                              <EditIcon />
                            </SoftButton>
                          </Box>
                          {edit ? (
                            <SoftInput
                              name="ifscCode"
                              type="text"
                              value={userData.ifscCode}
                              onChange={handleChange}
                            />
                          ) : (
                            <Typography variant="subtitle1" color="#a9a9a9" fontWeight={400}>
                              {userData.ifscCode}
                            </Typography>
                          )}
                        </SoftBox>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={5} xl={3} marginTop={3} sx={{ position: "relative" }}>
                    {selectedImage ? (
                      <CardMedia
                        component="img"
                        src={selectedImgPath}
                        alt="Selected"
                        sx={{
                          m: 0,
                          borderRadius: 2,
                          maxWidth: "100%",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : (
                      <div>
                        {userData.image ? (
                          <CardMedia
                            component="img"
                            src={API_URL + "/" + userData.image}
                            alt={userData.image ? userData.heading : "Add image"}
                            sx={{
                              m: 0,
                              borderRadius: 2,
                              maxWidth: "100%",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        ) : (
                          <Typography variant="p">Image not found</Typography>
                        )}
                      </div>
                    )}
                    <Input
                      accept="image/*"
                      type="file"
                      id="image-input"
                      onChange={handleImageChange}
                      sx={{ display: "none!important" }}
                    />
                    <label htmlFor="image-input">
                      <SoftButton
                        color="info"
                        circular
                        iconOnly
                        component="span"
                        onClick={() => {
                          setEdit(true);
                        }}
                        sx={{ position: "absolute", bottom: 6, right: 6 }}
                      >
                        <EditIcon />
                      </SoftButton>
                    </label>
                  </Grid>
                </Grid>
              )}
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

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
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
