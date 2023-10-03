import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import SoftBox from "components/SoftBox";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "config";
import CustomRow from "./customRow.js";
import SalarySlip from "layouts/salary/salary-slip";
import { saveAs } from "file-saver";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import { Box, Dialog, IconButton, Stack } from "@mui/material";
import SoftButton from "components/SoftButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Footer from "examples/Footer/index.js";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function CollapsibleTable() {
  const data = useSelector((state) => state.auth);

  const [salaryData, setSalaryData] = useState([]);
  const [userId, setUserId] = useState("");
  const [openedMenuRow, setOpenedMenuRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [tableOpen, setTableOpen] = useState(false);


  console.log(salaryData, "Salary Data");

  const handleCloseDailog = () => {
    setOpen(!open);
  };
  const handleClickOpenDailog = () => {
    setOpen(true);
  };
  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setOpenedMenuRow(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenedMenuRow(null);
  };

  const generatePdf = async (rowData) => {
    if (rowData) {
      try {
        const pdfBlob = await pdf(<SalarySlip salaryData={rowData} />).toBlob();
        saveAs(pdfBlob, `${rowData.employeeName}_salary_slip.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  };

  const deleteSalary = async (rowData) => {
    console.log(rowData, "Delete");

    const deleteBodyData = {
      employeeId: rowData.employeeId,
      _id: rowData._id,
    };

    console.log(deleteBodyData, "Body Data");
    if (rowData) {
      try {
        const response = await axios.delete(`${API_URL}/salary/delete-salary/`, {
          data: deleteBodyData,
        });
      } catch (error) {
        console.error("Error Deleting Salary:", error);
      }
    }
  };

  const isAdmin = data?.user?.isAdmin || false;

  const fetchData = async () => {
    try {
      const response = await axios.get(
        isAdmin
          ? `${API_URL}/salary/view/employees-salary`
          : `${API_URL}/salary/view-salary/${userId}`,
        {
          headers: {
            Authorization: `${data.token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Successfully found user");
        const responseData = isAdmin ? response.data : [response.data];
        setSalaryData(responseData);

      }
    } catch (error) {
      console.log("Something went wrong " + error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, data]);

  useEffect(() => {
    if (data && data.user) {
      setUserId(data.user._id);
    }
  }, [data, userId]);

  const initialColumns = [
    {
      field: "expand",
      headerName: "Expand",
      width: 130,
      renderCell: (params) => {
        return (
          <div>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!tableOpen)}>
              {tableOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </div>
        );
      },
    },
    {
      field: "employeeName",
      headerName: "Name",
      width: 130,
      renderCell: (params) => {
        console.log("params:", params);
      }
    },
    {
      field: "monthlySalary",
      headerName: "Salary",
      width: 130,
    },
    {
      field: "totalWorkingDays",
      headerName: "Working Days",
      width: 130,
    },
    {
      field: "totalSalary",
      headerName: "Total Salary",
      width: 130,
    },
    {
      field: "bonus",
      headerName: "Bonus",
      width: 130,
    },
    {
      field: "basicSalary",
      headerName: "Basic Salary",
      width: 130,
    },
    {
      field: "hraSalary",
      headerName: "HRA Salary",
      width: 130,
    },
    {
      field: "conveyance",
      headerName: "Conveyance",
      width: 130,
    },
    {
      field: "pfSalary",
      headerName: "PF Salary",
      width: 130,
    },
    {
      field: "action",
      headerName: "Action",
      width: 160,
      renderCell: (params) => {
        const rowId = params.row._id;
        const isOpen = openedMenuRow === rowId;

        const handleViewSalarySlipClick = () => {
          setSelectedRowData(params.row);
          handleClickOpenDailog();
        };

        const handleViewSalarySlipDownload = () => {
          generatePdf(params.row);
        };

        const handleDeleteSalary = () => {
          deleteSalary(params.row);
        };

        return (
          <Stack spacing={2}>
            <SoftButton
              aria-controls={isOpen ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={isOpen ? "true" : undefined}
              onClick={(event) => handleClick(event, rowId)}
              iconOnly
              variant="contained"
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
              <MenuItem onClick={handleViewSalarySlipClick}>View Salary Slip</MenuItem>
              <MenuItem onClick={handleViewSalarySlipDownload}>Download Salary Slip</MenuItem>
              {isAdmin
                ? [
                    <MenuItem key="delete-salary" onClick={handleDeleteSalary}>
                      Edit Salary
                    </MenuItem>,
                    <MenuItem key="delete-salary" onClick={handleDeleteSalary}>
                      Delete Salary
                    </MenuItem>,
                  ]
                : null}
            </Menu>
          </Stack>
        );
      },
    },
  ];

  console.log("initialColumns:", initialColumns);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox mt={5} mb={3}>
        <Paper style={{ width: "100%" }}>
          <DataGrid
            rows={salaryData}
            columns={initialColumns}
            pageSize={10}
            autoHeight
            getRowId={(row) => row._id}
            components={{
              Row: (initialColumns) => <CustomRow data={initialColumns.row} />,
            }}
            sx={{
              "& .MuiDataGrid-footerContainer": {
                "& .MuiInputBase-root": {
                  width: "auto!Important",
                },
              },
            }}
          />
        </Paper>
      </SoftBox>
      <Dialog
        fullWidth
        maxWidth="800px"
        sx={{
          "& iframe": {
            height: "900px",
          },
        }}
        onClose={handleCloseDailog}
        open={open}
      >
        <PDFViewer onClose={handleCloseDailog} open={open}>
          <SalarySlip salaryData={selectedRowData} />
        </PDFViewer>
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}
