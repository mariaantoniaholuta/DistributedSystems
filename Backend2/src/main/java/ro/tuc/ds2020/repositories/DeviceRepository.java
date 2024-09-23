package ro.tuc.ds2020.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.tuc.ds2020.entities.Device;

import java.util.List;
import java.util.UUID;

@Repository

public interface DeviceRepository extends JpaRepository<Device, Long> {

    List<Device> findByUserId(String userId);

}
