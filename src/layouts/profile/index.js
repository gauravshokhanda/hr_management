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
import { Box, Card, CardMedia, Typography } from "@mui/material";
import curved14 from "assets/images/curved-images/curved14.jpg";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loader from "loader";
import { useParams } from "react-router-dom";

function Overview() {
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const data = useSelector((state) => state.auth);

  const { id } = useParams();

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

  useEffect(() => {
    if (data && data.user) {
      setUserId(data.user._id);
    }
  }, [data, userId]);

  console.log(userId, "user id");
  console.log(userData, "user data");

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox mt={5} mb={3}>
        <Grid container justifyContent={"center"} spacing={3}>
          <Grid item xs={12} md={12} xl={12}>
            <Box
              sx={{
                borderRadius: "12px",
                backgroundImage: `url(${curved14})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height: "300px",
                width: "100%",
                px: 2,
                position: "relative",
              }}
            />
          </Grid>
          <Grid item xs={8} md={8} xl={8}>
            <Card sx={{ position: "relative", top: "-60%", p: 3 }}>
              {loading ? (
                <Loader />
              ) : (
                <Grid container>
                  <Grid item xs={12} md={5} xl={3}>
                    <CardMedia
                      component="img"
                      image={`${API_URL}/${userData.image}`}
                      alt="Paella dish"
                      sx={{
                        m: 0,
                        borderRadius: 3,
                        border: 1,
                        borderColor: "secondary.main",
                        maxWidth: "200px",
                        maxHeight: "200px",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={7}
                    xl={9}
                    flexWrap="wrap"
                    justifyContent="center"
                    flexDirection="column"
                    display="flex"
                    gap={0.5}
                  >
                    <SoftBox sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Typography variant="h5" fontWeight={500}>
                        Full Name :
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={400}>
                        {userData.firstName + " " + userData.lastName}
                      </Typography>
                    </SoftBox>
                    <SoftBox sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Typography variant="h5" fontWeight={500}>
                        User Name :
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={400}>
                        {userData.userName}
                      </Typography>
                    </SoftBox>
                    <SoftBox sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Typography variant="h5" fontWeight={500}>
                        User Email :
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={400}>
                        {userData.userEmail}
                      </Typography>
                    </SoftBox>
                    <SoftBox sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Typography variant="h5" fontWeight={500}>
                        User Salary :
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={400}>
                        {userData.salary}
                      </Typography>
                    </SoftBox>
                  </Grid>
                </Grid>
              )}
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
