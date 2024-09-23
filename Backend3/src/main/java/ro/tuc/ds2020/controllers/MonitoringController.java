package ro.tuc.ds2020.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.MonitoringDTO;
import ro.tuc.ds2020.dtos.MonitoringDetailsDTO;
import ro.tuc.ds2020.services.JWTService;
import ro.tuc.ds2020.services.MonitoringService;

import java.util.List;


@RestController
@CrossOrigin
@RequestMapping(value = "/monitoring")
public class MonitoringController {

    private final MonitoringService monitoringService;
    private JWTService jwtService;
    @Autowired
    public MonitoringController(MonitoringService monitoringService, JWTService jwtService) {
        this.jwtService = jwtService;
        this.monitoringService = monitoringService;
    }

    @GetMapping()
    public ResponseEntity<List<MonitoringDTO>> getMonitorings(@RequestHeader(value = "Authorization", required = true) String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        String role = jwtService.extractUserRole(token);
        System.out.println("ROLE IS: " + role);
        if(role.equals("Admin")) {
            List<MonitoringDTO> dtos = monitoringService.findMonitorings();
            return new ResponseEntity<>(dtos, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping()
    public ResponseEntity<Long> insertMonitoring(@Valid @RequestBody MonitoringDetailsDTO monitoringDTO, @RequestHeader(value = "Authorization", required = true) String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        String role = jwtService.extractUserRole(token);
        System.out.println("ROLE IS: " + role);
        if(role.equals("Admin")) {
            Long deviceID = monitoringService.insert(monitoringDTO);
            return new ResponseEntity<>(deviceID, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/{deviceId}")
    public ResponseEntity<List<MonitoringDTO>> getMonitoringsForDevice(@PathVariable String deviceId, @RequestHeader(value = "Authorization", required = true) String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        String role = jwtService.extractUserRole(token);
        System.out.println("ROLE IS: " + role);
        if(role.equals("Client")) {
            List<MonitoringDTO> dtos = monitoringService.findMonitoringsForDevice(deviceId);
            return new ResponseEntity<>(dtos, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
