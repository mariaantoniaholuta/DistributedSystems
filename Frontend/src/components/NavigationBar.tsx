import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import User from "../models/User";

interface NavigationBarProps {
  loggedUser: User | undefined;
  setLoggedUser: any;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ loggedUser, setLoggedUser }) => {
  const appBarStyle = {
    background: "#5F86C8",
  };

  function handleLogin(): void {
    setLoggedUser(undefined);
  }

  return (
    <AppBar position="static" sx={appBarStyle}>
      <Container>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: "white" }}
          >
            Energy Management System
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: "white" }}
          >
            {loggedUser?.role} {loggedUser?.name}
          </Typography>
          <Button component={Link} to="/users" color="inherit">
            Users
          </Button>
          <Button component={Link} to="/users/new" color="inherit">
            Add User
          </Button>
          <Button component={Link} to="/devices" color="inherit">
            Devices
          </Button>
          <Button component={Link} to="/devices/new" color="inherit">
            Add Device
          </Button>
          <Button component={Link} to="/client" color="inherit">
            My Devices
          </Button>
          <Button component={Link} to="/client/chat" color="inherit">
            Chat
          </Button>
          <Button
            component={Link}
            to="/login"
            color="inherit"
            sx={{ fontSize: "1.2rem" }}
            onClick={handleLogin}
          >
            LogIn
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavigationBar;
