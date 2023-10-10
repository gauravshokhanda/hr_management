import React, { useState, useRef, useEffect } from "react";
import SoftBox from "components/SoftBox";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./eventUtils";
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
import { Switch, Typography } from "@mui/material";
import moment from "moment";
import HolidayTable from "./holidayTable";
import "./cell.css";
import SoftButton from "components/SoftButton";
import { useSelector } from "react-redux";


function HolidayList() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [deleteEventModalOpen, setDeleteEventModalOpen] = useState(false);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [clickedEventInfo, setClickedEventInfo] = useState(null);
  const [holiday, setIsHoliday] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);

  const data = useSelector((state) => state.auth);

  const isAdmin = data?.user?.isAdmin || false;

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

  const changeTable = () => {
    setShowTable(!showTable);
    setShowCalendar(false);
  };
  const changeCalendar = () => {
    setShowCalendar(!showCalendar);
    setShowTable(false);
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/holiday/holiday-list`);

      if (response.status === 200) {
        const eventData = response.data;

        setCurrentEvents((prevEvents) => [...prevEvents, ...eventData]);
      }
    } catch (error) {
      console.error("There is some error", error);
    }
  };

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
        holiday,
      };

      try {
        // Make a POST request to save the event
        const response = await axios.post(`${API_URL}/holiday/holiday-list`, newEvent);

        if (response.status === 200) {
          fetchEvents();
          const data = response.data;

          // Update the currentEvents state with the new event using the callback form
          setCurrentEvents((prevEvents) => [
            ...prevEvents,
            {
              id: data._id,
              title: data.title,
              start: data.start,
              end: data.end,
              allDay: data.allDay,
            },
          ]);

          setCreateEventModalOpen(false);
          setSelectedDate(null);
          setEventTitle("");
          setIsHoliday(false);
        } else {
          console.error("Failed to create event");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

 

  const handleEventDrop = async (dropInfo) => {
    const event = dropInfo.event;
    const updatedEvent = {
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      allDay: event.allDay,
      holiday: event.holiday,
    };

    try {
      // Make a PUT request to update the event on the server
      const response = await axios.put(`${API_URL}/holiday/holiday-list/${event.id}`, updatedEvent);

      if (response.status === 200) {
        fetchEvents();
        console.log("Event updated successfully");
      } else {
        console.error("Failed to update event:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDeleteEvent = async () => {
    const event = clickedEventInfo.event;

    const id = event._def.publicId;

    try {
      const response = await axios.delete(`${API_URL}/holiday/holiday-list/${id}`);

      if (response.status === 200) {
        fetchEvents();
        console.log("Deleted successfully");
      }
    } catch (error) {
      console.error("There is someee  error", error);
    }
    setDeleteEventModalOpen(false);
  };

  const closeCreateEventModal = () => {
    setCreateEventModalOpen(false);
  };

  const closeDeleteEventModal = () => {
    setDeleteEventModalOpen(false);
  };

  const checkIfHoliday = (date, transformedEvents) => {
    for (const event of transformedEvents) {
      if (moment(date).format("LL") === moment(event.start).format("LL")) {
        if (event.extendedProps.holiday) {
          return true;
        }
      }
    }

    return false;
  };

  const transformedEvents = currentEvents?.map((event) => ({
    title: event.title,
    start: event.start,
    end: event.end,
    extendedProps: {
      holiday: event.holiday ? true : false,
    },
    color: event.holiday ? "#ff5537" : "green",
    textColor: event.holiday ? "#000" : "#000",
    id: event._id,
  }));

  const customDayCellClassNames = (arg) => {
    const cellDate = arg.date;
    const isHoliday = checkIfHoliday(cellDate, transformedEvents);

    if (isHoliday) {
      return "custom-holiday-cell";
    }

    return "";
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox mt={5} display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h3" fontWeight={700}>
          Holiday {showTable ? "Table" : "Calendar"}
        </Typography>
        <SoftBox display="flex" gap="20px">
          <SoftButton color={showTable ? "secondary" : null} onClick={changeTable}>
          Calendar
          </SoftButton>
          <SoftButton color={showCalendar ? "secondary" : null} onClick={changeCalendar}>
            Table
          </SoftButton>
        </SoftBox>
      </SoftBox>
      {showTable ? (
        <>
          <SoftBox mt={5} mb={3}>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialView="dayGridMonth"
              selectable={isAdmin ? true : false}
              selectMirror={true}
              dayMaxEvents={true}
              eventDisplay="box"
              weekends={weekendsVisible}
              events={transformedEvents}
              select={handleDateSelect}
              eventClick={isAdmin ? handleEventClick : null}
              dayCellClassNames={customDayCellClassNames}
              eventDrop={handleEventDrop}
              editable={isAdmin ? true : false}
            />
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
                Create Event
              </SoftTypography>
              <SoftInput
                placeholder="Event Title"
                fullWidth
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
              <div>
                <label>Is Holiday:</label>
                <Switch checked={holiday} onChange={() => setIsHoliday(!holiday)} />
              </div>
              <Button
                sx={{ mt: 2 }}
                variant="contained"
                color="secondary"
                onClick={closeCreateEventModal}
              >
                Cancel
              </Button>
              <Button sx={{ mt: 2, ml: 2 }} variant="contained" onClick={handleCreateEvent}>
                Save
              </Button>
            </Box>
          </Modal>
        </>
      ) : (
        <HolidayTable isAdmin={isAdmin}  />
      )}
    </DashboardLayout>
  );
}

export default HolidayList;
