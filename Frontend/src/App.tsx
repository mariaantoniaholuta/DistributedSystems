import React, { useEffect, useState } from "react";
import "./App.css";
import UserList from "./components/User/UserList";
import UserForm from "./components/User/UserForm";
import DeviceList from "./components/Device/DeviceList";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import DeviceForm from "./components/Device/DeviceForm";
import AddDevice from "./components/Device/ManageDevice";
import User from "./models/User";
import Device from "./models/Device";
import ClientDevices from "./components/Client/ClientDevices";
import Login from "./components/Login";
import Chat from "./components/Client/Chat";

export interface LoggedUserProps {
  loggedUser: User | undefined;
}

function App() {
  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loggedUser, setLoggedUser] = useState<User>();

  useEffect(() => {}, [loggedUser]);

  return (
    <Router>
      <NavigationBar loggedUser={loggedUser} setLoggedUser={setLoggedUser} />
      <div>
        <Routes>
          <Route
            path="/users"
            element={
              <UserList
                setUser={setUser}
                setUsers={setUsers}
                users={users}
                loggedUser={loggedUser}
              />
            }
          />
          <Route
            path="/users/new"
            element={<UserForm loggedUser={loggedUser} />}
          />
          <Route
            path="/devices"
            element={
              <DeviceList
                setDevices={setDevices}
                devices={devices}
                loggedUser={loggedUser}
              />
            }
          />
          <Route
            path="/devices/new"
            element={<DeviceForm loggedUser={loggedUser} />}
          />
          <Route
            path="/users/new-device"
            element={
              user ? <AddDevice user={user} loggedUser={loggedUser} /> : <div />
            }
          />
          <Route
            path="/client"
            element={<ClientDevices loggedUser={loggedUser} />}
          />
          <Route
            path="/login"
            element={
              <Login setLoggedUser={setLoggedUser} loggedUser={loggedUser} />
            }
          />
          <Route
            path="/"
            element={
              <Login setLoggedUser={setLoggedUser} loggedUser={loggedUser} />
            }
          />

          <Route
            path="/client/chat"
            element={
              <Chat loggedUser={loggedUser} />
            }
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
