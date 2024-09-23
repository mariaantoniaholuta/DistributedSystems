package ro.tuc.ds2020.rabbitmq;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.reactive.function.client.WebClient;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.dtos.MonitoringDetailsDTO;
import ro.tuc.ds2020.services.MonitoringService;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
//@CrossOrigin("*")
public class MessageConsumer {

    private final MonitoringService monitoringService;
    private final ObjectMapper objectMapper;
    private final WebClient webClient;
    private final SimpMessagingTemplate messagingTemplate;

    private static final Map<String, Double> deviceEnergyMap = new HashMap<>();

    @Autowired
    public MessageConsumer(
            MonitoringService monitoringService,
            ObjectMapper objectMapper,
            WebClient.Builder webClientBuilder,
            SimpMessagingTemplate messagingTemplate) {
        this.monitoringService = monitoringService;
        this.objectMapper = objectMapper;
        this.webClient = webClientBuilder.baseUrl("http://localhost:8081/spring-demo").build();
        this.messagingTemplate = messagingTemplate;
    }

    @RabbitListener(queues = "deviceMessageTest")
    public void receiveMessage(String message) {
        System.out.println("Received message: " + message);

        try {
            MonitoringDetailsDTO monitoringDTO = objectMapper.readValue(message, MonitoringDetailsDTO.class);

            updateCumulativeEnergy(monitoringDTO);

            Long id = monitoringService.insert(monitoringDTO);
            System.out.println("Data stored in the database. Device ID and Monitoring ID: " + monitoringDTO.getDevice_id() + " " + id);

            checkEnergyLimit(monitoringDTO);

        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
        }

    }

    private void updateCumulativeEnergy(MonitoringDetailsDTO monitoringDTO) {
        String deviceId = monitoringDTO.getDevice_id();
        double measurementValue = monitoringDTO.getMeasurement_value();

        deviceEnergyMap.put(deviceId, deviceEnergyMap.getOrDefault(deviceId, 0.0) + measurementValue);
    }

    private void checkEnergyLimit(MonitoringDetailsDTO monitoringDTO) {
        String deviceId = monitoringDTO.getDevice_id();

        double currentEnergy = deviceEnergyMap.getOrDefault(deviceId, 0.0);

        DeviceDetailsDTO deviceDetailsDTO = webClient
                .get()
                .uri("/device/{deviceId}", deviceId)
                .retrieve()
                .bodyToMono(DeviceDetailsDTO.class)
                .block();

        if (deviceDetailsDTO != null && currentEnergy > Double.parseDouble(deviceDetailsDTO.getMaxEnergyConsumption())) {
            System.out.println("Energy limit exceeded for device ID: " + deviceId);
            System.out.println("current energy: " + currentEnergy);
            pushNotificationToClients(deviceId);
            currentEnergy = 0;
        }
    }

    private void pushNotificationToClients(String deviceId) {
        ResponseEntity<String> response = webClient
                .get()
                .uri("/device/{deviceId}/userId", deviceId)
                .retrieve()
                .toEntity(String.class)
                .block();
        System.out.println("push notification...");
        if (response != null && response.getStatusCode().is2xxSuccessful()) {
            String userId = response.getBody();
            System.out.println("user id " + userId);

            if (userId != null && !userId.isEmpty()) {

                String message = "Energy limit exceeded for device: " + deviceId;
                //System.out.println("Sending WebSocket message: " + message);
                messagingTemplate.convertAndSendToUser(
                        userId,
                        "/queue/notifications",
                        "Energy limit exceeded for device: " + deviceId
                );
                messagingTemplate.convertAndSend(
                        "/user/"+userId+"/queue/notifications",
                        message
                );
                messagingTemplate.convertAndSend(
                        "/topic/notifications",
                        message
                );
            }
        }
    }

}