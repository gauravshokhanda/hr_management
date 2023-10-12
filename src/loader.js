import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Backdrop, Box } from "@mui/material";

function Loader() {
  return (
    // <Backdrop
    //   sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    //   open={true}
    // >
    <Box sx={{textAlign: 'center'}}>
        <CircularProgress color="inherit" />
    </Box>
    // </Backdrop>
  );
}

export default Loader;
