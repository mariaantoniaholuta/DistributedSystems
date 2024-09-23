package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.services.DeviceService;
import ro.tuc.ds2020.services.JWTService;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping(value = "/device")
public class DeviceController {
    private final DeviceService deviceService;

    private JWTService jwtService;

    @Autowired
    public DeviceController(DeviceService deviceService, JWTService jwtService) {
        this.deviceService = deviceService;
        this.jwtService = jwtService;
    }

    @GetMapping()
    public ResponseEntity<List<DeviceDTO>> getDevices(@RequestHeader(value = "Authorization", required = true) String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        String role = jwtService.extractUserRole(token);
        System.out.println("ROLE IS: " + role);
        if(role.equals("Admin")) {
            System.out.println("access with role " + role);
            List<DeviceDTO> dtos = deviceService.findDevices();
            return new ResponseEntity<>(dtos, HttpStatus.OK);
        } else {
            System.out.println("forbidden with role " + role);
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping()
    public ResponseEntity<Long> insertDevice(@Valid @RequestBody DeviceDetailsDTO deviceDTO, @RequestHeader(value = "Authorization", required = true) String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        String role = jwtService.extractUserRole(token);
        if(role.equals("Admin")) {
            Long deviceID = deviceService.insert(deviceDTO);
            return new ResponseEntity<>(deviceID, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/{deviceId}")
    public ResponseEntity<DeviceDTO> getDeviceById(@PathVariable Long deviceId, @RequestHeader(value = "Authorization", required = true) String bearerToken) {
        DeviceDTO deviceDTO = deviceService.findDeviceById(deviceId);
        String token = bearerToken.replace("Bearer ", "");
        String role = jwtService.extractUserRole(token);
        if(role.equals("Admin")) {
            if (deviceDTO != null) {
                return new ResponseEntity<>(deviceDTO, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/{deviceId}/userId")
    public ResponseEntity<String> getUserIdByDeviceId(@PathVariable Long deviceId, @RequestHeader(value = "Authorization", required = true) String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        String role = jwtService.extractUserRole(token);
        System.out.println("ROLE IS: " + role);
        if(role.equals("Admin")) {
            String userId = deviceService.getUserIdByDeviceId(deviceId);
            if (userId != null) {
                return new ResponseEntity<>(userId, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/{deviceId}")
    public ResponseEntity<Void> updateDevice(@PathVariable Long deviceId, @Valid @RequestBody DeviceDetailsDTO deviceDTO, @RequestHeader(value = "Authorization", required = true) String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        String role = jwtService.extractUserRole(token);
        if(role.equals("Admin")) {
            boolean updated = deviceService.update(deviceId, deviceDTO);
            if (updated) {
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @DeleteMapping("/{deviceId}")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long deviceId, @RequestHeader(value = "Authorization", required = true) String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        String role = jwtService.extractUserRole(token);
        System.out.println("ROLE IS: " + role);
        if(role.equals("Admin")) {
            boolean deleted = deviceService.delete(deviceId);
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

    }

    @PostMapping("/{deviceId}/assignUser")
    public ResponseEntity<Void> assignDeviceToUser(@PathVariable Long deviceId, @RequestBody String userId, @RequestHeader(value = "Authorization", required = true) String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        String role = jwtService.extractUserRole(token);
        System.out.println("ROLE IS: " + role);
        if(role.equals("Admin")) {
            boolean assigned = deviceService.assignDeviceToUser(deviceId, userId);
            if (assigned) {
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/removeUser")
    public ResponseEntity<Void> removeUserFromDevices(@RequestBody String userId, @RequestHeader(value = "Authorization", required = true) String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        String role = jwtService.extractUserRole(token);
        System.out.println("ROLE IS: " + role);
        if(role.equals("Admin")) {
            boolean removed = deviceService.removeUserFromDevices(userId);
            if (removed) {
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

    }


    @PostMapping("/{deviceId}/removeUserDevice")
    public ResponseEntity<Void> removeUserFromDevice(@PathVariable Long deviceId, @RequestBody String userId, @RequestHeader(value = "Authorization", required = true) String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        String role = jwtService.extractUserRole(token);
        System.out.println("ROLE IS: " + role);
        if(role.equals("Admin")) {
            boolean removed = deviceService.removeUserFromDevice(userId, deviceId);
            if (removed) {
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

}
