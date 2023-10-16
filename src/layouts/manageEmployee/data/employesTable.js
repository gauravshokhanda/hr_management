import React, { useEffect, useState } from "react";
import SoftBox from "components/SoftBox";
import { API_URL } from "config";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Avatar, Chip, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import SoftButton from "components/SoftButton";
import EditIcon from "@mui/icons-material/Edit";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Loader from "loader";

export default function EmployesTable({ setSelectedRowIds, selectedRowIds }) {
  const [employees, setEmployees] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openedMenuRow, setOpenedMenuRow] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(employees, "employees table");

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setOpenedMenuRow(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenedMenuRow(null);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/employes/list`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
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
        setLoading(false);
      }
    } catch (error) {
      console.error("There is some issue " + error);
    }
  };

  // Define columns as a separate constant
  const initialColumns = [
    { field: "srNo", headerName: "Sr. No", width: 70 },
    {
      field: "image",
      headerName: "User Image",
      width: 130,
      renderCell: (params) => {
        return <Avatar src={`${API_URL}/${params.row.image}`} alt={params.row.userName} />;
      },
    },
    {
      field: "firstName",
      headerName: "First name",
      width: 130,
      renderCell: (params) => (
        <Link to={`/manageEmployee/${params.row._id}`} style={{ color: "inherit" }}>
          {params.row.firstName}
        </Link>
      ),
    },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "userName",
      headerName: "User name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
    },
    {
      field: "userEmail",
      headerName: "User Email",
      sortable: true,
      width: 250,
    },
    {
      field: "isAdmin",
      headerName: "Is Admin",
      sortable: true,
      width: 100,
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
      width: 100,
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
      width: 200,
    },
    {
      field: "salary",
      headerName: "Salary",
      sortable: true,
      width: 100,
    },
    {
      field: "accountNumber",
      headerName: "Account Number",
      sortable: true,
      width: 100,
    },
    {
      field: "ifscCode",
      headerName: "IFSC Code",
      sortable: true,
      width: 100,
    },
    {
      field: "action",
      headerName: "Action",
      width: 160,
      renderCell: (params) => {
        const rowId = params.row._id;
        const isOpen = openedMenuRow === rowId;

        return (
          <Stack spacing={2}>
            <SoftButton
              aria-controls={isOpen ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={isOpen ? "true" : undefined}
              onClick={(event) => handleClick(event, rowId)}
              iconOnly
              variant="contained" // Fix the typo here
            >
              <EditIcon />
            </SoftButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem>
                <Link to={`/register/${params.row._id}`} style={{ color: "inherit" }}>
                  Edit Employee
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to={`/attendence/${params.row._id}`} style={{ color: "inherit" }}>
                  View Attendence
                </Link>
              </MenuItem>
              <MenuItem key="create-salary">
                <Link to={`/salary/create-salary/${params.row._id}`} style={{ color: "inherit" }}>
                  Create Salary
                </Link>
              </MenuItem>
              <MenuItem key="create-salary">
                <Link to={`/profile/${params.row._id}`} style={{ color: "inherit" }}>
                  View Profile
                </Link>
              </MenuItem>
              <MenuItem>Delete Employee</MenuItem>
            </Menu>
          </Stack>
        );
      },
    },
  ];

  return (
    <SoftBox>
      {loading ? (
        <Loader />
      ) : (
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
          checkboxSelection
          rowSelectionModel={selectedRowIds}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          onRowSelectionModelChange={(newSelectionModel) => {
            setSelectedRowIds(newSelectionModel);
          }}
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
  );
}
