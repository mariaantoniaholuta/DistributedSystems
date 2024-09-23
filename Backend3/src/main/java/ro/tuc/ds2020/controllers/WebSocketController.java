//package ro.tuc.ds2020.controllers;
//
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.SendTo;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.CrossOrigin;
//
//@Controller
//@CrossOrigin
//public class WebSocketController {
//
//    @MessageMapping("/sendNotification")
//    @SendTo("/queue/notifications")
//    public String sendNotification(String message) {
//        return message;
//    }
//}