package ro.tuc.ds2020.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "monitoring")
public class Monitoring {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name = "timestamp", nullable = false)
    private Long timestamp;

    @Column(name = "device_id", nullable = false)
    private String deviceId;

    @Column(name = "measurement_value", nullable = false)
    private double measurement_value;


    public Monitoring() {

    }

    public Monitoring(Long timestamp, String deviceId, double measurement_value) {
        this.timestamp = timestamp;
        this.deviceId = deviceId;
        this.measurement_value = measurement_value;
    }

}
