// Import React and necessary components
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import Register from "layouts/authentication/register";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import EmployesTable from "./data/employesTable";
import axios from "axios";
import { API_URL } from "config";
import { Alert, CircularProgress, Snackbar } from "@mui/material";

// Define the Employee component
function Employee() {
  const [addEmployee, setAddEmployee] = useState(true);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
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

  const createSalaryAll = async () => {
    setButtonLoading(true);
    try {
      const response = await axios.post(`${API_URL}/salary/calculate-salaries`, {
        employeeIds: selectedRowIds,
      });

      if (response.status === 200) {
        setButtonLoading(false);
        const message = `Successfully Calculated salary`;
        const alertType = "success";
        displayNotification(message, alertType);
        console.log("Successfully credit salary");
      }
    } catch (error) {
      console.log("Error: ", error);
      const message = `Internal server error`;
      const alertType = "error";
      displayNotification(message, alertType);
    }
  };

  const backButton = true;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          {addEmployee ? (
            <Card>
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <SoftTypography variant="h6">Emmployee table</SoftTypography>
                <SoftBox>
                  {selectedRowIds.length > 0 ? (
                    <SoftButton
                      variant="contained"
                      color="success"
                      sx={{ mr: 2 }}
                      disabled={buttonLoading}
                      onClick={() => {
                        createSalaryAll();
                      }}
                    >
                      Create Salary{" "}
                      {buttonLoading ? (
                        <CircularProgress sx={{ ml: 1 }} color="inherit" size={14} />
                      ) : null}
                    </SoftButton>
                  ) : null}
                  <SoftButton
                    variant="contained"
                    color="info"
                    onClick={() => {
                      setAddEmployee(false);
                    }}
                  >
                    Add Employee
                  </SoftButton>
                </SoftBox>
              </SoftBox>
              <SoftBox
                sx={{
                  "& .MuiTableRow-root:not(:last-child)": {
                    "& td": {
                      borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                        `${borderWidth[1]} solid ${borderColor}`,
                    },
                  },
                }}
              >
                <EmployesTable
                  selectedRowIds={selectedRowIds}
                  setSelectedRowIds={setSelectedRowIds}
                  displayNotification={displayNotification}
                  setButtonLoading={setButtonLoading}
                  buttonLoading={buttonLoading}
                />
              </SoftBox>
            </Card>
          ) : (
            <Register backButton={backButton} setAddEmployee={setAddEmployee} />
          )}
        </SoftBox>
      </SoftBox>

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

export default Employee;
