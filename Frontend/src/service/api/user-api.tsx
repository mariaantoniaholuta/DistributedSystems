import axios from "axios";
import { UserHost } from "../../apiConfig";
import Device from "../../models/Device";
import User from "../../models/User";

function getAuthToken() {
  return localStorage.getItem('accessToken');
}

export const getUsers = (token: string) => {
  return axios.get(UserHost + "/user", {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Authorization": `Bearer ${getAuthToken()}`,
    },
  });
};

export const createUser = (formData: any) => {
    return axios.post(UserHost + "/user", formData, {
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      }
    });
  };

export const updateUser = async (userId: string, newUser: User) => {
  try {
    const response = await axios.put(UserHost + "/user/" + userId, newUser, {
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const addDeviceToUser = async (userId: string, device: Device) => {
  try {
    const deviceString = device.address + "; " + device.description;
    const response = await axios.post(
      UserHost + "/user/" + userId + "/addDevice",
      deviceString, {
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
};

export const getUser = (userId: string) => {
  return axios.get(UserHost + "/user/" + userId, {
    headers: {
      "Authorization": `Bearer ${getAuthToken()}`
    }
  });
};
