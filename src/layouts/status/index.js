import { Avatar, Box, Grid, Stack, Typography } from "@mui/material";
import { API_URL } from "config";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import axios from "axios";
import { setEmployeeData } from "store/userStatus";
import { io } from "socket.io-client";

export default function StatusUser() {
  const data = useSelector((state) => state.employee);
  const dispatch = useDispatch();


  const userStatus = data.employees;

  useEffect(() => {
    const socket = io(API_URL);

    // Event listener for 'onlineUsers' event
    const handleOnlineUsers = (data) => {
      if (data) {
        fetchStatus();
      }
    };

    // Attach the event listener
    socket.on("onlineUsers", handleOnlineUsers);

    // Fetch initial status
    fetchStatus();

    // Cleanup function to close the socket on component unmount
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.close();
    };
  }, []);


  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/attendance/status/view`);
      if (response) {
        dispatch(setEmployeeData(response.data));
      }
    }
    catch (error) {
      console.log("There is some error 0", error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);


  // Group the data by userId
  const groupedUsers = userStatus.reduce((acc, user) => {
    if (!acc[user.userId]) {
      acc[user.userId] = [];
    }
    acc[user.userId].push(user);
    return acc;
  }, {});

  const latestUserStatus = Object.values(groupedUsers).map((users) => {
    // Sort the users by date in descending order
    users.sort((a, b) => new Date(b.date) - new Date(a.date));
    // Return the user with the latest status
    return users[0];
  });

  // Sort the users with online users first, then offline users
  latestUserStatus.sort((a, b) => (a.status === "online" ? -1 : 1));

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Typography variant="h2" fontWeight={600}>
        Online Employees Status
      </Typography>
      <Grid container mt={3}>
        <Grid item md={8}>
          {latestUserStatus.map((user, index) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                borderRadius: 2,
                mb: 2,
                p: 2,
              }}
              key={index}
            >
              {user.status === "online" ? (
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar alt={user.employeeName} src={`${API_URL}/${user.employeeImage}`} />
                </StyledBadge>
              ) : (
                <Avatar alt={user.employeeName} src={`${API_URL}/${user.employeeImage}`} />
              )}
              <Typography variant="h6">{user.employeeName}</Typography>
              {user.status === "offline" ? (
                <Typography fontSize={12}>
                  Last Online at {moment(user.date).format("LT")}
                </Typography>
              ) : (
                <Typography fontSize={12} fontWeight={600}>
                  Online
                </Typography>
              )}
            </Box>
          ))}
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
