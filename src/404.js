import * as React from "react";
import { Link } from "react-router-dom";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import curved9 from "assets/images/curved-images/curved-6.png";
import { Typography } from "@mui/material";


function PageNotFound() {

  return (
    <CoverLayout
      title={"404"}
      description={"Page not found"}
      image={curved9}
      sx={{ backGroundSize: "cover" }}
    >
      <SoftBox mb={2}>
        <SoftBox mb={1} ml={0.5}>
          <Typography variant="h2">You have entered in-correct address</Typography>
        </SoftBox>
        <SoftBox mb={3} ml={0.5}>
          <Typography variant="h6">Go back to home</Typography>
        </SoftBox>
        <Link to="/attendence">
          <SoftButton variant="contained" color="success">
            Home
          </SoftButton>
        </Link>
      </SoftBox>
    </CoverLayout>
  );
}

export default PageNotFound;
