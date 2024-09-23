package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.services.DeviceService;
import ro.tuc.ds2020.services.JWTService;

import java.util.List;


@RestController
@CrossOrigin
@RequestMapping(value = "/client")
public class ClientController {

    private final DeviceService deviceService;
    private JWTService jwtService;

    @Autowired
    public ClientController(DeviceService deviceService, JWTService jwtService) {
        this.deviceService = deviceService;
        this.jwtService = jwtService;
    }

    @GetMapping("/userId")
    public ResponseEntity<?> getUserId(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String userId = jwtService.extractUserId(token);
            return new ResponseEntity<>(userId, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }
    @GetMapping("/{userId}/devices")
    public ResponseEntity<List<DeviceDTO>> getDevicesForUser(@PathVariable String userId, @RequestHeader(value = "Authorization", required = true) String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        String role = jwtService.extractUserRole(token);
        System.out.println("ROLE IS: " + role);
        if(role.equals("Client")) {
            List<DeviceDTO> devices = deviceService.getDevicesByUserId(userId);

            if (devices.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(devices, HttpStatus.OK);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

    }
}
