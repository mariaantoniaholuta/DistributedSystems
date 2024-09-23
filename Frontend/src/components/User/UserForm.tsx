import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  Container,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import "./scsStyle/UserForm.scss";
import AccessDenied from "../AccessDenied";
import { LoggedUserProps } from "../../App";
import * as userApi from "../../service/api/user-api";

const UserForm: React.FC<LoggedUserProps> = ({ loggedUser }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    role: "Client",
  });

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    userApi.createUser(formData)
      .then((response) => {
        setSnackbarMessage("User added successfully");
        setOpenSnackbar(true);
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (e: any) => {
    setFormData({
      ...formData,
      role: e.target.value,
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
          <div className="user-form-container">
            <Container maxWidth="sm">
              <Box className="form-box">
                <Typography className="form-title" variant="h4" gutterBottom>
                  Add User
                </Typography>
                <form onSubmit={handleFormSubmit}>
                  <TextField
                    className="form-input"
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                  <TextField
                    className="form-input"
                    label="Password"
                    name="password"
                    value={formData.password}
                    type="password"
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                  <FormControl
                    className="form-select"
                    fullWidth
                    margin="normal"
                  >
                    <InputLabel htmlFor="role">Role</InputLabel>
                    <Select
                      label="Role"
                      name="role"
                      value={formData.role}
                      onChange={handleRoleChange}
                      fullWidth
                    >
                      <MenuItem value="Client">Client</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    className="form-button"
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Add User
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

export default UserForm;
