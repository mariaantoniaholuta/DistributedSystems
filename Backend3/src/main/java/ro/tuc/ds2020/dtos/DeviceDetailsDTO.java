package ro.tuc.ds2020.dtos;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class DeviceDetailsDTO {

    private Long id;
    private String userId;
    @NotNull
    private String description;
    @NotNull
    private String address;
    @NotNull
    private String maxEnergyConsumption;
    public DeviceDetailsDTO(String userId, String description, String address, String maxEnergyConsumption) {
        this.userId = userId;
        this.description = description;
        this.address = address;
        this.maxEnergyConsumption = maxEnergyConsumption;
    }
}