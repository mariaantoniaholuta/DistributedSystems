export interface Message {
  senderName: string;
  receiverName?: string;
  message: string;
  status: "JOIN" | "MESSAGE";
  senderRole: string;
  isTyping: boolean;
}

export const userJoin = (
  userData: {
    username: string;
    receivername: string;
    connected: boolean;
    message: string;
    role: string;
  },
  stompClient: any
) => {
  console.log("role in user join is " + userData.role);
  var message: Message = {
    senderName: userData.username,
    status: "JOIN",
    message: "",
    senderRole: userData.role,
    isTyping: false,
  };
  stompClient.send("/app/message", {}, JSON.stringify(message));
};

export const onMessageReceived = (
  payload: any,
  privateChats: any,
  setPrivateChats: any,
  setpublicChats: any,
  publicChats: any,
  loggedUserRole: string,
  loggedUserName: string
) => {
  var payloadData: Message = JSON.parse(payload.body);

  switch (payloadData.status) {
    case "JOIN":
      console.log("join");
      if (!privateChats.get(payloadData.senderName)) {
        privateChats.set(payloadData.senderName, []);
        setPrivateChats(new Map(privateChats));
      }
      break;
    case "MESSAGE":
      console.log("message");
      if (loggedUserRole === "Admin" || payloadData.senderRole === "Admin") {
        setpublicChats([...publicChats, payloadData]);
      } else {
        console.log("role is " + payloadData.senderRole);
        if (loggedUserRole === "Client" && payloadData.senderRole === "Admin") {
          setpublicChats([...publicChats, payloadData]);
        } else if (
          loggedUserRole === "Client" &&
          payloadData.senderName === loggedUserName
        ) {
          setpublicChats([...publicChats, payloadData]);
        }
      }
      break;
  }
};

export const onPrivateMessage = (
  payload: any,
  privateChats: any,
  setPrivateChats: any,
  setIsTyping: any
) => {
  console.log(payload);
  var payloadData: Message = JSON.parse(payload.body);

  if (payloadData.isTyping) {
    if (
      !privateChats
        .get(payloadData.senderName)
        ?.some((msg: Message) => msg.isTyping)
    ) {
      console.log(`${payloadData.senderName} is typing...`);
      setIsTyping(true);

      const typingMessage = {
        senderName: payloadData.senderName,
        message: "is typing...",
        status: payloadData.status,
        senderRole: payloadData.senderRole,
        isTyping: true,
      };

      if (privateChats.get(payloadData.senderName)) {
        privateChats.get(payloadData.senderName)?.push(typingMessage);
      } else {
        let list: Message[] = [typingMessage];
        privateChats.set(payloadData.senderName, list);
      }
      setPrivateChats(new Map(privateChats));
    }
  } else {
    setIsTyping(false);

    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName)?.push(payloadData);
    } else {
      let list: Message[] = [payloadData];
      privateChats.set(payloadData.senderName, list);
    }
    setPrivateChats(new Map(privateChats));
  }
};

export const onError = (err: any) => {
  console.log(err);
};

export const sendValue = (
  stompClient: any,
  userData: any,
  setUserData: any,

) => {
  console.log(stompClient);

  if (stompClient) {
    var Message: Message = {
      senderName: userData.username,
      message: userData.message,
      status: "MESSAGE",
      senderRole: userData.role,
      isTyping: false,
    };
    console.log(Message);
    console.log("role" + userData.role);
    stompClient.send("/app/message", {}, JSON.stringify(Message));
    setUserData({ ...userData, message: "" });
  }
};

export const sendPrivateValue = (
  stompClient: any,
  userData: any,
  tab: any,
  privateChats: any,
  setPrivateChats: any,
  setUserData: any
) => {
  console.log(stompClient);
  if (stompClient && stompClient.connected) {
    console.log("here");
    var Message: Message = {
      senderName: userData.username,
      receiverName: tab,
      message: userData.message,
      status: "MESSAGE",
      senderRole: userData.role,
      isTyping: false,
    };

    if (userData.username !== tab) {
      privateChats.get(tab)?.push(Message);
      setPrivateChats(new Map(privateChats));
    }
    stompClient.send("/app/private-message", {}, JSON.stringify(Message));
    setUserData({ ...userData, message: "" });
  }
};
