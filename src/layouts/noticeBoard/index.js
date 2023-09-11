// @mui material components
import { Box, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import { Link } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { grey } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from 'swiper/modules';

const CARD_PROPERTY = {
  borderRadius: 3,
  boxShadow: 0,
};

function NoticeBoard() {
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
                  <IconButton>
                    <AddIcon />
                  </IconButton>
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
                      autoHeight={true}
                      className="swiper-wrapper"
                    >
                      <SwiperSlide>
                        {/* Content for Slide 1 */}
                        <CardMedia
                          component="img"
                          image="https://images.pexels.com/photos/904276/pexels-photo-904276.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                          sx={{
                            borderRadius: 3,
                            width: "100%",
                            ml: 0,
                            mt: 0,
                            mb: 3,
                            height: "400px",
                          }}
                        />
                        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
                          News 1
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                          14 May 2014
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                          This impressive paella is a perfect party dish and a fun meal to cook
                          together with your guests. Add 1 cup of froze. This impressive paella is a
                          perfect party dish and a fun meal to cook together with your guests. Add 1
                          cup of froze. This impressive paella is a perfect party dish and a fun
                          meal to cook together with your guests. Add 1 cup of froze.
                        </Typography>
                      </SwiperSlide>
                      <SwiperSlide>
                        {/* Content for Slide 1 */}
                        <CardMedia
                          component="img"
                          image="https://images.pexels.com/photos/904276/pexels-photo-904276.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                          sx={{
                            borderRadius: 3,
                            width: "100%",
                            ml: 0,
                            mt: 0,
                            mb: 3,
                            height: "400px",
                          }}
                        />
                        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
                          News 1
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                          14 May 2014
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                          This impressive paella is a perfect party dish and a fun meal to cook
                          together with your guests. Add 1 cup of froze.
                        </Typography>
                      </SwiperSlide>
                      <SwiperSlide>
                        {/* Content for Slide 1 */}
                        <CardMedia
                          component="img"
                          image="https://images.pexels.com/photos/904276/pexels-photo-904276.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                          sx={{
                            borderRadius: 3,
                            width: "100%",
                            ml: 0,
                            mt: 0,
                            mb: 3,
                            height: "400px",  
                          }}
                        />
                        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
                          News 1
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                          14 May 2014
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                          This impressive paella is a perfect party dish and a fun meal to cook
                          together with your guests. Add 1 cup of froze.
                        </Typography>
                      </SwiperSlide>
                    </Swiper>
                  </Box>
                  {/* <CardMedia
                    component="img"
                    image="https://images.pexels.com/photos/904276/pexels-photo-904276.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                    sx={{ borderRadius: 3, width: "100%", ml: 0, mt: 0, mb: 3 }}
                  />
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
                    News
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    14 May 2014
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    This impressive paella is a perfect party dish and a fun meal to cook together
                    with your guests. Add 1 cup of froze . This impressive paella is a perfect party
                    dish and a fun meal to cook together with your guests. Add 1 cup of froze This
                    impressive paella is a perfect party dish and a fun meal to cook together with
                    your guests. Add 1 cup of froze
                  </Typography> */}
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
