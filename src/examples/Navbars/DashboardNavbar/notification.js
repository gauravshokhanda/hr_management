import NotificationItem from "examples/Items/NotificationItem";
import React from "react";
import Icon from "@mui/material/Icon";

import team2 from "assets/images/team-2.jpg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";

export default function Notification({ handleCloseMenu }) {
  return (
    <>
      <NotificationItem
        image={<img src={team2} alt="person" />}
        title={["Laur", "Check In"]}
        date="13 minutes ago"
        onClick={handleCloseMenu}
      />
      <NotificationItem
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
      />
    </>
  );
}
