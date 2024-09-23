package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.MonitoringDTO;
import ro.tuc.ds2020.dtos.MonitoringDetailsDTO;
import ro.tuc.ds2020.dtos.builders.MonitoringBuilder;
import ro.tuc.ds2020.entities.Monitoring;
import ro.tuc.ds2020.repositories.MonitoringRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MonitoringService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MonitoringService.class);

    private final MonitoringRepository monitoringRepository;

    @Autowired
    public MonitoringService(MonitoringRepository monitoringRepository) {
        this.monitoringRepository = monitoringRepository;
    }

    public List<MonitoringDTO> findMonitorings() {
        List<Monitoring> monitoringList = monitoringRepository.findAll();
        return monitoringList.stream()
                .map(MonitoringBuilder::toMonitoringDTO)
                .collect(Collectors.toList());
    }

    public Long insert(MonitoringDetailsDTO monitoringDTO) {
        Monitoring monitoring = MonitoringBuilder.toEntity(monitoringDTO);
        monitoring = monitoringRepository.save(monitoring);
        LOGGER.debug("Monitoring with id {} was inserted in db", monitoring.getId());
        return monitoring.getId();
    }

    public List<MonitoringDTO> findMonitoringsForDevice(String deviceId) {
        List<Monitoring> monitoringList = monitoringRepository.findByDeviceId(deviceId);
        return monitoringList.stream()
                .map(MonitoringBuilder::toMonitoringDTO)
                .collect(Collectors.toList());
    }
}
