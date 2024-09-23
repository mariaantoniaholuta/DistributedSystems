package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.dtos.builders.DeviceBuilder;
import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.repositories.DeviceRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeviceService {

    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceService.class);

    private final DeviceRepository deviceRepository;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    public List<DeviceDTO> findDevices() {
        List<Device> deviceList = deviceRepository.findAll();
        return deviceList.stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }

    public DeviceDTO findDeviceById(Long id) {
        Optional<Device> prosumerOptional = deviceRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", id);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        return DeviceBuilder.toDeviceDTO(prosumerOptional.get());
    }

    public Long insert(DeviceDetailsDTO deviceDTO) {
        Device device = DeviceBuilder.toEntity(deviceDTO);
        device = deviceRepository.save(device);
        LOGGER.debug("Person with id {} was inserted in db", device.getId());
        return device.getId();
    }

    public boolean update(Long id, DeviceDetailsDTO updatedDeviceDTO) {
        Optional<Device> deviceOptional = deviceRepository.findById(id);
        if (deviceOptional.isPresent()) {
            Device device = deviceOptional.get();
            Device updatedDevice = DeviceBuilder.toEntity(updatedDeviceDTO);
            updatedDevice.setId(device.getId());
            deviceRepository.save(updatedDevice);
            LOGGER.debug("Device with id {} was updated in the database", device.getId());
            return true;
        } else {
            LOGGER.error("Device with id {} was not found in the database", id);
            return false;
        }
    }

    public boolean delete(Long id) {
        if (deviceRepository.existsById(id)) {
            deviceRepository.deleteById(id);
            LOGGER.debug("Device with id {} was deleted from the database", id);
            return true;
        } else {
            LOGGER.error("Device with id {} was not found in the database", id);
            return false;
        }
    }

    public boolean assignDeviceToUser(Long deviceId, String userId) {
        Optional<Device> deviceOptional = deviceRepository.findById(deviceId);
        if (deviceOptional.isPresent()) {
            Device device = deviceOptional.get();
            if(userId.charAt(userId.length() - 1) == '='){
                userId = userId.substring(0,userId.length()-1);
            }
            device.setUserId(userId);
            deviceRepository.save(device);

            LOGGER.debug("Device with id {} was assigned to user with id {}", deviceId, userId);
            return true;
        } else {
            LOGGER.error("Device with id {} was not found in the database", deviceId);
            return false;
        }
    }

    public List<DeviceDTO> getDevicesByUserId(String userId) {
        List<Device> devices = deviceRepository.findByUserId(userId);

        return devices.stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }

    public boolean removeUserFromDevices(String userId) {
        if(userId.charAt(userId.length() - 1) == '='){
            userId = userId.substring(0,userId.length()-1);
        }
        List<Device> devices = deviceRepository.findByUserId(userId);
        for (Device device : devices) {
            device.setUserId(null);
        }
        deviceRepository.saveAll(devices);
        return true;
    }

    public boolean removeUserFromDevice(String userId, Long deviceId) {
        if(userId.charAt(userId.length() - 1) == '='){
            userId = userId.substring(0,userId.length()-1);
        }
        Optional<Device> deviceOptional = deviceRepository.findById(deviceId);
        if (deviceOptional.isPresent()) {
            Device device = deviceOptional.get();

            if (device.getUserId() != null && device.getUserId().equals(userId)) {
                device.setUserId(null);
                deviceRepository.save(device);
                return true;
            }
        }
        return false;
    }

    public String getUserIdByDeviceId(Long deviceId) {
        Optional<Device> optionalDevice = deviceRepository.findById(deviceId);

        return optionalDevice.map(Device::getUserId).orElse(null);
    }
}
