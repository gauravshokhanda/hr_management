import React, { useEffect, useState } from "react";
import SoftBox from "components/SoftBox";
import { API_URL } from "config";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";

export default function EmployesTable() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/employes/list`, {
        headers: {
          Authorization: `token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const employeeData = response.data;

        const rowsWithSrNo = employeeData.map((employee, index) => ({
          ...employee,
          srNo: index + 1,
          dateOfJoining: formatDate(employee.dateOfJoining),
        }));

        setEmployees(rowsWithSrNo);
      }
    } catch (error) {
      console.error("There is some issue " + error);
    }
  };

  // Define columns as a separate constant
  const initialColumns = [
    { field: "srNo", headerName: "Sr. No", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "userName",
      headerName: "User name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
    },
    {
      field: "isAdmin",
      headerName: "Is Admin",
      sortable: true,
      width: 160,
      renderCell: (params) =>
        params.row.isAdmin ? (
          <Chip label="Yes" color="success" />
        ) : (
          <Chip label="No" color="error" />
        ),
    },
    {
      field: "isStaff",
      headerName: "Is Staff",
      sortable: true,
      width: 160,
      renderCell: (params) =>
        params.row.isStaff ? (
          <Chip label="Yes" color="success" />
        ) : (
          <Chip label="No" color="error" />
        ),
    },
    {
      field: "dateOfJoining",
      headerName: "Date of joining",
      sortable: true,
      width: 160,
    },
    {
      field: "salary",
      headerName: "Salary",
      sortable: true,
      width: 160,
    },
  ];

  return (
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
  );
}
