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

const CARD_PROPERTY = {
  borderRadius: 3,
  boxShadow: 0,
};

function NoticeBoard() {
  const [notice, setNotice] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/notices/list`);
      if (response.data.length === 0) {
        console.log("Please add notice");
      } else {
        setNotice(response.data);
      }
    } catch (error) {
      console.log("There is some error in fetching data ", error);
    }
  };
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

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
                  <Link to="/notice/add-notice" underline="none" color="primary">
                    <SoftButton variant="gradient" color="dark">
                      <AddIcon />
                      &nbsp;add new notice
                    </SoftButton>
                  </Link>
                </Box>
                <Box sx={{ height: "1px", width: "100%", bgcolor: grey[100] }}></Box>
                <CardContent sx={{ p: 3, mb: 0 }}>
                  <Box className="swiper-container" style={{}}>
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
                            <CardMedia
                              component="img"
                              image={item.imgPath}
                              sx={{
                                borderRadius: 3,
                                width: "100%",
                                ml: 0,
                                mt: 0,
                                mb: 3,
                                height: "350px",
                              }}
                            />
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
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                  {item.noticeDate ? formatDate(item.noticeDate) : "Date not found"}
                                </Typography>
                              </Box>
                            </Stack>
                            <Typography
                              variant="body1"
                              sx={{ my: 2, overflowY: "auto", height: "250px" }}
                            >
                              {item.description}
                            </Typography>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default NoticeBoard;
