package ro.tuc.ds2020.dtos;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class MonitoringDetailsDTO {

    @NotNull
    private Long timestamp;

    @NotNull
    private String device_id;

    @NotNull
    private double measurement_value;

    public MonitoringDetailsDTO(Long timestamp, String device_id, double measurement_value) {
        this.timestamp = timestamp;
        this.device_id = device_id;
        this.measurement_value = measurement_value;
    }
}
