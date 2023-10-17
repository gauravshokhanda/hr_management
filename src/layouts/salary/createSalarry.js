import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import { Box, Button, Grid, Input, Typography } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../config";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import moment from "moment";

function CreateSalary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFromData] = useState({
    employeeId: "",
    totalWorkingDays: "",
    bonus: "",
    creditMonth: "",
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFromData((prevData) => ({
      ...prevData,
      employeeId: id,
      creditMonth: moment().format("YYYY-MM-DDTHH:mm:ssZ"),
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_URL}/salary/create-salary`, formData, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        console.log(response.data, "Successfully Created Salary");
      }
    } catch (error) {
      console.log(error, "There is some error");
    }
  };

  return (
    <DashboardLayout>
      <SoftBox>
        <Grid container justifyContent={`center`}>
          <Grid item xs={12}>
            <Card>
              <SoftBox px={3} pt={3} pb={1}>
                <SoftTypography variant="h3" fontWeight="bold">
                  {id ? "Create Salary" : "No employee"}
                </SoftTypography>
              </SoftBox>
              {id ? (
                <SoftBox pt={2} pb={3} px={3}>
                  <SoftBox component="form">
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <SoftBox>
                          <SoftInput
                            name="totalWorkingDays"
                            value={formData.totalWorkingDays}
                            onChange={handleChange}
                            placeholder="Total Working Days"
                            type="number"
                          />
                        </SoftBox>
                      </Grid>
                      <Grid item xs={6}>
                        <SoftBox>
                          <SoftInput
                            name="bonus"
                            value={formData.bonus}
                            onChange={handleChange}
                            placeholder="Bonus"
                            type="number"
                          />
                        </SoftBox>
                      </Grid>
                    </Grid>
                    <SoftBox mt={4} mb={1} display="flex" justifyContent="end">
                      <SoftButton variant="gradient" onClick={handleSubmit} color="dark">
                        Create Salary
                      </SoftButton>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              ) : null}
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
}

export default CreateSalary;
