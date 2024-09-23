package ro.tuc.ds2020.dtos;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MonitoringDTO {

    private Long id;

    private Long timestamp;

    private String device_id;

    private double measurement_value;

    public MonitoringDTO() {
    }

    public MonitoringDTO(Long id, Long timestamp, String device_id, double measurement_value) {
        this.id = id;
        this.timestamp = timestamp;
        this.device_id = device_id;
        this.measurement_value = measurement_value;
    }

}
