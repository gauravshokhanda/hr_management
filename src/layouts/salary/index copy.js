import React, { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import axios from "axios";
import { API_URL } from "config";
import {
  Box,
  Dialog,
  IconButton,
  Stack,
} from "@mui/material";
import curved14 from "assets/images/curved-images/curved14.jpg";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import EditIcon from "@mui/icons-material/Edit";
import SoftButton from "components/SoftButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import SalarySlip from "layouts/salary/salary-slip";
import { saveAs } from "file-saver";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function Salary() {
  const [salaryData, setSalaryData] = useState([]);
  const [userId, setUserId] = useState("");
  const data = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [openedMenuRow, setOpenedMenuRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [tableOpen, setTableOpen] = useState(false);

  const toggleExpand = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

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
  // Define a function to download the salary slip PDF

  const isAdmin = data?.user?.isAdmin || false;

  // In your fetchData function
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
        setSalaryData(isAdmin ? response.data : [response.data]);
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

  const initialColumns = [
    {
      field: "expaand",
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox mt={5} mb={3}>
        <Grid container justifyContent={"center"} spacing={3}>
          <Grid item xs={12} md={12} xl={12}>
            <Box
              sx={{
                borderRadius: "12px",
                backgroundImage: `url(${curved14})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height: "300px",
                width: "100%",
                px: 2,
                position: "relative",
              }}
            />
          </Grid>
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox>
              <DataGrid
                rows={salaryData}
                columns={initialColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                autoHeight
                components={{
                  Toolbar: GridToolbar,
                  // Row: (props) => {

                  //   const rowDataTable = props.row;
                  //   <>
                  //     <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  //       <Collapse in={tableOpen} timeout="auto" unmountOnExit>
                  //         <Box sx={{ margin: 1 }}>
                  //           <Typography variant="h6" gutterBottom component="div">
                  //             History
                  //           </Typography>
                  //           <Table size="small" aria-label="purchases">
                  //             <TableHead>
                  //               <TableRow>
                  //                 <TableCell>Date</TableCell>
                  //                 <TableCell>Customer</TableCell>
                  //                 <TableCell align="right">Amount</TableCell>
                  //                 <TableCell align="right">Total price ($)</TableCell>
                  //               </TableRow>
                  //             </TableHead>
                  //             <TableBody>
                  //               {console.log(rowDataTable)}
                  //             </TableBody>
                  //           </Table>
                  //         </Box>
                  //       </Collapse>
                  //     </TableCell>
                  //   </>
                  // },
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
          </Grid>
        </Grid>
      </SoftBox>

      {/* Modal Pdf View */}
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

export default Salary;
