import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  ListItem,
  ListItemText,
  Button,
  Container,
  TextField,
  Select,
  MenuItem,
  Grid,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import User from "../../models/User";
import "./scsStyle/UserList.scss";
import { useNavigate } from "react-router-dom";
import AccessDenied from "../AccessDenied";
import * as deviceApi from "../../service/api/device-api"; 
import * as userApi from "../../service/api/user-api";

interface UserListProps {
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  users: User[];
  loggedUser: User | undefined;
}

const UserList: React.FC<UserListProps> = ({
  setUser,
  setUsers,
  users,
  loggedUser,
}) => {
  const [nameUpdate, setNameUpdate] = useState("");
  const [roleUpdate, setRoleUpdate] = useState("");
  const [passwordUpdate, setPasswordUpdate] = useState("");
  const [updateUserId, setUpdateUserId] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/users/new-device");
  };

  useEffect(() => {
    if (loggedUser && loggedUser.role === "Admin") {
      console.log(loggedUser.access_token)
      userApi.getUsers(loggedUser.access_token)
        .then((response) => {
          setUsers(response.data);
        });
    }
  }, [loggedUser]);

  const deleteUser = async (userId: string) => {
    try {
      await deviceApi.deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (e) {
      console.log(e);
    }
  };

  const updateUser = async (userId: string, newUser: User) => {
    try {
      userApi.updateUser(userId, newUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === userId) {
            return { ...user, ...newUser };
          }
          return user;
        })
      );
      setSnackbarOpen(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameUpdate(event.target.value);
  };

  const handleRoleChange = (event: any) => {
    setRoleUpdate(event.target.value as string);
  };

  const handlePasswordChange = (event: any) => {
    setPasswordUpdate(event.target.value as string);
  }

  const handleUpdateClick = (userId: string) => {
    setUpdateUserId(userId);
  };

  const handleUpdateUser = () => {
    const userToUpdate = users.find((user) => user.id === updateUserId);
    if (userToUpdate) {
      updateUser(updateUserId, {
        access_token: userToUpdate.access_token,
        refresh_token: userToUpdate.refresh_token,
        id: userToUpdate.id,
        password: passwordUpdate || userToUpdate.password,
        name: nameUpdate || userToUpdate.name,
        role: roleUpdate || userToUpdate.role,
        devices: userToUpdate.devices,
      });
      setUpdateUserId("");
      setNameUpdate("");
      setRoleUpdate("");
    }
  };

  return (
    <>
      {loggedUser && loggedUser.role === "Admin" ? (
        <>
          <div className="background">
            <Container className="container">
              <div className="header">
                <Typography variant="h4">Users</Typography>
              </div>

              <Grid container spacing={2} className="box">
                {users.map((user) => (
                  <Grid item xs={12} key={user.id}>
                    <Paper elevation={3} className="user-paper">
                      <Box p={2}>
                        <ListItem className="list-item">
                          <div className="user-info">
                            <ListItemText
                              primary={`Name: ${user.name}`}
                              secondary={`Role: ${user.role}`}
                            />
                          </div>
                          <div className="action-buttons">
                            {updateUserId === user.id ? (
                              <>
                                <TextField
                                  label="Name"
                                  value={nameUpdate}
                                  onChange={handleNameChange}
                                />
                                <TextField
                                  label="Password"
                                  value={passwordUpdate}
                                  onChange={handlePasswordChange}
                                />
                                <Select
                                  label="Role"
                                  value={roleUpdate}
                                  onChange={handleRoleChange}
                                >
                                  <MenuItem value="Client">Client</MenuItem>
                                  <MenuItem value="Admin">Admin</MenuItem>
                                </Select>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={handleUpdateUser}
                                >
                                  Save
                                </Button>
                              </>
                            ) : (
                              <>
                                <IconButton
                                  color="primary"
                                  onClick={() => {
                                    handleAddClick();
                                    setUser(user);
                                  }}
                                >
                                  <AddIcon />
                                  <span className="device-span">
                                    Manage Devices
                                  </span>
                                </IconButton>
                                <IconButton
                                  color="primary"
                                  onClick={() => handleUpdateClick(user.id)}
                                >
                                  <EditIcon />
                                </IconButton>

                                <IconButton
                                  color="secondary"
                                  onClick={() => deleteUser(user.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            )}
                            {updateUserId === user.id && (
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setUpdateUserId("")}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </ListItem>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              
            </Container>
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default UserList;
