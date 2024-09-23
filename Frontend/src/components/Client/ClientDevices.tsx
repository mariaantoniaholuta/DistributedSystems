import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  Grid,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import Device from "../../models/Device";
import "./scsStyle/ClientDevices.scss";
import User from "../../models/User";
import AccessDenied from "../AccessDenied";
import * as deviceApi from "../../service/api/device-api";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Monitoring from "../../models/Monitoring";

interface ClientDevicesProps {
  loggedUser: User | undefined;
}

function getAuthToken() {
  return localStorage.getItem("accessToken");
}


const ClientDevices: React.FC<ClientDevicesProps> = ({ loggedUser }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>();
  const [monitoringsForDevice, setMonitoringsForDevice] = useState<
    Monitoring[]
  >([]);

  // const [socket, setSocket] = useState<WebSocket | null>(null);

  const handleWebSocketMessage = (event: MessageEvent) => {
    try {
      const notification = JSON.parse(event.data);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
      setShowNotification(true);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  useEffect(() => {
    if (loggedUser) {
      const socket = new SockJS("http://localhost:8082/spring-demo/ws");
      const stompClient = Stomp.over(socket);

      stompClient.connect({}, () => {
        console.log("Connected to WebSocket");
        console.log("WebSocket connection state:", socket.readyState);
        console.log("WebSocket connection state:", stompClient.connected);

        axios
          .get("http://localhost:8082/spring-demo/test/send-test-message")
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error("Error sending test message:", error);
          });

        stompClient.subscribe(
          `${loggedUser.id}/queue/notifications`,
          (message) => {
            console.log("Received message:", message);
            try {
              console.log("in try");
              const notification = JSON.parse(message.body);
              setNotifications((prevNotifications) => [
                ...prevNotifications,
                notification,
              ]);
              setShowNotification(true);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        );
        stompClient.subscribe(
          `user/${loggedUser.id}/queue/notifications`,
          (message) => {
            console.log("Received message:", message);
            try {
              console.log("in try");
              const notification = JSON.parse(message.body);
              setNotifications((prevNotifications) => [
                ...prevNotifications,
                notification,
              ]);
              setShowNotification(true);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        );
        stompClient.subscribe("/topic/notifications", (message) => {
          console.log("topic");
        });

        // setSocket(socket);
      });

      console.log("WebSocket connection state:", socket.readyState);

      deviceApi
        .getDevicesForUser(loggedUser.id)
        .then((response) => {
          setDevices(response.data);
        })
        .catch((error) => {
          console.error("Error fetching devices:", error);
        });

      return () => {
        if (socket.readyState === 1) {
          console.log("closing");
          socket.close();
        }
        // if (socket) {
        //   socket.close();
        // }
      };
    }
  }, [loggedUser]);

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const handleFetchMonitorings = (deviceId: string | undefined) => {
    axios
      .get(`http://localhost:8082/spring-demo/monitoring/${deviceId}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
      .then((response) => {
        const newMonitorings = response.data;
        setMonitoringsForDevice(newMonitorings);
        setOpenMonitoringsDialog(true);
      })
      .catch((error) => {
        console.error("Error fetching monitorings for device:", error);
      });
  };

const [openMonitoringsDialog, setOpenMonitoringsDialog] = useState(false);

const handleCloseMonitoringsDialog = () => {
  setOpenMonitoringsDialog(false);
};

useEffect(() => {
  const interval = setInterval(() => {
    if(openMonitoringsDialog === true){
      handleFetchMonitorings(selectedDeviceId);
    }
  }, 5000);
  return () => clearInterval(interval);
}, []);

setInterval(() => {
}, 1000);

  return (
    <>
      {loggedUser ? (
        <>
          <div className="client-devices">
            <Container className="container">
              <Typography variant="h4" className="header">
                My Devices
              </Typography>
              <Grid container spacing={2} className="box">
                {devices.length > 0 ? (
                  devices.map((device) => (
                    <Grid item xs={12} key={device.id}>
                                <Paper elevation={3} className="device-paper">
                                    <Box p={2}>
                                        <ListItem className="list-item">
                                            <div className="device-info">
                                                <ListItemText
                                                    primary={`Description: ${device.description}`}
                                                    secondary={`Address: ${device.address}, Max Energy Consumption: ${device.maxEnergyConsumption}`}
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedDeviceId(device.id);
                                                    setOpenMonitoringsDialog(true);
                                                    handleFetchMonitorings(device.id);
                                                }}
                                            >
                                                Fetch Monitorings
                                            </button>
                                        </ListItem>
                                    </Box>
                                </Paper>
                            </Grid>
                  ))
                ) : (
                  <Typography className="no-device">
                    No devices found for this client.
                  </Typography>
                )}
              </Grid>
            </Container>
          </div>

          <Dialog open={showNotification} onClose={handleCloseNotification}>
            <DialogTitle>Notification</DialogTitle>
            <DialogContent>
              <List>
                {notifications.map((notification, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={notification} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
          </Dialog>

          <Dialog
            open={openMonitoringsDialog}
            onClose={handleCloseMonitoringsDialog}
          >
            <DialogTitle>Monitorings</DialogTitle>
            <DialogContent>
              <List>
                {monitoringsForDevice.map((monitoring, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Timestamp: ${monitoring.timestamp}, Value: ${monitoring.measurement_value}`}
                    />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default ClientDevices;
