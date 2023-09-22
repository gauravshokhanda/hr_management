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

// Define the Employee component
function Employee() {
  const [addEmployee, setAddEmployee] = useState(true);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          {addEmployee ? (
            <Card>
              <SoftBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={3}
              >
                <SoftTypography variant="h6">Authors table</SoftTypography>
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
              <SoftBox
                sx={{
                  "& .MuiTableRow-root:not(:last-child)": {
                    "& td": {
                      borderBottom: ({
                        borders: { borderWidth, borderColor },
                      }) => `${borderWidth[1]} solid ${borderColor}`,
                    },
                  },
                }}
              >
                <EmployesTable />
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
