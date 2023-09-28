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

// Define the Employee component
function Employee() {
  const [addEmployee, setAddEmployee] = useState(true);
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const createSalaryAll = async () => {
    try {
      const response = await axios.post(`${API_URL}/salary/calculate-salaries`, {employeeIds : selectedRowIds});
  
      if (response.status === 200) {
        console.log("Successfully credit salary");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          {addEmployee ? (
            <Card>
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <SoftTypography variant="h6">Authors table</SoftTypography>
                <SoftBox>
                  {selectedRowIds.length > 0 ? (
                    <SoftButton
                      variant="contained"
                      color="success"
                      sx={{mr: 2}}
                      onClick={() => {
                        createSalaryAll();
                      }}
                    >
                      Create Salary
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
                />
              </SoftBox>
            </Card>
          ) : (
            <Register />
          )}
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Employee;
