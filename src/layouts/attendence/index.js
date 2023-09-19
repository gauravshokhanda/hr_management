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
import DashboardNavbar,{ useSoftUIController } from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Hr Management Dashboard React base styles
import typography from "assets/theme/base/typography";

// Data
import { useEffect, useState } from "react";
import SoftButton from "components/SoftButton";

function Attendence() {
  const { size } = typography;
  const [buttonShow, setButtonShow] = useState(false);
  const [signInTrue, setSignInTrue] = useState(false);
  const [attendance, setAttendance] = useState([]);
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

  console.log(user, "Attendce controller");

  const fetchData = async () => {
    if(user) {
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
            checkinTime: "",
            checkoutTime: "",
            day: formatDay(item.date),
            date: formatDate(item.date),
          }));
  
          setAttendance(employeeData);
        }
      } catch (error) {
        console.error("There is some issue " + error);
      }
    }
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
      field: "checkinTime",
      headerName: "Checkin Time",
      width: 150,
    },
    {
      field: "checkoutTime",
      headerName: "Checkout Time",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        console.log(params.row.status);
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
    if (currentPage === "/attendence") {
      handleClickOpen();
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    setSignInTrue(false);
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
            <SoftButton variant="contained" color="info">
              Check In
            </SoftButton>
            <SoftButton variant="contained" color="warning">
              Break
            </SoftButton>
            <SoftButton variant="contained" color="success">
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
