import React, { useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import User from "../../models/User";
import "./Chat.scss";
import {
  onMessageReceived,
  onPrivateMessage,
  sendPrivateValue,
  sendValue,
  userJoin,
} from "../../service/chatService";
import AccessDenied from "../AccessDenied";

export interface Message {
  senderName: string;
  receiverName?: string;
  message: string;
  status: "JOIN" | "MESSAGE";
  senderRole: string;
  isTyping: boolean;
}

interface ClientChatProps {
  loggedUser: User | undefined;
}

const Chat: React.FC<ClientChatProps> = ({ loggedUser }) => {
  const [privateChats, setPrivateChats] = useState(
    new Map<string, Message[]>()
  );
  const [publicChats, setpublicChats] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [tab, setTab] = useState<string>("CHATROOM");
  const [userData, setUserData] = useState({
    username: loggedUser?.name || "",
    receivername: "",
    connected: false,
    message: "",
    role: loggedUser?.role || "",
  });
  const [sent, setSent] = useState(false);

  const [stompClient, setStompClient] = useState<any>(null);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8083/spring-demo/ws");
    console.log("in connect");
    const client = over(Sock);
    client.connect({}, onConnected, (err) => {
      console.error("Error during connection:", err);
    });
    setStompClient(client);
  };

  const onConnected = () => {
    if (stompClient) {
      console.log("Connected to WebSocket.");
      setUserData({ ...userData, connected: true });
      stompClient.subscribe("/chatroom/public", (payload: any) => {
        onMessageReceived(
          payload,
          privateChats,
          setPrivateChats,
          setpublicChats,
          publicChats,
          loggedUser?.role || "",
          loggedUser?.name || ""
        );
      });
      stompClient.subscribe(
        `/user/${userData.username}/private`,
        (payload: any) => {
          onPrivateMessage(payload, privateChats, setPrivateChats, setIsTyping);
        }
      );
      userJoin(userData, stompClient);
    } else {
      console.error("Stomp client is null after connection.");
    }
  };

  useEffect(() => {
    if (sent) {
        const timeoutId = setTimeout(() => {
          setSent(false);
        }, 5000);
        return () => clearTimeout(timeoutId);
      }
  }, [sent]);

  const handleButtonClick = () => {
    setSent(false); 
    sendValue(stompClient, userData, setUserData);
  };

  const changeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
    console.log("sent is " + sent);
    if (value && !sent) {
      setSent(true);
      const typingMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: "is typing...",
        status: "MESSAGE",
        senderRole: userData.role,
        isTyping: true,
      };
      stompClient.send(
        "/app/private-message",
        {},
        JSON.stringify(typingMessage)
      );
    } else {
        setIsTyping(false);
    }
  };

  if (loggedUser) {
    if (loggedUser.role === "Client") {
      return (
        <div className="main-container">
          {!userData.connected ? (
            <center>
              <div className="connection">
                <button
                  type="button"
                  onClick={connect}
                  className="connection-button"
                >
                  Connect to Chatroom
                </button>
              </div>
            </center>
          ) : (
            <div className="chat-container">
              <div className="member-sidebar">
                <ul>
                  <li
                    onClick={() => setTab("CHATROOM")}
                    className={`member ${tab === "CHATROOM" && "active"}`}
                  >
                    Message to Admin
                  </li>
                  {[...privateChats.keys()].map((name, index) => (
                    <li
                      onClick={() => setTab(name)}
                      className={`member ${tab === name && "active"}`}
                      key={index}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
              {tab === "CHATROOM" && (
                <div className="chat-content-container">
                  <ul className="chat-messages-list">
                    {isTyping && (
                      <li className="message-item typing-indicator">
                        <div className="message-profile typing-indicator">
                          Typing...
                        </div>
                      </li>
                    )}
                    {publicChats.map((chat, index) => (
                      <li
                        className={`message-item ${
                          chat.senderName === userData.username && "self"
                        }`}
                        key={index}
                      >
                        {chat.senderName !== userData.username && (
                          <div className="message-profile">
                            {chat.senderName}
                          </div>
                        )}
                        <div className="message-data">{chat.message}</div>
                        {chat.senderName === userData.username && (
                          <div className="message-profile self">
                            {chat.senderName}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div className="send-message-section">
                    <input
                      type="text"
                      className="input-message"
                      placeholder="Enter the message"
                      value={userData.message}
                      onChange={changeMessage}
                    />
                    <button
                      type="button"
                      className="send-button"
                      onClick={() => {
                        handleButtonClick();
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
              {tab !== "CHATROOM" && (
                <div className="chat-content-container">
                  <ul className="chat-messages-list">
                    {[...(privateChats.get(tab) || [])].map((chat, index) => (
                      <li
                        className={`message-item ${
                          chat.senderName === userData.username && "self"
                        }`}
                        key={index}
                      >
                        {chat.senderName !== userData.username && (
                          <div className="message-profile">
                            {chat.senderName}
                          </div>
                        )}
                        <div className="message-data">{chat.message}</div>
                        {chat.senderName === userData.username && (
                          <div className="message-profile self">
                            {chat.senderName}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div className="send-message-section">
                    <input
                      type="text"
                      className="input-message"
                      placeholder="Enter the message"
                      value={userData.message}
                      onChange={changeMessage}
                    />
                    <button
                      type="button"
                      className="send-button"
                      onClick={() => {
                        sendPrivateValue(
                          stompClient,
                          userData,
                          tab,
                          privateChats,
                          setPrivateChats,
                          setUserData
                        );
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="main-container">
          {!userData.connected ? (
            <center>
              <div className="connection">
                <button
                  type="button"
                  onClick={connect}
                  className="connection-button"
                >
                  Connect to Chatroom
                </button>
              </div>
            </center>
          ) : (
            <div className="chat-container">
              <div className="member-sidebar">
                <ul>
                  <li
                    onClick={() => setTab("CHATROOM")}
                    className={`member ${tab === "CHATROOM" && "active"}`}
                  >
                    Clients Chatroom
                  </li>
                  {[...privateChats.keys()].map((name, index) => (
                    <li
                      onClick={() => setTab(name)}
                      className={`member ${tab === name && "active"}`}
                      key={index}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
              {tab === "CHATROOM" && (
                <div className="chat-content-container">
                  <ul className="chat-messages-list">
                    {publicChats.map((chat, index) => (
                      <li
                        className={`message-item ${
                          chat.senderName === userData.username && "self"
                        }`}
                        key={index}
                      >
                        {chat.senderName !== userData.username && (
                          <div className="message-profile">
                            {chat.senderName}
                          </div>
                        )}
                        <div className="message-data">{chat.message}</div>
                        {chat.senderName === userData.username && (
                          <div className="message-profile self">
                            {chat.senderName}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div className="send-message-section">
                    <input
                      type="text"
                      className="input-message"
                      placeholder="Enter the message"
                      value={userData.message}
                      onChange={changeMessage}
                    />
                    <button
                      type="button"
                      className="send-button"
                      onClick={() => {
                        handleButtonClick();
                        console.log(sent);
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
              {tab !== "CHATROOM" && (
                <div className="chat-content-container">
                  <ul className="chat-messages-list">
                    {[...(privateChats.get(tab) || [])].map((chat, index) => (
                      <li
                        className={`message-item ${
                          chat.senderName === userData.username && "self"
                        }`}
                        key={index}
                      >
                        {chat.senderName !== userData.username && (
                          <div className="message-profile">
                            {chat.senderName}
                          </div>
                        )}
                        <div className="message-data">{chat.message}</div>
                        {chat.senderName === userData.username && (
                          <div className="message-profile self">
                            {chat.senderName}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div className="send-message-section">
                    <input
                      type="text"
                      className="input-message"
                      placeholder="Enter the message"
                      value={userData.message}
                      onChange={changeMessage}
                    />
                    <button
                      type="button"
                      className="send-button"
                      onClick={() => {
                        sendPrivateValue(
                          stompClient,
                          userData,
                          tab,
                          privateChats,
                          setPrivateChats,
                          setUserData
                        );
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  } else {
    return <AccessDenied />;
  }
};

export default Chat;
