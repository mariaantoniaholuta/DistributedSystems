package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.MonitoringDTO;
import ro.tuc.ds2020.dtos.MonitoringDetailsDTO;
import ro.tuc.ds2020.entities.Monitoring;

public class MonitoringBuilder {
    private MonitoringBuilder() {
    }

    public static MonitoringDTO toMonitoringDTO(Monitoring monitoring) {
        return new MonitoringDTO(monitoring.getId(), monitoring.getTimestamp(), monitoring.getDeviceId(), monitoring.getMeasurement_value());
    }

    public static Monitoring toEntity(MonitoringDetailsDTO monitoringDetailsDTO) {
        return new Monitoring(monitoringDetailsDTO.getTimestamp(),
                monitoringDetailsDTO.getDevice_id(),
                monitoringDetailsDTO.getMeasurement_value());
    }
}
