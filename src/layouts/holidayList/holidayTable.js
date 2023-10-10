import React, { useEffect, useState } from "react";
import SoftBox from "components/SoftBox";
import { API_URL } from "config";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SoftButton from "components/SoftButton";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";

export default function HolidayTable({ handleDeleteEvent }) {
  const [holidays, setHolidays] = useState([]);

  console.log(holidays, "holidays table");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/holiday/holiday-list`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const holidayData = response.data;

        const rowsWithSrNo = holidayData.map((holiday, index) => ({
          ...holiday,
          srNo: index + 1,
          day: moment(holiday.start).format("dddd"),
        }));

        setHolidays(rowsWithSrNo);
      }
    } catch (error) {
      console.error("There is some issue " + error);
    }
  };

  // Define columns as a separate constant
  const initialColumns = [
    { field: "srNo", headerName: "Sr. No", width: 70 },
    { field: "day", headerName: "Day", width: 130 },
    {
      field: "start",
      headerName: "Date",
      width: 160,
      renderCell: (params) => <div>{moment(params.row.start).format("LL")}</div>,
    },
    {
      field: "end",
      headerName: "End Date",
      width: 160,
      renderCell: (params) => <Box>{moment(params.row.end).format("LL")}</Box>,
    },
    {
      field: "holiday",
      headerName: "Holiday",
      width: 160,
      renderCell: (params) => (
        <Chip
          color={params.row.holiday ? "success" : "warning"}
          label={params.row.holiday ? "Yes" : "No"}
        />
      ),
    },
    {
      field: "title",
      headerName: "Event Name",
      width: 160,
      renderCell: (params) => (
        <Typography varient="h4">
          {params.row.title.charAt(0).toUpperCase() + params.row.title.slice(1)}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 160,
      renderCell: (params) => {
        return (
          <Stack spacing={2}>
            <SoftButton
              circular
              iconOnly
              color="error"
              onClick={() => handleDeleteEvent(params.row._id)}
            >
              <DeleteIcon />
            </SoftButton>
          </Stack>
        );
      },
    },
  ];

  return (
    <SoftBox mt={5}>
      <DataGrid
        rows={holidays}
        columns={initialColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
        components={{
          Toolbar: GridToolbar,
        }}
        getRowId={(row) => row._id}
        checkboxSelection
      />
    </SoftBox>
  );
}
