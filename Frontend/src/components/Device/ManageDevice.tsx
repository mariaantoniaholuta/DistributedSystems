import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  ListItem,
  ListItemText,
  Button,
  Container,
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

interface AddDeviceProps {
  user: User;
  loggedUser: User | undefined;
}

const AddDevice: React.FC<AddDeviceProps> = ({ user, loggedUser }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [addedDevices, setAddedDevices] = useState<string[]>([]);
  const [removedDevices, setRemovedDevices] = useState<string[]>([]);

  useEffect(() => {
    deviceApi.getDevices()
      .then((response) => {
        setDevices(response.data);
      });
  }, []);

  const addDeviceToUser = async (userId: string, device: Device) => {
    try {
      userApi.addDeviceToUser(userId, device);
    } catch (e) {
      console.log(e);
    }
  };

  const addDevice = async (userId: string, device: Device) => {
    try {
      deviceApi.addDevice(userId, device); 
      setAddedDevices((prevAddedDevices) => [...prevAddedDevices, device.id]);
    } catch (e) {
      console.log(e);
    }
  };

  const removeDevice = async (userId: string, device: Device) => {
    try {
      deviceApi.removeDevice(userId, device);
      setRemovedDevices((prevRemovedDevices) => [
        ...prevRemovedDevices,
        device.id,
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {loggedUser && loggedUser.role === "Admin" ? (
        <>
          <Container className="container">
            <div className="header">
              <Typography variant="h4">Manage Devices For {user.name}</Typography>
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
                            secondary={`Address: ${device.address}; Max Energy Consumption: ${device.maxEnergyConsumption}`}
                          />
                        </div>
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              addDevice(user.id, device);
                            }}
                            disabled={addedDevices.includes(device.id)}
                          >
                            {addedDevices.includes(device.id) ? "Added" : "Add"}
                          </Button>

                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              removeDevice(user.id, device);
                            }}
                            disabled={removedDevices.includes(device.id)}
                          >
                            {removedDevices.includes(device.id)
                              ? "Removed"
                              : "Remove"}
                          </Button>
                        </>
                      </ListItem>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default AddDevice;
