// @mui material components
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Avatar,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { grey } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import { API_URL } from "config";
import axios from "axios";
import { useState, useEffect } from "react";
import SoftButton from "components/SoftButton";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Loader from "loader";

const CARD_PROPERTY = {
  borderRadius: 3,
  boxShadow: 0,
};

NoticeBoard.propTypes = {
  signInTrue: PropTypes.bool.isRequired,
};

function NoticeBoard({ signInTrue }) {
  const [notice, setNotice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const displayNotification = (message, alertType) => {
    setNotificationMessage(message);
    setNotificationOpen(true);
    setSeverity(alertType);
  };

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  const deleteNotice = async (notice) => {
    handleClickOpen();
    setDeleteId(notice._id);
    setDeleteName(notice.heading);
    console.log(notice, "Delete");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteEvent = async () => {
    setButtonLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/notices/delete-notice/${deleteId}`);

      if (response.status === 200) {
        fetchData();
        console.log("Deleted successfully");
        setButtonLoading(false);
        const message = "Successfully Delete Notice";
        const alertType = "success";
        displayNotification(message, alertType);
        setDeleteId("");
        setDeleteName("");
        handleClose();
      }
    } catch (error) {
      console.error("There is someee  error", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/notices/list`);
      if (response.data.length === 0) {
        setLoading(false);
        console.log("Please add notice");
      } else if (response.status === 200) {
        setLoading(false);
        setNotice(response.data);
      }
    } catch (error) {
      console.log("There is some error in fetching data ", error);
    }
  };

  const data = useSelector((state) => state.auth);
  const user = data.user;

  console.log(notice, "notices");
  useEffect(() => {
    fetchData();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: "long", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  console.log(loading, "loading");

  function stringAvatar(name) {
    if (typeof name === "string" && name.trim() !== "") {
      const nameParts = name.split(" ");
      if (nameParts.length >= 2) {
        return {
          sx: {
            bgcolor: stringToColor(name),
          },
          children: `${nameParts[0][0]}${nameParts[1][0]}`,
        };
      }
    }

    return {
      sx: {
        bgcolor: "#000000", // Default background color
      },
      children: "NA", // Default initials or placeholder
    };
  }
  return (
    <DashboardLayout>
      {signInTrue ? null : <DashboardNavbar />}
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container justifyContent="center" spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card sx={CARD_PROPERTY}>
                <Box
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "start",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      Notice Board
                    </Typography>
                  </Box>
                  {user?.isAdmin ? (
                    <Link to="/notice/add-notice" underline="none" color="primary">
                      <SoftButton variant="gradient" color="dark">
                        <AddIcon />
                        &nbsp;add new notice
                      </SoftButton>
                    </Link>
                  ) : null}
                </Box>
                <Box sx={{ height: "1px", width: "100%", bgcolor: grey[100] }}></Box>
                <CardContent sx={{ p: 3, mb: 0 }}>
                  {loading ? (
                    <Loader />
                  ) : (
                    <Box className="swiper-container" style={{}}>
                      {notice.length === 0 ? (
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                          There is no notice
                        </Typography>
                      ) : (

                        <Swiper
                          autoplay={true}
                          direction="vertical"
                          slidesPerView={1}
                          spaceBetween={20}
                          grabCursor={true}
                          mousewheel={true}
                          pagination={{
                            clickable: true,
                          }}
                          modules={[Pagination]}
                          // autoHeight={true}
                          style={{ height: "700px" }}
                          className="swiper-wrapper"
                        >
                          {notice.map((item) => {
                            return (
                              <SwiperSlide key={item._id}>
                                {item.imgPath === null ? null : (
                                  <CardMedia
                                    component="img"
                                    image={`${API_URL}/${item.imgPath}`}
                                    sx={{
                                      borderRadius: 3,
                                      width: "100%",
                                      ml: 0,
                                      mt: 0,
                                      mb: 3,
                                      height: "400px",
                                      // objectFit: "contain",
                                    }}
                                  />
                                )}
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Stack
                                    direction="row"
                                    justifyContent="start"
                                    alignItems="center"
                                    spacing={2}
                                  >
                                    <Avatar {...stringAvatar(item.heading)} />
                                    <Box>
                                      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                        {item.heading}
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                      >
                                        {item.noticeDate
                                          ? formatDate(item.noticeDate)
                                          : "Date not found"}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                  {user?.isAdmin ? (
                                    <Stack
                                      direction="row"
                                      justifyContent="start"
                                      alignItems="center"
                                      spacing={2}
                                    >
                                      <Link to={`/notice/add-notice/${item._id}`}>
                                        <SoftButton color="info" circular iconOnly>
                                          <EditIcon />
                                        </SoftButton>
                                      </Link>
                                      <SoftButton
                                        onClick={() => deleteNotice(item)}
                                        color="error"
                                        circular
                                        iconOnly
                                      >
                                        <DeleteIcon />
                                      </SoftButton>
                                    </Stack>
                                  ) : null}
                                </Stack>
                                <Typography
                                  variant="body1"
                                  sx={{ my: 2, overflowY: "auto", height: "200px" }}
                                >
                                  {item.description}
                                </Typography>
                              </SwiperSlide>
                            );
                          })}
                        </Swiper>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
      {signInTrue ? null : <Footer />}

      {/* Delete MOdal */}
      <Dialog maxWidth="xs" fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Delete event</DialogTitle>
        <DialogContent>
          <DialogContentText>Do you want to delete {deleteName}!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <SoftButton onClick={handleClose}>Cancel</SoftButton>
          <SoftButton disabled={buttonLoading} color="error" onClick={deleteEvent}>
            Delete
            {buttonLoading ? <CircularProgress color="secondary" sx={{ ml: 2 }} size={22} /> : null}
          </SoftButton>
        </DialogActions>
      </Dialog>

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
    </DashboardLayout>
  );
}

export default NoticeBoard;
