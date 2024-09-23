import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  Container,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import Device from "../../models/Device";
import "./scsStyle/DeviceForm.scss";
import { LoggedUserProps } from "../../App";
import AccessDenied from "../AccessDenied";
import * as deviceApi from "../../service/api/device-api"; 

const DeviceForm: React.FC<LoggedUserProps> = ({ loggedUser }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Device>({
    id: "",
    userId: "",
    description: "",
    address: "",
    maxEnergyConsumption: "",
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    deviceApi.createDevice(formData)
      .then((response) => {
        setSnackbarMessage("Device added successfully");
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.error("Error creating device:", error);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSnackbarClose = (event: any, reason?: any) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      {loggedUser && loggedUser.role === "Admin" ? (
        <>
          <div className="device-form-container">
            <Container maxWidth="sm">
              <Box className="form-box">
                <Typography className="form-title" variant="h4" gutterBottom>
                  Add Device
                </Typography>
                <form onSubmit={handleFormSubmit}>
                  <TextField
                    className="form-input"
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                  <TextField
                    className="form-input"
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                  <TextField
                    className="form-input"
                    label="Max Energy Consumption"
                    name="maxEnergyConsumption"
                    value={formData.maxEnergyConsumption}
                    type="number"
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                  />

                  <Button
                    className="form-button"
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Add Device
                  </Button>
                </form>
              </Box>
              <div className="center-snackbar">
                <Snackbar
                  open={openSnackbar}
                  autoHideDuration={6000}
                  onClose={handleSnackbarClose}
                >
                  <Alert onClose={handleSnackbarClose} severity="success">
                    {snackbarMessage}
                  </Alert>
                </Snackbar>
              </div>
            </Container>
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default DeviceForm;
