import { useParams } from "react-router-dom";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { API_URL } from "config";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function EmployeeDetail() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const formatDay = (dateString) => {
    const options = { weekday: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const { id } = useParams();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/employes/${id}/attendance`, {
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
            {params.row.status === 'absent' ? <Chip variant="filled" color="error" label="Absent"/> : <Chip variant="filled" color="success" label="Present"/>}
          </Box>
        );
      }
    },    
  ];
  

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
    </DashboardLayout>
  );
}
