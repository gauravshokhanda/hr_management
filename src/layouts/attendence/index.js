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
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

// Hr Management Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Hr Management Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Hr Management Dashboard React base styles
import typography from "assets/theme/base/typography";

// Data
import { useEffect, useState } from "react";
import SoftButton from "components/SoftButton";
import { TornadoRounded } from "@mui/icons-material";

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

  const user = data.user;

  const todayDate = new Date();

  const isTodayAttendance =
  todayAttendence && moment(todayAttendence.date).format("L") === moment(todayDate).format("L");
const isCheckIn = isTodayAttendance && todayAttendence.checkIn;
const isBreakStart = isTodayAttendance ? todayAttendence.breakStart : [];
const isBreakEnd = isTodayAttendance ? todayAttendence.breakEnd : [];
const isCheckOut = isTodayAttendance && todayAttendence.checkOut;

console.log(isBreakStart.length, "length");
console.log(isBreakEnd.length, "end");

useEffect(() => {
  // Disable all buttons initially
  setCheckInBtn(true);
  setBreakInBtn(false);
  setBreakEndBtn(false);
  setCheckOutBtn(false);

  if (!isCheckIn && isTodayAttendance) {
    setCheckInBtn(true);
  }

  if (isCheckIn) {
    setCheckInBtn(false);
    setCheckOutBtn(true);
    if (isBreakStart.length === isBreakEnd.length) {
      setBreakInBtn(true);
    }
  }
}, [isCheckIn, isTodayAttendance, isBreakStart.length, isBreakEnd.length]);

useEffect(() => {
  if (isCheckIn && isBreakStart.length === isBreakEnd.length) {
    setBreakInBtn(true);
  }
}, [isCheckIn, isBreakStart.length, isBreakEnd.length]);

useEffect(() => {
  if (isBreakEnd.length < isBreakStart.length ) {
    setCheckOutBtn(true);
    setBreakEndBtn(true);
  }
}, [isBreakStart.length, isBreakEnd.length]);

useEffect(() => {
  if (!isCheckOut && isTodayAttendance) {
    setCheckOutBtn(true);
  }
  if (isCheckOut && isTodayAttendance) {
    setCheckInBtn(false);
    setBreakInBtn(false);
    setBreakEndBtn(false);
    setCheckOutBtn(false);
  }
}, [isCheckOut, isTodayAttendance]);

  const fetchData = async () => {
    if (user) {
      try {
        const response = await axios.get(`${API_URL}/attendance/view/${user._id}`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const lastAttendance = response.data.slice(-1)[0];
          setAttendance(response.data);
          setAttendanceId(lastAttendance._id);
          setTodayAttendence(lastAttendance);
        }
      } catch (error) {
        console.error("There is some issue " + error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitCheckIn = async () => {
    if (user) {
      try {
        const response = await axios.post(`${API_URL}/attendance/checkin`, checkInData, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 200) {
          console.log(response, "Succesfully submitted attendence");
        }
      } catch (error) {
        console.log(error, "There is some error in submitting data");
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
          console.log(response, "Succesfully submitted attendence");
        }
      } catch (error) {
        console.log(error, "There is some error in submitting data");
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
          console.log(response, "Succesfully submitted attendence");
        }
      } catch (error) {
        console.log(error, "There is some error in submitting data");
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
          console.log(response, "Succesfully submitted attendence");
        }
      } catch (error) {
        console.log(error, "There is some error in submitting data");
      }
    }
  };

  const handleCheckIn = () => {
    setCheckInData((prevData) => ({
      ...prevData,
      date: new Date(),
      status: "present",
      checkIn: new Date(),
      employeeId: user._id,
    }));
  };

  const handleBreakIn = () => {
    setBreakInData((prevData) => ({
      ...prevData,
      attendanceId: attendanceId,
      breakStart: new Date(),
    }));
  };

  const handleBreakOut = () => {
    setBreakOutData((prevData) => ({
      ...prevData,
      attendanceId: attendanceId,
      breakEnd: new Date(),
    }));
  };

  const handleCheckOut = () => {
    setCheckOutData((prevData) => ({
      ...prevData,
      attendanceId: attendanceId,
      checkOut: new Date(),
    }));
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
    if (checkOutData.checkOut) {
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
      field: "checkOut",
      headerName: "Checkout Time",
      width: 150,
      renderCell: (params) => {
        const time = params.row.checkOut;
        return time ? moment(time).format("LT") : "";
      },
    },
    {
      field: "breakStart",
      headerName: "Break Start",
      width: 150,
      renderCell: (params) => {
        const time = params.row.breakStart;
        time.map((item) => {
          return item ? moment(item).format("LT") : "";
        })
      },
    },
    {
      field: "breakEnd",
      headerName: "Break End",
      width: 150,
      renderCell: (params) => {
        const time = params.row.breakEnd;
        time.map((item) => {
          return item ? moment(item).format("LT") : "";
        })
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
              disabled={!checkInBtn}
              variant="contained"
              color="info"
              onClick={handleCheckIn}
            >
              Check In
            </SoftButton>
            <SoftButton
              disabled={!breakInBtn}
              variant="contained"
              color="warning"
              onClick={handleBreakIn}
            >
              Break In
            </SoftButton>
            <SoftButton
              disabled={!breakEndBtn}
              variant="contained"
              color="warning"
              onClick={handleBreakOut}
            >
              Break Out
            </SoftButton>
            <SoftButton
              disabled={!checkOutBtn}
              variant="contained"
              color="success"
              onClick={handleCheckOut}
            >
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
          sx={{
            "& .MuiDataGrid-footerContainer": {
              "& .MuiInputBase-root": {
                width: "auto!Important",
              },
            },
          }}
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
