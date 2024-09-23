package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.tuc.ds2020.entities.Monitoring;

import java.time.LocalDateTime;
import java.util.List;

@Repository

public interface MonitoringRepository extends JpaRepository<Monitoring, Long> {
    public List<Monitoring> findByDeviceId(String deviceId);
//    List<Monitoring> findByDeviceId(String deviceId);

//    List<Monitoring> findByMeasurementValue(Long measurement_value);

}
