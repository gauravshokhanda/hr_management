// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import NoticeBoard from "layouts/noticeBoard";
import { Button, DialogContent } from "@mui/material";
import { useLocation } from "react-router-dom";
import { API_URL } from "config";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import Avatar from "@mui/material/Avatar";

// Hr Management Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Hr Management Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar, { useSoftUIController } from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Hr Management Dashboard React base styles
import typography from "assets/theme/base/typography";

// Data
import { useEffect, useState } from "react";
import SoftButton from "components/SoftButton";
import { ResetTvSharp } from "@mui/icons-material";
import { check } from "prettier";
import storage from "redux-persist/lib/storage";

function Attendence() {
  const { size } = typography;
  const [buttonShow, setButtonShow] = useState(false);
  const [signInTrue, setSignInTrue] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [open, setOpen] = useState(false);
  const [attendanceId, setAttendanceId] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [todayRecords, setTodayRecords] = useState({
    checkInTime: null,
    checkOutTime: null,
    breakInTime: null,
    breakOutTime: null,
  });
  const [attendanceData, setAttendanceData] = useState({
    date: "",
    checkIn: "",
    checkOut: "",
    breakStart: "",
    breakEnd: "",
    status: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const controller = useSoftUIController();

  const user = controller[0].user;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const formatDay = (dateString) => {
    const options = { weekday: "long" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const formatTime = (timeString) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return new Date(timeString).toLocaleTimeString(undefined, options);
  };

  const fetchData = async () => {
    if (user) {
      try {
        const response = await axios.get(`${API_URL}/employes/${user._id}/attendance`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const employeeData = response.data.map((item) => ({
            ...item,
            day: formatDay(item.date),
            date: formatDate(item.date),
            checkIn: formatTime(item.checkIn),
            checkOut: item.checkOut ? formatTime(item.checkOut) : "",
            breakStart: formatTime(item.breakStart),
            breakEnd: formatTime(item.breakEnd)
          }));

          setAttendance(employeeData);
          setAttendanceId(employeeData[0]._id);
        }
        console.log(response, "Attendence response");
      } catch (error) {
        console.error("There is some issue " + error);
      }
    }
  };

  const submitData = async () => {
    if (user) {
      try {
        const response = await axios.post(
          `${API_URL}/employes/${user._id}/attendance/`,
          attendanceData,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response, "Succesfully submitted attendence");
        }
      } catch (error) {
        console.log(error, "There is some error in submitting data");
      }
    }
  };

  const handleCheckIn = () => {
    setAttendanceData((prevData) => ({
      ...prevData,
      date: new Date(),
      status: "present",
      checkIn: new Date(),
    }));
    setDisableButton(true);
  };
  
  const handleBreakIn = () => {
    setAttendanceData((prevData) => {
      return { ...prevData, breakStart: new Date() };
    });
  };
  const handleBreakOut = () => {
    setAttendanceData((prevData) => {
      return { ...prevData, breakEnd: new Date() };
    });
  };

  const handleCheckOut = async () => {
    await setAttendanceData((prevData) => ({
      ...prevData,
      checkOut: new Date(),
    }));
    
    // Log the updated attendanceData here to see if it has changed
    console.log("After update:", attendanceData);
  
    submitData();
    setDisableButton(false);
  };
  
  
  const initialColumns = [
    {
      field: "date",
      headerName: "Date",
      width: 200,
    },
    {
      field: "day",
      headerName: "Day",
      width: 120,
    },
    {
      field: "checkIn",
      headerName: "Checkin Time",
      width: 150,
    },
    {
      field: "checkOut",
      headerName: "Checkout Time",
      width: 150,
    },
    {
      field: "breakStart",
      headerName: "Break Start",
      width: 150,
    },
    {
      field: "breakEnd",
      headerName: "Break End",
      width: 150,
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
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
          <SoftBox display="flex" alignItems="center" sx={{ gap: "12px" }}>
            <Avatar
              src={`${API_URL}/${user.image}`}
              sx={{ width: "60px", height: "60px", "& img": { height: "100%!important" } }}
            />
            <SoftTypography sx={{ textTransform: "capitalize" }} variant="h6">
              {user.userName}
            </SoftTypography>
          </SoftBox>
          <SoftBox display="flex" alignItems="center" sx={{ gap: "12px" }}>
            <SoftButton
              disabled={disableButton}
              variant="contained"
              color="info"
              onClick={handleCheckIn}
            >
              Check In
            </SoftButton>
            <SoftButton variant="contained" color="warning" onClick={handleBreakIn}>
              Break In
            </SoftButton>
            <SoftButton variant="contained" color="warning" onClick={handleBreakOut}>
              Break Out
            </SoftButton>
            <SoftButton disabled={!disableButton} variant="contained" color="success" onClick={handleCheckOut}>
              Check Out
            </SoftButton>
          </SoftBox>
        </SoftBox>
      )}
      <SoftBox py={3}>
        <DataGrid
          rows={attendance}
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
    </DashboardLayout>
  );
}

export default Attendence;
