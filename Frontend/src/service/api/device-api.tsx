import axios from "axios";
import { DeviceHost, UserHost } from "../../apiConfig";
import Device from "../../models/Device";

function getAuthToken() {
  return localStorage.getItem("accessToken");
}

export const getDevices = () => {
  return axios.get(DeviceHost + "/device", {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};

export const deleteDevice = (deviceId: string) => {
  return axios.delete(DeviceHost + "/device/" + deviceId, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};

export const createDevice = (formData: any) => {
  return axios.post(DeviceHost + "/device", formData, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};

export const addDevice = async (userId: string, device: Device) => {
  try {
    const response = await axios.post(
      DeviceHost + "/device/" + device.id + "/assignUser",
      userId,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
};

export const removeDevice = async (userId: string, device: Device) => {
  try {
    const response = await axios.post(
      DeviceHost + "/device/" + device.id + "/removeUserDevice",
      userId,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
};

export const updateDevice = async (deviceId: string, newDevice: Device) => {
  try {
    const response = await axios.put(
      DeviceHost + `/device/${deviceId}`,
      newDevice,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating device:", error);
    throw error;
  }
};

export const getDevicesForUser = (userId: string) => {
  return axios.get(`${DeviceHost}/client/${userId}/devices`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });
};

export const deleteUser = async (userId: string) => {
  try {
    await axios.post(DeviceHost + "/device/removeUser", userId);
    const response = await axios.delete(UserHost + "/user/" + userId, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Authorization": `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};


export const getUserId = () => {
  return axios.get(DeviceHost + "/client/userId", {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });
};