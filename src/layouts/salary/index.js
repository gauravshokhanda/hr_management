import React, { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import axios from "axios";
import { API_URL } from "config";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import curved14 from "assets/images/curved-images/curved14.jpg";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

function SalarySlip() {
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState("");
  const data = useSelector((state) => state.auth);

  // In your fetchData function
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/employes/view/${userId}`, {
        headers: {
          Authorization: `${data.token}`,
        },
      });

      if (response.status === 200) {
        console.log("Successfully found user");
        setUserData(response.data);
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
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox>
              <DataGrid
                rows={employees}
                columns={initialColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                autoHeight
                components={{
                  Toolbar: GridToolbar,
                }}
                getRowId={(row) => row._id}
              />
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
}

export default SalarySlip;
