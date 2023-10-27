import React, { useEffect, useState } from "react";
import SoftBox from "components/SoftBox";
import { API_URL } from "config";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Alert, Avatar, Box, Chip, CircularProgress, Snackbar, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SoftButton from "components/SoftButton";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Loader from "loader";

export default function HolidayTable({ isAdmin }) {
  console.log(isAdmin, "isAdmin");
  const [holidays, setHolidays] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);  
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  const displayNotification = (message, alertType) => {
    setNotificationMessage(message);
    setNotificationOpen(true);
    setSeverity(alertType);
  };


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
        setLoading(false);
      }
    } catch (error) {
      console.error("There is some issue " + error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteEvent = async (eve) => {
    setDeleteId(eve.id);
    setDeleteName(eve.title);
    handleClickOpen();
  };

  const deleteEvent = async () => {
    setButtonLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/holiday/holiday-list/${deleteId}`);

      if (response.status === 200) {
        fetchData();
        setDeleteId("");
        setDeleteName("");
        handleClose();
        const message = "Successfully Delete Notice";
        const alertType = "success";
        displayNotification(message, alertType);
        setDeleteId("");
        setDeleteName("");
        handleClose();
      }
    } catch (error) {
      console.error("There is someee  error", error);
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
    isAdmin
      ? {
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
                  onClick={() => handleDeleteEvent(params.row)}
                >
                  <DeleteIcon />
                </SoftButton>
              </Stack>
            );
          },
        }
      : {
          field: null,
        },
  ];

  return (
    <>
      <SoftBox mt={5}>
        {loading ? (
          <Loader />
        ) : (
          <DataGrid
            rows={holidays}
            columns={initialColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
            components={{
              Toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => row.id}
            checkboxSelection
            sx={{
              "& .MuiDataGrid-footerContainer": {
                "& .MuiInputBase-root": {
                  width: "auto!Important",
                },
              },
            }}
          />
        )}
      </SoftBox>

      {/* Delete MOdal */}
      <Dialog maxWidth="xs" fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Delete event</DialogTitle>
        <DialogContent>
          <DialogContentText>Do you want to delete {deleteName}!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <SoftButton onClick={handleClose}>Cancel</SoftButton>
          <SoftButton disabled={buttonLoading} color="error" onClick={deleteEvent}>
            Delete
            {buttonLoading ? <CircularProgress color="secondary" sx={{ ml: 2 }} size={22} /> : null}
          </SoftButton>
        </DialogActions>
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
    </>
  );
}
