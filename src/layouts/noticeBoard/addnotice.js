// @mui material components
import {
  Box,
  Button,
  Card,
  Input,
  InputLabel,
  Typography,
  OutlinedInput,
  Select,
  MenuItem,
  Chip,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { grey } from "@mui/material/colors";
import "swiper/css";
import { API_URL } from "config";
import axios from "axios";
import { useState } from "react";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";

const CARD_PROPERTY = {
  borderRadius: 3,
  boxShadow: 0,
};

function NoticeBoard() {
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    imgPath: "",
    tags: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const data = {
    heading: formData.heading,
    description: formData.description,
    imgPath: formData.imgPath,
    tags: formData.tags, // Keep it as an array
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("heading", data.heading);
      formData.append("description", data.description);

      // Check if data.tags is defined before joining
      if (data.tags && data.tags.length > 0) {
        formData.append("tags", data.tags.join(","));
      }

      // Append the image as binary data
      if (selectedImage) {
        formData.append("image", selectedImage, selectedImage.name);
      }

      const response = await axios.post(`${API_URL}/notices/notice`, formData);

      console.log("Notice saved successfully", response.data);

      setFormData({
        heading: "",
        description: "",
        imgPath: "",
        tags: [],
      });

      setSelectedImage("");

      setPersonName([]);
    } catch (error) {
      console.error("Notice saved failed", error);
    }
  };

  const names = ["present", "absent", "late", "holiday"];

  function getStyles(name, personName) {
    return {
      fontWeight: personName.indexOf(name) === -1 ? "regular" : "medium",
    };
  }

  const [selectedImage, setSelectedImage] = useState(null);
  const [setectedImgPath, setSelectedImgPath] = useState("");
  const [personName, setPersonName] = useState([]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log(file, 'Selected image');
      setSelectedImage(file);
      setSelectedImgPath(URL.createObjectURL(file));
      const imageName = file.name;
      setFormData((prevData) => ({
        ...prevData,
        imgPath: imageName,
      }));
    }
  };
  
  console.log(selectedImage, 'Imagew');

  const handleChangeSelect = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(value);
    setFormData((prevData) => {
      return {
        ...prevData,
        tags: value,
      };
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container justifyContent="center" spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card sx={CARD_PROPERTY}>
                <Box
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "start",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      Add Notice
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ height: "1px", width: "100%", bgcolor: grey[100] }}></Box>
                <SoftBox pt={2} pb={3} px={3}>
                  <SoftBox component="form" role="form" onSubmit={handleSubmit}>
                    <SoftBox mb={2}>
                      <SoftInput
                        name="heading"
                        value={formData.heading}
                        onChange={handleChange}
                        placeholder="Notice Title"
                      />
                    </SoftBox>
                    <SoftBox mb={2}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Notice Description"
                        inputProps={{
                          style: { minWidth: "100%" },
                        }}
                      />
                    </SoftBox>
                    <SoftBox mb={2}>
                      <Box
                        sx={{
                          padding: "20px",
                          border: "0.0625rem solid #d2d6da",
                          borderRadius: "0.5rem!important",
                          display: "flex",
                          alignItems: "center",
                          gap: "22px",
                        }}
                      >
                        <Box>
                          <Typography sx={{ mb: 1 }} variant="h5">
                            Upload an Image
                          </Typography>
                          <Input
                            accept="image/*"
                            type="file"
                            id="image-input"
                            onChange={handleImageChange}
                            sx={{ display: "none!important" }}
                          />

                          <label htmlFor="image-input">
                            <Button variant="contained" component="span">
                              Choose Image
                            </Button>
                          </label>
                        </Box>
                        <Box>
                          {selectedImage && (
                            <div>
                              <img
                                src={setectedImgPath}
                                alt="Selected"
                                style={{ maxWidth: "100%" }}
                              />
                              <Typography variant="body1">{formData.imgPath}</Typography>
                            </div>
                          )}
                        </Box>
                      </Box>
                    </SoftBox>
                    <SoftBox mb={2}>
                      <InputLabel id="demo-multiple-chip-label" sx={{ mb: 1 }}>
                        Tags
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-chip-label"
                        multiple
                        name="tags"
                        value={personName}
                        onChange={handleChangeSelect}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                      >
                        {names.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName)}
                            sx={{ mb: 1 }}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </SoftBox>
                    <SoftBox mt={4} mb={1}>
                      <SoftButton variant="gradient" type="submit" color="dark">
                        Add Notice
                      </SoftButton>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              </Card>
            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default NoticeBoard;
