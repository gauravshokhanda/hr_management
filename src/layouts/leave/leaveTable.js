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
import EditIcon from '@mui/icons-material/Edit';

export default function LeaveTable({ isAdmin }) {
  console.log(isAdmin, "isAdmin");
  const [leaves, setHolidays] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [clickEvent, setClickEvent] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenUpdate = () => {
    setUpdateOpen(true);
  };

  const handleClickcloseUpdate = () => {
    setUpdateOpen(false);
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
      const response = await axios.get(`${API_URL}/leave/leave-list`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const leaveData = response.data;

        const rowsWithSrNo = leaveData.map((leave, index) => ({
          ...leave,
          srNo: index + 1,
          day: moment(leave.start).format("dddd"),
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

  const handleUpdateEvent = async (eve) => {
    setDeleteId(eve.id);
    setDeleteName(eve.title);
    handleClickOpenUpdate();
    setClickEvent(eve);
  };

  const deleteEvent = async () => {
    setButtonLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/leave/leave-list/${deleteId}`);

      if (response.status === 200) {
        setButtonLoading(false);
        fetchData();
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

  const updateEvent = async (status) => {

    const updateData = { leaveStatus: status === "no" ? false : true };

    setButtonLoading(true);
    try {
      const response = await axios.put(`${API_URL}/leave/leave-list/${deleteId}`, updateData);

      if (response.status === 200) {
        setButtonLoading(false);
        fetchData();
        const message = "Successfully Update Notice";
        const alertType = "success";

        displayNotification(message, alertType);
        setDeleteId("");
        setDeleteName("");
        handleClickcloseUpdate();
      }
    } catch (error) {
      console.error("There is someee  error", error);
    }

  };
  

  // Define columns as a separate constant
  const initialColumns = [
    { field: "srNo", headerName: "Sr. No", width: 70 },
    { field: "day", headerName: "Day", width: 130 },
    { field: "employeName", headerName: "Employe Name", width: 130 },
    {
      field: "start",
      headerName: "Date",
      width: 160,
      renderCell: (params) => <div>{moment(params.row.start).format("LL")}</div>,
    },
    {
      field: "end",
      headerName: "End Date",
      width: 200,
      renderCell: (params) => <Box>{moment(params.row.end).format("LL")}</Box>,
    },
    {
      field: "title",
      headerName: "Leave Title",
      width: 200,
      renderCell: (params) => (
        <Typography varient="h4">
          {params.row.title.charAt(0).toUpperCase() + params.row.title.slice(1)}
        </Typography>
      ),
    },
    {
      field: "leaveMessage",
      headerName: "Leave Description",
      width: 200,
      renderCell: (params) => (
        <Typography varient="h4">
          {params.row.title.charAt(0).toUpperCase() + params.row.title.slice(1)}
        </Typography>
      ),
    },
    {
      field: "leaveStatus",
      headerName: "Leave Status",
      width: 200,
      renderCell: (params) => (
        <Typography varient="h4">
          {params.row.leaveStatus === null ? "Not Updated" : (params.row.leaveStatus === true ? "Approved" : "Not Approved")}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 160,
      renderCell: (params) => {
        return (
          <Stack spacing={2} direction={'row'}>
            <SoftButton
              circular
              iconOnly
              color="error"
              onClick={() => handleDeleteEvent(params.row)}
            >
              <DeleteIcon />
            </SoftButton>
            <SoftButton
              circular
              iconOnly
              color="primary"
              onClick={() => handleUpdateEvent(params.row)}
            >
              <EditIcon />
            </SoftButton>
          </Stack>
        );
      },
    },
  ];

  return (
    <>
      <SoftBox mt={5}>
        {loading ? (
          <Loader />
        ) : (
          <DataGrid
            rows={leaves}
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

      {/* Update MOdal */}
      <Dialog maxWidth="xs" fullWidth open={updateOpen} onClose={handleClickcloseUpdate}>
        <DialogTitle>Update Leave</DialogTitle>
        <DialogContent>
          <DialogContentText>Approve Leave {deleteName}!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <SoftButton onClick={handleClickcloseUpdate}>Cancel</SoftButton>
          <SoftButton
            disabled={buttonLoading || !clickEvent.leaveStatus}
            color="error"
            onClick={() => updateEvent("no")}
          >
            No Approve
            {buttonLoading && <CircularProgress color="secondary" sx={{ ml: 2 }} size={22} />}
          </SoftButton>

          <SoftButton
            disabled={buttonLoading || clickEvent.leaveStatus}
            color="info"
            onClick={() => updateEvent("yes")}
          >
            Approve
            {buttonLoading && <CircularProgress color="secondary" sx={{ ml: 2 }} size={22} />}
          </SoftButton>

        </DialogActions>
      </Dialog>

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
