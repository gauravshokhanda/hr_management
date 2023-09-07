
// @mui material components
import Card from "@mui/material/Card";

// Hr Management Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Hr Management Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// Data
import authorsTableData from "layouts/manageEmployee/data/authorsTableData";
import projectsTableData from "layouts/manageEmployee/data/projectsTableData";
import axios from "axios";
import { API_URL } from "config";
import { useEffect, useState } from "react";


function Employee() {

  const [employes, setEmployes] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/employes/list`, {
        header: {
          'Authorization': `token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200){
        setEmployes(response.data)
      }
    }
    catch (error) {
      console.error('There is some issue ' + error);
    }
  }
  
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const { columns, rows } = authorsTableData;
  const { columns: prCols, rows: prRows } = projectsTableData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">Authors table</SoftTypography>
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
              <Table employes={employes} columns={columns} rows={rows} />
            </SoftBox>
          </Card>
        </SoftBox>
        <Card>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            <SoftTypography variant="h6">Projects table</SoftTypography>
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
            <Table columns={prCols} rows={prRows} />
          </SoftBox>
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Employee;
