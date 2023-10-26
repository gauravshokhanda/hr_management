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
      setUserId(data.user.id);
    }
  }, [data, userId]);

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
        const rowId = params.row.id;
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
      id: rowData.id,
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
                getRowId={(row) => row.id}
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





// ////////////////////////////////////////////////////////////////////////////////////////////


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
import CustomRow from "./customRow.js";

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
      setUserId(data.user.id);
    }
  }, [data, userId]);

  const initialColumns = [
    {
      field: "expaand",
      headerName: "Expand",
      width: 130,
      renderCell: (params) => {
        return (
          <div>
            <IconButton aria-label="expand row" size="small" onClick={() => setTableOpen(!tableOpen)}>
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
        const rowId = params.row.id;
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
      id: rowData.id,
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

  const getRowParams = (params) => {
    console.log(params, "params");
    return {
      Row: CustomRow,
      data: params.row,
    };
  };

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
                collapsible
                slot={{
                  Toolbar: GridToolbar,
                  Row: (slotParams ) => <CustomRow data={slotParams.row}/>
                }}
                getRowParams={getRowParams}
                getRowId={(row) => row.id}
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



}



// //////////////////////////////////////////////////////////




import React from "react";
import MUIDataTable from "mui-datatables";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";

const Salary = (props) => {
  const columns = [
    {
      name: "Name",
    },
    {
      name: "Title",
    },
    {
      name: "Location",
    },
    {
      name: "Age",
    },
    {
      name: "Salary",
    },
  ];
  const data = [
    ["Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
    ["Business Analyst", "Business Consultant", "Dallas", 55, 200000],
    ["Jaden Collins", "Attorney", "Santa Ana", 27, 500000],
    ["Franky Rees", "Business Analyst", "St. Petersburg", 22, 50000],
    ["Aaren Rose", "Business Consultant", "Toledo", 28, 75000],
    ["Blake Duncan", "Business Management Analyst", "San Diego", 65, 94000],
    ["Frankie Parry", "Agency Legal Counsel", "Jacksonville", 71, 210000],
    ["Lane Wilson", "Commercial Specialist", "Omaha", 19, 65000],
    ["Robin Duncan", "Business Analyst", "Los Angeles", 20, 77000],
    ["Mel Brooks", "Business Consultant", "Oklahoma City", 37, 135000],
    ["Harper White", "Attorney", "Pittsburgh", 52, 420000],
    ["Kris Humphrey", "Agency Legal Counsel", "Laredo", 30, 150000],
    ["Frankie Long", "Industrial Analyst", "Austin", 31, 170000],
    ["Brynn Robbins", "Business Analyst", "Norfolk", 22, 90000],
    ["Justice Mann", "Business Consultant", "Chicago", 24, 133000],
    ["Addison Navarro", "Business Management Analyst", "New York", 50, 295000],
    ["Jesse Welch", "Agency Legal Counsel", "Seattle", 28, 200000],
    ["Eli Mejia", "Commercial Specialist", "Long Beach", 65, 400000],
    ["Gene Leblanc", "Industrial Analyst", "Hartford", 34, 110000],
    ["Danny Leon", "Computer Scientist", "Newark", 60, 220000],
    ["Lane Lee", "Corporate Counselor", "Cincinnati", 52, 180000],
    ["Jesse Hall", "Business Analyst", "Baltimore", 44, 99000],
    ["Danni Hudson", "Agency Legal Counsel", "Tampa", 37, 90000],
    ["Terry Macdonald", "Commercial Specialist", "Miami", 39, 140000],
    ["Justice Mccarthy", "Attorney", "Tucson", 26, 330000],
    ["Silver Carey", "Computer Scientist", "Memphis", 47, 250000],
    ["Franky Miles", "Industrial Analyst", "Buffalo", 49, 190000],
    ["Glen Nixon", "Corporate Counselor", "Arlington", 44, 80000],
    ["Gabby Strickland", "Business Process Consultant", "Scottsdale", 26, 45000],
    ["Mason Ray", "Computer Scientist", "San Francisco", 39, 142000],
  ];

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

  const options = {
    filter: true,
    onFilterChange: (changedColumn, filterList) => {
      console.log(changedColumn, filterList);
    },
    selectableRows: "single",
    filterType: "dropdown",
    responsive: "scrollMaxHeight",
    rowsPerPage: 10,
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => {
      console.log(rowData, rowMeta);
      return (
        <DashboardLayout>
          <DashboardNavbar />
            <tr>
              <td colSpan={6}>
                <TableContainer component={Paper}>
                  <Table style={{ minWidth: "650" }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                        <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                        <TableCell align="right">Protein&nbsp;(g)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.calories}</TableCell>
                          <TableCell align="right">{row.fat}</TableCell>
                          <TableCell align="right">{row.carbs}</TableCell>
                          <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </td>
            </tr>
            <tr>
              <td colSpan={6}>
                <TableContainer component={Paper}>
                  <Table style={{ minWidth: "650" }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                        <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                        <TableCell align="right">Protein&nbsp;(g)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.calories}</TableCell>
                          <TableCell align="right">{row.fat}</TableCell>
                          <TableCell align="right">{row.carbs}</TableCell>
                          <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </td>
            </tr>
          <Footer />
        </DashboardLayout>
      );
    },
    page: 1,
  };

  return (
    <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
  );
};

export default Salary;
