package ro.tuc.ds2020.config;

import jakarta.annotation.PostConstruct;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${spring.rabbitmq.host}")
    private String rabbitmqHost;

    @Value("${spring.rabbitmq.port}")
    private int rabbitmqPort;

    @Value("${spring.rabbitmq.username}")
    private String rabbitmqUsername;

    @Value("${spring.rabbitmq.password}")
    private String rabbitmqPassword;

    @Value("${spring.rabbitmq.virtual-host}")
    private String rabbitmqVirtualHost;

    @PostConstruct
    public void init() {
        System.out.println("RabbitMQ Monitoring Config:");
        System.out.println("Host: " + rabbitmqHost);
        System.out.println("Port: " + rabbitmqPort);
        System.out.println("Username: " + rabbitmqUsername);
        System.out.println("Password: " + rabbitmqPassword);
        System.out.println("Virtual Host: " + rabbitmqVirtualHost);
    }

}
