package ro.tuc.ds2020.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeviceDTO {

    private Long id;
    private String userId;
    private String description;
    private String address;
    private String maxEnergyConsumption;

    public DeviceDTO() {
    }
    public DeviceDTO(Long id, String userId, String description, String address, String maxEnergyConsumption) {
        this.id = id;
        this.userId = userId;
        this.description = description;
        this.address = address;
        this.maxEnergyConsumption = maxEnergyConsumption;
    }

}
