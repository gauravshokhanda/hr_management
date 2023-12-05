import React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import NoticeBoard from "layouts/noticeBoard";
import { Alert, DialogContent, Stack } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { API_URL } from "config";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useSelector } from "react-redux";
import moment from "moment";
import LoadingButton from "@mui/lab/LoadingButton";
import io from "socket.io-client";

// Hr Management Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Hr Management Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Hr Management Dashboard React base styles
import Snackbar from "@mui/material/Snackbar";
// Data
import { useEffect, useState } from "react";
import SoftButton from "components/SoftButton";
import Loader from "loader";

function Attendence() {
  const [buttonShow, setButtonShow] = useState(false);
  const [signInTrue, setSignInTrue] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [checkInBtn, setCheckInBtn] = useState(false);
  const [breakInBtn, setBreakInBtn] = useState(false);
  const [breakEndBtn, setBreakEndBtn] = useState(false);
  const [checkOutBtn, setCheckOutBtn] = useState(false);
  const [open, setOpen] = useState(false);
  const [attendanceId, setAttendanceId] = useState("");
  const [todayAttendence, setTodayAttendence] = useState("");
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState({
    checkInLoading: false,
    breakInLoading: false,
    breakEndLoading: false,
    checkOutLoading: false,
  });

  const socket = io(API_URL);

  console.log(socket, "socket");

  const { employeeAttendanceId } = useParams();

  const data = useSelector((state) => state.auth);

  const [checkInData, setCheckInData] = useState({
    date: "",
    checkIn: "",
    status: "",
  });

  const [breakInData, setBreakInData] = useState({
    attendanceId: "",
    breakStart: "",
  });

  const [breakOutData, setBreakOutData] = useState({
    attendanceId: "",
    breakEnd: "",
  });

  const [checkOutData, setCheckOutData] = useState({
    attendanceId: "",
    checkOut: "",
  });

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const displayNotification = (message, alertType) => {
    setNotificationMessage(message);
    console.log(alertType);
    setNotificationOpen(true);
    setSeverity(alertType);
  };

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  const user = data.user;

  const todayDate = new Date();

  const isTodayAttendance =
    todayAttendence && moment(todayAttendence.date).format("L") === moment(todayDate).format("L");
  const isCheckIn = isTodayAttendance && todayAttendence.checkIn;
  const isBreakStart = isTodayAttendance ? todayAttendence.breakStart : [];
  const isBreakEnd = isTodayAttendance ? todayAttendence.breakEnd : [];
  const isCheckOut = todayAttendence && todayAttendence.checkOut;

  useEffect(() => {
    // By default, all buttons are disabled
    let checkInEnabled = true;
    let breakInEnabled = false;
    let breakEndEnabled = false;
    let checkOutEnabled = false;

    if (!isCheckIn && isTodayAttendance) {
      checkInEnabled = true;
    }

    if (isCheckIn) {
      checkOutEnabled = true;
      checkInEnabled = false;
      if (isBreakStart.length === isBreakEnd.length) {
        breakInEnabled = true;
      }
    }

    if (isBreakEnd.length < isBreakStart.length) {
      breakEndEnabled = true;
      breakInEnabled = false;
    }

    if (isCheckOut === null || isCheckOut) {
      if (isBreakStart.length > 0 && isBreakEnd.length === 0) {
        breakInEnabled = false;
        breakEndEnabled = true;
      } else if (isBreakStart.length === 0 && isBreakEnd.length > 0) {
        breakEndEnabled = false;
        breakInEnabled = true;
      }
    }

    if (isCheckOut !== null && isTodayAttendance && isCheckOut) {
      breakEndEnabled = false;
      breakInEnabled = false;
    }

    setCheckInBtn(checkInEnabled);
    setBreakInBtn(breakInEnabled);
    setBreakEndBtn(breakEndEnabled);
    setCheckOutBtn(checkOutEnabled);
  }, [isCheckIn, isTodayAttendance, isBreakStart, isBreakEnd, isCheckOut]);

  // Rest of your component code...

  const fetchData = async () => {
    if (user) {
      try {
        const response = await axios.get(
          `${API_URL}/attendance/view/${employeeAttendanceId ? employeeAttendanceId : user._id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const lastAttendance = response.data.slice(-1)[0];
          setAttendance(response.data);
          setAttendanceId(lastAttendance.id);
          setTodayAttendence(lastAttendance);
          setLoading(false);
        }
      } catch (error) {
        console.error("There is some issue " + error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (attendance.length === 0) {
      setLoading(false);
    }
  }, []);

  const submitCheckIn = async () => {
    if (user) {
      try {
        const response = await axios.post(`${API_URL}/attendance/checkin`, checkInData, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 201) {
          fetchData();
          console.log(response.data, "Successfully submitted attendance");

          socket.emit("notification");

          setButtonLoading({ checkInLoading: false });
        }
      } catch (error) {
        console.log(error, "There is some error in submitting data");
        const message = "Internal server error";
        const alertType = "error";
        displayNotification(message, alertType);
      }
    }
  };



  const submitBreakIn = async () => {
    if (user) {
      try {
        const response = await axios.post(`${API_URL}/attendance/break`, breakInData, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 200) {
          fetchData();
          console.log(response, "Succesfully submitted attendence");
          const message = "Successfully Break In";
          const alertType = "success";
          displayNotification(message, alertType);
          setButtonLoading({ breakInLoading: false });
        }
      } catch (error) {
        console.log(error, "There is some error in submitting data");
        const message = "Internal server error";
        const alertType = "error";
        displayNotification(message, alertType);
      }
    }
  };
  const submitBreakOut = async () => {
    if (user) {
      try {
        const response = await axios.post(`${API_URL}/attendance/breakend`, breakOutData, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 200) {
          fetchData();
          console.log(response, "Succesfully submitted attendence");
          const message = "Successfully Break Out";
          const alertType = "success";
          displayNotification(message, alertType);
          setButtonLoading({ breakEndLoading: false });
        }
      } catch (error) {
        console.log(error, "There is some error in submitting data");
        const message = "Internal server error";
        const alertType = "error";
        displayNotification(message, alertType);
      }
    }
  };
  const submitCheckOut = async () => {
    if (user) {
      try {
        const response = await axios.post(`${API_URL}/attendance/checkout`, checkOutData, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 200) {
          fetchData();
          console.log(response, "Succesfully submitted attendence");
          const message = "Successfully Check Out";
          const alertType = "success";
          displayNotification(message, alertType);
          setButtonLoading({ checkOutLoading: false });
        }
      } catch (error) {
        console.log(error, "There is some error in submitting data");
        const message = "Internal server error";
        const alertType = "error";
        displayNotification(message, alertType);
      }
    }
  };  

  const handleCheckIn = () => {
    setButtonLoading({ checkInLoading: true });

    setCheckInData((prevData) => ({
      ...prevData,
      date: new Date(),
      status: "present",
      checkIn: new Date(),
      employeeId: employeeAttendanceId ? employeeAttendanceId : user._id,
    }));
  };
  const handleBreakIn = () => {
    setButtonLoading({ breakInLoading: true });
    setBreakInData((prevData) => ({
      ...prevData,
      attendanceId: attendanceId,
      breakStart: new Date(),
    }));
  };

  const handleBreakOut = () => {
    setButtonLoading({ breakEndLoading: true });
    setBreakOutData((prevData) => ({
      ...prevData,
      attendanceId: attendanceId,
      breakEnd: new Date(),
    }));
  };

  const handleCheckOut = () => {
    setButtonLoading({ checkOutLoading: true });

    const date = todayAttendence.checkOut
      ? todayAttendence.checkOut === null
        ? ""
        : moment(todayAttendence.checkOut)
      : "";

    const newCheckOutData = {
      attendanceId: attendanceId,
      checkOut: moment.isMoment(date) ? null : new Date(),
    };

    setCheckOutData(newCheckOutData);
  };

  useEffect(() => {
    if (checkInData.checkIn) {
      submitCheckIn();
    }
  }, [checkInData]);

  useEffect(() => {
    if (breakInData.breakStart) {
      submitBreakIn();
    }
  }, [breakInData]);

  useEffect(() => {
    if (breakOutData.breakEnd) {
      submitBreakOut();
    }
  }, [breakOutData]);

  useEffect(() => {
    if (checkOutData.checkOut || checkOutData.checkOut === null) {
      submitCheckOut();
    }
  }, [checkOutData]);

  const initialColumns = [
    {
      field: "date",
      headerName: "Date",
      width: 200,
      renderCell: (params) => {
        const date = params.row.date;
        return date ? moment(date).format("ll") : "";
      },
    },
    {
      field: "day",
      headerName: "Day",
      width: 120,
      renderCell: (params) => {
        const date = params.row.date;
        return date ? moment(date).format("dddd") : "";
      },
    },
    {
      field: "checkIn",
      headerName: "Checkin Time",
      width: 150,
      renderCell: (params) => {
        const time = params.row.checkIn;
        return time ? moment(time).format("LT") : "";
      },
    },
    {
      headerName: "Break Time",
      width: 360,
      renderCell: (params) => {
        const breakStarts = JSON.parse(params.row.breakStart);
        const breakEnds = JSON.parse(params.row.breakEnd);

        if (breakStarts && breakEnds) {
          const formattedBreakTimes = [];

          for (let i = 0; i < breakStarts.length; i++) {
            const breakStartTime = moment(breakStarts[i]).format("LT");
            const breakEndTime =
              breakEnds.length > i ? moment(breakEnds[i]).format("LT") : "Pending";

            formattedBreakTimes.push(`${breakStartTime} - ${breakEndTime}`);
          }

          return (
            <Stack direction="row" spacing={2}>
              {formattedBreakTimes.slice(0, 2).map((breakTime, index) => (
                <Chip key={index} label={breakTime} />
              ))}
              {formattedBreakTimes.length > 2 && <Chip key={"dot"} label={`...`} />}
            </Stack>
          );
        }

        return "N/A"; // Handle the case where breakStarts or breakEnds are missing
      },
    },
    {
      field: "checkOut",
      headerName: "Checkout Time",
      width: 150,
      renderCell: (params) => {
        const time = params.row.checkOut;
        return time ? moment(time).format("LT") : "";
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        return (
          <Box>
            {params.row.status === "absent" ? (
              <Chip variant="filled" color="error" label="Absent" />
            ) : (
              <Chip variant="filled" color="success" label="Present" />
            )}
          </Box>
        );
      },
    },
  ];

  const location = useLocation();
  const currentPage = location.pathname;

  const handleCloseAfterDelay = () => {
    setTimeout(() => {
      setButtonShow(true);
    }, 5000);
  };

  const handleClickOpen = () => {
    setOpen(true);
    setButtonShow(false);
    handleCloseAfterDelay();
    setSignInTrue(true);
  };

  useEffect(() => {
    const hasSeenDialog = localStorage.getItem("hasSeenDialog");

    if (currentPage === "/attendence" && !hasSeenDialog) {
      handleClickOpen();
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    setSignInTrue(false);

    localStorage.setItem("hasSeenDialog", "true");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {user && (
        <Stack
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "start", md: "center" }}
          direction={{ xs: "column", md: "row" }}
          gap={{ xs: "16px", md: "0" }}
        >
          <SoftBox display="flex" alignItems="center" sx={{ gap: "12px" }}>
            <Avatar
              src={`${API_URL}/${employeeAttendanceId
                  ? todayAttendence.employeeImage
                    ? todayAttendence.employeeImage
                    : ""
                  : user.image
                }`}
              sx={{ width: "60px", height: "60px", "& img": { height: "100%!important" } }}
            />
            <SoftTypography sx={{ textTransform: "capitalize" }} variant="h6">
              {employeeAttendanceId ? todayAttendence.employeeName : user.userName}
            </SoftTypography>
          </SoftBox>
          {!employeeAttendanceId && (
            <SoftBox display="flex" flexWrap="wrap" alignItems="center" sx={{ gap: "12px" }}>
              <LoadingButton
                disabled={!checkInBtn}
                variant="contained"
                color="info"
                onClick={handleCheckIn}
                loading={buttonLoading.checkInLoading}
              >
                Check In
              </LoadingButton>
              <LoadingButton
                disabled={!breakInBtn}
                variant="contained"
                color="warning"
                onClick={handleBreakIn}
                loading={buttonLoading.breakInLoading}
              >
                Break In
              </LoadingButton>
              <LoadingButton
                disabled={!breakEndBtn}
                variant="contained"
                color="inherit"
                onClick={handleBreakOut}
                loading={buttonLoading.breakEndLoading}
              >
                Break Out
              </LoadingButton>
              <LoadingButton
                disabled={!checkOutBtn}
                variant="contained"
                color={
                  todayAttendence.checkOut
                    ? todayAttendence.checkOut === null
                      ? "error"
                      : "primary"
                    : "error"
                }
                onClick={handleCheckOut}
                loading={buttonLoading.checkOutLoading}
              >
                {todayAttendence.checkOut
                  ? todayAttendence.checkOut === null
                    ? "Check Out"
                    : "Un Check Out"
                  : "Check Out"}
              </LoadingButton>
            </SoftBox>
          )}
        </Stack>
      )}
      <SoftBox py={3}>
        {loading ? (
          <Loader />
        ) : (
          <DataGrid
            rows={attendance}
            columns={initialColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
            sortModel={[
              {
                field: "date",
                sort: "desc",
              },
            ]}
            // components={{
            //   Toolbar: GridToolbar,
            // }}
            getRowId={(row) => row.id}
            sx={{
              "& .MuiDataGrid-footerContainer": {
                "& .MuiInputBase-root": {
                  width: "auto!Important",
                },
              },
            }}
          />
        )}
      </SoftBox>
      <Footer />

      {/* Modal */}
      <Dialog fullScreen open={open} onClose={null}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar sx={{ justifyContent: "flex-end" }}>
            <SoftButton
              edge="start"
              variant="contained"
              color="success"
              onClick={handleClose}
              aria-label="close"
              disabled={!buttonShow}
              endIcon={<ArrowRightAltIcon />}
            >
              Proceed
            </SoftButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <NoticeBoard signInTrue={signInTrue} />
        </DialogContent>
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

export default Attendence;
