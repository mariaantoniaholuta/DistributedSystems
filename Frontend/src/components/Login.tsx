import React, { useEffect, useState } from "react";
import User from "../models/User";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserHost } from "../apiConfig";
import {
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Grid,
  Box,
  Paper,
} from "@mui/material";
import "./scsStyle/Login.scss";
import { jwtDecode } from 'jwt-decode';
import { getUserId } from "../service/api/device-api";

interface LoginProps {
  setLoggedUser: any;
  loggedUser?: User;
}

const Login: React.FC<LoginProps> = ({ setLoggedUser, loggedUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function extractUserDetails(token: string | undefined) {
    try {
      if(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decoded = JSON.parse(jsonPayload);
        return {
            id: decoded.id,
            name: decoded.name, 
            role: decoded.role
        };
      }
    } catch (error) {
        console.error("Error decoding token: ", error);
        return null;
    }
};

  useEffect(() => {
    if (loggedUser) {
      console.log(loggedUser);
      console.log(loggedUser.access_token);
      //const userDetails = extractUserDetails(loggedUser.access_token);
      const userDetails = jwtDecode(loggedUser.access_token);
      console.log("name from decoded logged user:" + userDetails?.sub);
      localStorage.setItem('accessToken',loggedUser.access_token);
      if (loggedUser.role === "Client") {
        console.log("should nav to client..");
        navigate("/client/chat");
      } else if (loggedUser.role === "Admin") {
        console.log("should nav to /users..");
        navigate("/users");
      }
    }
  }, [loggedUser, navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(UserHost + "/user/login", {
        name: username,
        password: password,
      });

      if (response.status === 200 && response.data) {
        setLoggedUser(response.data);
        const userId = (await getUserId()).data;
        console.log(userId)
        setLoggedUser((loggedUser:User) => ({
          ...loggedUser,
          id: userId
      }));
        console.log("response ok to post");      
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="login-container">
      <CssBaseline />
      <Paper elevation={3} className="login-paper">
        <Box p={2}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
            >
              Login
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
