import NotificationItem from "examples/Items/NotificationItem";
import React, { useEffect } from "react";
import Icon from "@mui/material/Icon";

import team2 from "assets/images/team-2.jpg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import axios from "axios";
import { API_URL } from "config";
import moment from "moment";
import { Avatar } from "@mui/material";


export default function Notification({ handleCloseMenu, notificationStatus }) {

  console.log(notificationStatus, "statas");

  return (
    <>
      {notificationStatus.map((notificationItem, index) => (
        <NotificationItem
          key={index}
          image={<Avatar sx={{background: 'transparent'}} src={`${API_URL}/${notificationItem.image}`} alt={notificationItem.message} />}
          title={[notificationItem.message]}
          date={moment(notificationItem.date).startOf('minute').fromNow()}
          onClick={handleCloseMenu}
        />
      ))}

      {/* <NotificationItem
        image={<img src={logoSpotify} alt="person" />}
        title={["Shubhm", "Check Out"]}
        date="1 day"
        onClick={handleCloseMenu}
      />
      <NotificationItem
        color="secondary"
        image={
          <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
            payment
          </Icon>
        }
        title={["Shivam", "Break Out"]}
        date="2 days"
        onClick={handleCloseMenu}
      /> */}
    </>
  );
}
