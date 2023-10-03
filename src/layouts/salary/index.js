import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import axios from "axios";
import { API_URL } from "config";
import { Box, Dialog, IconButton, Stack } from "@mui/material";
import curved14 from "assets/images/curved-images/curved14.jpg";
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

function Salary() {
  const [salaryData, setSalaryData] = useState([]);
  const [userId, setUserId] = useState("");
  const data = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [openedMenuRow, setOpenedMenuRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [employeeId, setEmployeeId] = useState("");

  const toggleExpand = (row) => {
    setEmployeeId(row.employeeId);
    if (expandedRow === row._id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(row._id);
    }
  };

  console.log(employeeId, "Employee id");
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
    if (data && data.user) {
      setUserId(data.user._id);
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

  const renderRow = (row) => {
    const isOpen = openedMenuRow === row._id;

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
      <TableRow key={row._id}>
        {initialColumns.map((column) => {
          if (column.field === "action") {
            return (
              <TableCell key={column.field}>
                <Stack spacing={2}>
                  <SoftButton
                    aria-controls={isOpen ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={isOpen ? "true" : undefined}
                    onClick={(event) => handleClick(event, row._id)}
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
              <TableContainer>
                <Table>
                  <TableHead sx={{ display: "table-header-group" }}>
                    <TableRow>
                      <TableCell></TableCell>
                      {initialColumns.map((column) => (
                        <TableCell key={column.field}>{column.headerName}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salaryData.map((row) => (
                      <React.Fragment key={row._id}>
                        <TableRow>
                          <TableCell>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => toggleExpand(row)}
                            >
                              {expandedRow === row._id ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          </TableCell>
                          {initialColumns.map((column) => {
                            if (column.field === "action") {
                              const rowId = row._id;
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
                                            >
                                              Delete Salary
                                            </MenuItem>,
                                          ]
                                        : null}
                                    </Menu>
                                  </Stack>
                                </TableCell>
                              );
                            } else {
                              return <TableCell key={column.field}>{row[column.field]}</TableCell>;
                            }
                          })}
                        </TableRow>
                        {expandedRow === row._id && (
                          <TableRow>
                            <TableCell colSpan={initialColumns.length + 1}>
                              <SoftBox sx={{ boxShadow: 1, m: 2, py: 1, borderRadius: 2 }}>
                                <Table>
                                  <TableHead sx={{ display: "table-header-group" }}>
                                    <TableRow>
                                      {initialColumns.map((column) => (
                                        <TableCell key={column.field}>
                                          {column.headerName}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {salaryData.map((row) => (
                                      <React.Fragment key={row._id}>
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
                </Table>
              </TableContainer>
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
