package ro.tuc.ds2020;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.*;

@Component
public class MessageProducer {

    private static String device_id = "4";
    private static BufferedReader br;

    @Autowired
    private AmqpTemplate amqpTemplate;

    @Autowired
    private ResourceLoader resourceLoader;

    @Scheduled(fixedRate = 10000)
    public void sendDataToBroker() throws IOException {
//        System.out.println("begin");
        if (br == null) {
            ClassLoader classLoader = getClass().getClassLoader();
            File file = new File(classLoader.getResource("sensor.csv").getFile());
            FileInputStream input = new FileInputStream(file);
            br = new BufferedReader(new InputStreamReader(input));
        }

        String line;
        while ((line = br.readLine()) != null) {
            String[] values = line.split(",");
            String measurement_value = values[0];
            long timestamp = System.currentTimeMillis();

            String message = String.format("{\"timestamp\": %d, \"device_id\": \"%s\", \"measurement_value\": %f}",
                    timestamp, device_id, Double.parseDouble(measurement_value));

            amqpTemplate.convertAndSend("", "deviceMessageTest", message);
            System.out.println(" the following message was sent: " + message);
            break;
        }
        if (line == null) {
            br.close();
        }
    }
}
