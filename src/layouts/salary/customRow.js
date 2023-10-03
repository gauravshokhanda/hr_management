import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box } from "@mui/material";

function CustomRow(props) {
  const { data } = props;
  const [open, setOpen] = useState(false);

  // Define your columns
  const columns = [
    { field: "employeeName", headerName: "Employee Name", flex: 1 },
    { field: "monthlySalary", headerName: "Monthly Salary", flex: 1 },
    { field: "totalWorkingDays", headerName: "Working Days", flex: 1 },
    { field: "totalSalary", headerName: "Total Salary", flex: 1 },
    { field: "bonus", headerName: "Bonus", flex: 1 },
    { field: "basicSalary", headerName: "Basic Salary", flex: 1 },
    { field: "hraSalary", headerName: "HRA", flex: 1 },
    { field: "conveyance", headerName: "Conveyance", flex: 1 },
    { field: "pfSalary", headerName: "PF", flex: 1 },
    { field: "creditMonth", headerName: "Credit Month", flex: 1 },
  ];

  return (
    <Box>
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={() => {
          setOpen(!open);
        }}
      >
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
      {open && (
        <Box>
          <DataGrid
            columns={columns}
            rows={[data]}
            getRowId={(row) => row._id}
            sx={{}}
            autoHeight
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            disableSelectionOnClick
          />
        </Box>
      )}
    </Box>
  );
}

export default CustomRow;
