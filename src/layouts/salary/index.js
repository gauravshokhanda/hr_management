import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import axios from "axios";
import { API_URL } from "config";
import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Snackbar,
  Stack,
  TableFooter,
  TablePagination,
  TableSortLabel,
  Typography,
} from "@mui/material";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import EditIcon from "@mui/icons-material/Edit";
import SoftButton from "components/SoftButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SalarySlip from "layouts/salary/salary-slip";
import { saveAs } from "file-saver";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Link } from "react-router-dom";
import SoftInput from "components/SoftInput";
import Loader from "loader";
import moment from "moment";

function Salary() {
  const [salaryData, setSalaryData] = useState([]);
  const [employeSalaryData, setEmployeSalaryData] = useState([]);
  const [userId, setUserId] = useState("");
  const data = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [openedMenuRow, setOpenedMenuRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  const displayNotification = (message, alertType) => {
    setNotificationOpen(true);
    setNotificationMessage(message);
    setSeverity(alertType);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toggleExpand = (row) => {
    setEmployeeId(row.employeeId);
    if (expandedRow === row.id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(row.id);
    }
  };

  const sortedSalaryData = [...salaryData].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (sortOrder === "asc") {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
    } else {
      if (aValue > bValue) return -1;
      if (aValue < bValue) return 1;
    }

    return 0;
  });

  const filteredSalaryData = sortedSalaryData.filter(
    (row) =>
      row &&
      row.employeeName &&
      typeof row.employeeName === "string" &&
      row.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    console.log("Search Query:", event.target.value); // Add this line
  };

  const handleSortClick = (columnField) => {
    if (sortBy === columnField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnField);
      setSortOrder("asc");
    }
  };

  const fetchEmployeeSalary = async () => {
    try {
      const response = await axios.get(`${API_URL}/salary/view-salary/${employeeId}`);
      if (response.status === 200) {
        console.log("Succesfully found salary Record");
        setEmployeSalaryData(response.data);
      }
    } catch (error) {
      console.error(error, "There is some error");
    }
  };

  const filterUniqueEmployees = (salaryData) => {
    const uniqueEmployees = {};

    for (let i = salaryData.length - 1; i >= 0; i--) {
      const employee = salaryData[i];
      if (!(employee.employeeId in uniqueEmployees)) {
        uniqueEmployees[employee.employeeId] = employee;
      }
    }

    return Object.values(uniqueEmployees);
  };

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
        const uniqueEmployees = isAdmin ? response.data : response.data;
        const filteredEmployees = filterUniqueEmployees(uniqueEmployees);
        setSalaryData(filteredEmployees);
        console.log(response.data, "Response");
        setLoading(false);
      }
    } catch (error) {
      console.log("Something went wrong " + error);
    }
  };

  const paginateData = (data, page, rowsPerPage) => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const paginatedSalaryData = paginateData(filteredSalaryData, page, rowsPerPage);

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

  useEffect(() => {
    fetchData();
  }, [userId, data]);

  useEffect(() => {
    fetchEmployeeSalary();
  }, [employeeId]);

  useEffect(() => {
    if (data && data.user) {
      setUserId(data.user.id);
    }
  }, [data, userId]);

  const initialColumns = [
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
      field: "creditMonth",
      headerName: "Credit Month",
      width: 130,
    },
    {
      field: "action",
      headerName: "Action",
      width: 160,
    },
  ];

  const expandColumns = [
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
      field: "creditMonth",
      headerName: "Credit Month",
      width: 130,
    },
    {
      field: "action",
      headerName: "Action",
      width: 160,
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
    setButtonLoading(true);

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
        if (response.status === 200) {
          const message = `Successfully deleted salary`;
          const alertType = "success";
          displayNotification(message, alertType);
          setButtonLoading(false);
          fetchData();
        }
      } catch (error) {
        const message = `Internal server error`;
        const alertType = "error";
        displayNotification(message, alertType);
        setButtonLoading(false);
        console.error("Error Deleting Salary:", error);
      }
    }
  };

  const isAdmin = data?.user?.isAdmin || false;

  const renderRow = (row) => {
    const isOpen = openedMenuRow === row.id;

    const handleViewSalarySlipClick = () => {
      setSelectedRowData(row);
      handleClickOpenDailog();
    };

    const handleViewSalarySlipDownload = () => {
      generatePdf(row);
    };

    const handleDeleteSalary = () => {
      deleteSalary(row);
    };

    return (
      <TableRow key={row.id}>
        {expandColumns.map((column) => {
          if (column.field === "action") {
            return (
              <TableCell key={column.field}>
                <Stack spacing={2}>
                  <SoftButton
                    aria-controls={isOpen ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={isOpen ? "true" : undefined}
                    onClick={(event) => handleClick(event, row.id)}
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
                          <MenuItem key="create-salary">
                            <Link
                              to={`/salary/create-salary/${employeeId}`}
                              style={{ color: "inherit" }}
                            >
                              Create Salary
                            </Link>
                          </MenuItem>,
                          <MenuItem key="delete-salary" onClick={handleDeleteSalary}>
                            Delete Salary
                          </MenuItem>,
                        ]
                      : null}
                  </Menu>
                </Stack>
              </TableCell>
            );
          } else if (column.field === "creditMonth") {
            return <TableCell key={column.field}>{moment(row.creditMonth).format("LL")}</TableCell>;
          } else {
            return <TableCell key={column.field}>{row[column.field]}</TableCell>;
          }
        })}
      </TableRow>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox mt={5} mb={3}>
        <Grid container justifyContent={"center"} spacing={3}>
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox>
              {loading ? (
                <Loader />
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell colSpan={12}>
                          <SoftInput
                            fullWidth
                            placeholder="Search by Name"
                            variant="outlined"
                            value={searchQuery}
                            onChange={handleSearch}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell></TableCell>
                        {initialColumns.map((column) => (
                          <TableCell
                            key={column.field}
                            onClick={() => handleSortClick(column.field)}
                            style={{ cursor: "pointer" }}
                          >
                            <TableSortLabel
                              active={sortBy === column.field}
                              direction={sortBy === column.field ? sortOrder : "asc"}
                            >
                              {column.headerName}
                            </TableSortLabel>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedSalaryData.map((row) => (
                        <React.Fragment key={row.id}>
                          <TableRow>
                            <TableCell>
                              <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => toggleExpand(row)}
                              >
                                {expandedRow === row.id ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </IconButton>
                            </TableCell>
                            {initialColumns.map((column) => {
                              if (column.field === "action") {
                                const rowId = row.id;
                                const isOpen = openedMenuRow === rowId;
                                // const rowEmployeeId = row.employeeId;

                                const handleViewSalarySlipClick = () => {
                                  setSelectedRowData(row);
                                  handleClickOpenDailog();
                                };

                                const handleViewSalarySlipDownload = () => {
                                  generatePdf(row);
                                };

                                const handleDeleteSalary = () => {
                                  deleteSalary(row);
                                };

                                return (
                                  <TableCell key={column.field}>
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
                                        <MenuItem onClick={handleViewSalarySlipClick}>
                                          View Salary Slip
                                        </MenuItem>
                                        <MenuItem onClick={handleViewSalarySlipDownload}>
                                          Download Salary Slip
                                        </MenuItem>
                                        {isAdmin
                                          ? [
                                              <MenuItem key="create-salary">
                                                <Link
                                                  to={`/salary/create-salary/${row.employeeId}`}
                                                  style={{ color: "inherit" }}
                                                >
                                                  Create Salary
                                                </Link>
                                              </MenuItem>,
                                              <MenuItem
                                                key="delete-salary"
                                                onClick={handleDeleteSalary}
                                                disabled={buttonLoading}
                                              >
                                                Delete Salary
                                                {buttonLoading ? (
                                                  <CircularProgress
                                                    sx={{ ml: 1 }}
                                                    color="inherit"
                                                    size={14}
                                                  />
                                                ) : null}
                                              </MenuItem>,
                                            ]
                                          : null}
                                      </Menu>
                                    </Stack>
                                  </TableCell>
                                );
                              } else if (column.field === "creditMonth") {
                                return (
                                  <TableCell key={column.field}>
                                    {moment(row.creditMonth).format("LL")}
                                  </TableCell>
                                );
                              } else {
                                return (
                                  <TableCell key={column.field}>{row[column.field]}</TableCell>
                                );
                              }
                            })}
                          </TableRow>
                          {expandedRow === row.id && (
                            <TableRow>
                              <TableCell colSpan={expandColumns.length + 1}>
                                <SoftBox sx={{ boxShadow: 1, m: 2, borderRadius: 3 }}>
                                  <Table>
                                    <TableHead sx={{ display: "table-header-group" }}>
                                      <TableRow>
                                        {expandColumns.map((column) => (
                                          <TableCell key={column.field}>
                                            {column.headerName}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {employeSalaryData.map((row) => (
                                        <React.Fragment key={row.id}>
                                          {renderRow(row)}
                                        </React.Fragment>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </SoftBox>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={12}>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={salaryData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{
                              "& .MuiInputBase-root": {
                                width: "auto!important",
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              )}
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

      {/* Alert toast */}
      <Snackbar
        autoHideDuration={5000}
        open={notificationOpen}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseNotification} severity={severity} sx={{ width: "100%" }}>
          {notificationMessage}
        </Alert>
      </Snackbar>
      <Footer />
    </DashboardLayout>
  );
}

export default Salary;
