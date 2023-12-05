import React, { useState, useRef, useEffect } from "react";
import SoftBox from "components/SoftBox";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";
import axios from "axios";
import { API_URL } from "config";
import { Stack, Switch, Typography } from "@mui/material";
import moment from "moment";
import Loader from "loader";
import SoftButton from "components/SoftButton";
import { useSelector } from "react-redux";
import LeaveTable from "./leaveTable";

function Leave() {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [deleteEventModalOpen, setDeleteEventModalOpen] = useState(false);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventMessage, setEventMessage] = useState("");
  const [clickedEventInfo, setClickedEventInfo] = useState(null);
  // const [showTable, setShowTable] = useState(true);
  // const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(true);

  const data = useSelector((state) => state.auth);

  const isAdmin = data?.user?.isAdmin || false;
  const userId = data?.user?._id || false;

  const calendarRef = useRef(null);

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setClickedEventInfo(clickInfo);
    setDeleteEventModalOpen(true);
  };

  const handleDateSelect = ({ start, end, allDay }) => {
    setSelectedDate({ start, end, allDay });
    setCreateEventModalOpen(true);
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/leave/leave-list/${userId}`);

      if (response.status === 200) {
        const eventData = response.data === null ? [] : response.data;

        console.log(eventData, "eventData");

        // Ensure eventData is an array before updating the state
        if (Array.isArray(eventData)) {
          setCurrentEvents((prevEvents) => [...prevEvents, ...eventData]);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("There is some error", error);
    }
  };


  console.log(currentEvents, "currentenvents  ");

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async () => {
    const calendarApi = calendarRef.current.getApi();

    if (selectedDate && eventTitle) {
      const newEvent = {
        title: eventTitle,
        start: selectedDate.start.toISOString(),
        end: selectedDate.end.toISOString(),
        allDay: selectedDate.allDay,
        leaveMessage: eventMessage,
        employeeId: userId,
      };

      try {
        const response = await axios.post(`${API_URL}/leave/leave-list`, newEvent);

        if (response.status === 200) {
          fetchEvents();
          const data = response.data;

          setCurrentEvents((prevEvents) => [
            ...prevEvents,
            {
              id: data.id,
              title: data.title,
              start: data.start,
              end: data.end,
              allDay: data.allDay,
            },
          ]);

          setCreateEventModalOpen(false);
          setSelectedDate(null);
          setEventTitle("");
          setEventMessage("");
        } else {
          console.error("Failed to create event");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // const handleEventDrop = async (dropInfo) => {
  //   const event = dropInfo.event;
  //   const updatedEvent = {
  //     start: event.start.toISOString(),
  //     end: event.end.toISOString(),
  //     allDay: event.allDay,
  //   };

  //   try {
  //     const response = await axios.put(`${API_URL}/leave/leave-list/${event.id}`, updatedEvent);

  //     if (response.status === 200) {
  //       fetchEvents();
  //       console.log("Event updated successfully");
  //     } else {
  //       console.error("Failed to update event:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error updating event:", error);
  //   }
  // };

  const handleDeleteEvent = async () => {
    const event = clickedEventInfo.event;

    const id = event._def.publicId;

    try {
      const response = await axios.delete(`${API_URL}/leave/leave-list/${id}`);

      if (response.status === 200) {
        fetchEvents();
        console.log("Deleted successfully");
      }
    } catch (error) {
      console.error("There is some error", error);
    }
    setDeleteEventModalOpen(false);
  };

  const closeCreateEventModal = () => {
    setCreateEventModalOpen(false);
  };

  const closeDeleteEventModal = () => {
    setDeleteEventModalOpen(false);
  };


  const transformedEvents = currentEvents?.map((event) => ({
    title: event.title,
    start: event.start,
    end: event.end,
    id: event.id,
    textColor:  event.leaveStatus === null ? "#000" : "#fff",
    color: event.leaveStatus === null ? "#e8e9c0" : event.leaveStatus ? "#82bf5b" : "#e54728",
    customText: event.leaveStatus === null ? "Not Viewed" : event.leaveStatus ? "Approved" : "Not Approved",
  }));


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box mt={5} display="flex" alignItems={{ sm: 'start', md: 'center' }} spacing={2} justifyContent="space-between" flexDirection={{ sm: 'column', md: 'row' }}>
        <Typography variant="h3" fontWeight={700}>
          Leave {!isAdmin ? "Calendar" : "Table"}
        </Typography>
        {/* <SoftBox display="flex" gap="20px">
          {isAdmin ? (
            <>
              <SoftButton color={showTable ? "secondary" : null} onClick={changeTable}>
                Calendar
              </SoftButton>
              <SoftButton color={showCalendar ? "secondary" : null} onClick={changeCalendar}>
                Table
              </SoftButton>
            </>
          ) : ( 
            <SoftButton color={showTable ? "secondary" : null} onClick={changeTable}>
              Calendar
            </SoftButton>
          )}
        </SoftBox> */}
      </Box>
      {!isAdmin ? (
        <>
          <SoftBox mt={5} mb={3}>
            {loading ? (
              <Loader />
            ) : (
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                initialView="dayGridMonth"
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                eventDisplay="block"
                events={transformedEvents}
                select={handleDateSelect}
                eventClick={handleEventClick}
                // eventDrop={handleEventDrop}
                editable={false}
                eventContent={(eventInfo) => {
                  return (
                    <div style={{display: 'flex', rowGap: 12, flexDirection:'column',padding:6,}}>
                      <div>{eventInfo.event.title}</div>
                      <div style={{backgroundColor:'#ffffff2b', padding:'4px 8px',borderRadius:8,}}>{eventInfo.event.extendedProps.customText}</div>
                    </div>
                  );
                }}
              />
            )}
          </SoftBox>
          <Footer />
          <Modal open={deleteEventModalOpen} onClose={closeDeleteEventModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <SoftTypography sx={{ mb: 2 }} variant="h4">
                Delete Event
              </SoftTypography>
              <p>Are you sure you want to delete the event?</p>
              <Button sx={{ mt: 2, mr: 2 }} variant="contained" onClick={closeDeleteEventModal}>
                Cancel
              </Button>
              <Button
                sx={{ mt: 2 }}  
                variant="contained"
                color="secondary"
                onClick={handleDeleteEvent}
              >
                Delete
              </Button>
            </Box>
          </Modal>
          <Modal open={createEventModalOpen} onClose={closeCreateEventModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <SoftTypography sx={{ mb: 2 }} variant="h4">
                Leave Box
              </SoftTypography>
              <SoftInput
                placeholder="Title"
                fullWidth
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
              <SoftInput
                sx={{ mt: 2 }}
                placeholder="Description"
                fullWidth
                value={eventMessage}
                onChange={(e) => setEventMessage(e.target.value)}
              />
              <Button
                sx={{ mt: 2 }}
                variant="contained"
                color="secondary"
                onClick={closeCreateEventModal}
              >
                Cancel
              </Button>
              <Button sx={{ mt: 2, ml: 2 }} variant="contained" onClick={handleCreateEvent}>
                Apply
              </Button>
            </Box>
          </Modal>
        </>
      ) : <LeaveTable />}
    </DashboardLayout>
  );
}

export default Leave;
