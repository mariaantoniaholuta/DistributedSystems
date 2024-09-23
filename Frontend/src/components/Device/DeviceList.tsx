import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  ListItem,
  ListItemText,
  Button,
  Container,
  Snackbar,
  Alert,
  TextField,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import Device from "../../models/Device";
import "./scsStyle/DeviceList.scss";
import User from "../../models/User";
import AccessDenied from "../AccessDenied";
import * as deviceApi from "../../service/api/device-api"; 
import * as userApi from "../../service/api/user-api";

interface DeviceListProps {
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  devices: Device[];
  loggedUser: User | undefined;
}

export interface UserNamesMap {
  [userId: string]: string;
}

const DeviceList: React.FC<DeviceListProps> = ({
  setDevices,
  devices,
  loggedUser,
}) => {
  const [descriptionUpdate, setDescriptionUpdate] = useState("");
  const [addressUpdate, setAddressUpdate] = useState("");
  const [maxEnergyConsumptionUpdate, setMaxEnergyConsumptionUpdate] =
    useState("");
  const [updateDeviceId, setUpdateDeviceId] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [userNames, setUserNames] = useState<UserNamesMap>({});

  useEffect(() => {
    deviceApi.getDevices()
      .then((response:any) => {
        setDevices(response.data);
        fetchUserNames(response.data);
      });
  }, []);

  const deleteDevice = async (deviceId: string) => {
    try {
      const response = await deviceApi.deleteDevice(deviceId);
      setDevices((prevDevices) =>
        prevDevices.filter((device) => device.id !== deviceId)
      );
    } catch (e) {
      console.log(e);
    }
  };

  const fetchUserNames = (devices: Device[]) => {
    const userIds = Array.from(new Set(devices.map((device) => device.userId)));
    const userNamesMap: UserNamesMap = {};

    userIds.forEach((userId) => {
      if (userId !== null) {
        userApi.getUser(userId)
          .then((response:any) => {
            userNamesMap[userId] = response.data.name;
            setUserNames({ ...userNamesMap });
          })
          .catch((error: any) => {
            console.error("Error fetching user names:", error);
          });
      }
    });
  };

  const updateDevice = async (deviceId: string, newDevice: Device) => {
    try {
      deviceApi.updateDevice(deviceId, newDevice);
      setDevices((prevDevices) =>
        prevDevices.map((device) => {
          if (device.id === deviceId) {
            return { ...device, ...newDevice };
          }
          return device;
        })
      );
      setSnackbarOpen(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescriptionUpdate(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressUpdate(event.target.value);
  };

  const handleMaxEnergyConsumptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMaxEnergyConsumptionUpdate(event.target.value);
  };

  const handleUpdateClick = (deviceId: string) => {
    setUpdateDeviceId(deviceId);
  };

  const handleUpdateDevice = () => {
    const deviceToUpdate = devices.find(
      (device) => device.id === updateDeviceId
    );
    if (deviceToUpdate) {
      updateDevice(updateDeviceId, {
        id: deviceToUpdate.id,
        userId: deviceToUpdate.userId,
        description: descriptionUpdate || deviceToUpdate.description,
        address: addressUpdate || deviceToUpdate.address,
        maxEnergyConsumption:
          maxEnergyConsumptionUpdate || deviceToUpdate.maxEnergyConsumption,
      });
      setUpdateDeviceId("");
      setDescriptionUpdate("");
      setAddressUpdate("");
      setMaxEnergyConsumptionUpdate("");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      {loggedUser && loggedUser.role === "Admin" ? (
        <>
          <Container className="container">
            <div className="header">
              <Typography variant="h4">Devices</Typography>
            </div>
            <Grid container spacing={2} className="box">
              {devices.map((device) => (
                <Grid item xs={12} key={device.id}>
                  <Paper elevation={3} className="device-paper">
                    <Box p={2}>
                      <ListItem className="list-item">
                        <div className="device-info">
                          <ListItemText
                            primary={`Description: ${device.description}`}
                            secondary={`Address: ${
                              device.address
                            }; Max Energy Consumption: ${
                              device.maxEnergyConsumption
                            }; User Assigned: ${
                              userNames[device.userId] || "Unknown User"
                            }`}
                          />
                        </div>
                        <div className="action-buttons">
                          {updateDeviceId === device.id ? (
                            <>
                              <TextField
                                label="Description"
                                value={descriptionUpdate}
                                onChange={handleDescriptionChange}
                              />
                              <TextField
                                label="Address"
                                value={addressUpdate}
                                onChange={handleAddressChange}
                              />
                              <TextField
                                label="Max Energy Consumption"
                                value={maxEnergyConsumptionUpdate}
                                onChange={handleMaxEnergyConsumptionChange}
                              />
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdateDevice}
                              >
                                Save
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleUpdateClick(device.id)}
                              >
                                Update
                              </Button>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => deleteDevice(device.id)}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                          {updateDeviceId === device.id && (
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => setUpdateDeviceId("")}
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
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleCloseSnackbar}
            >
              <Alert onClose={handleCloseSnackbar} severity="success">
                User updated successfully!
              </Alert>
            </Snackbar>
          </Container>
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default DeviceList;
