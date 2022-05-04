package com.kirillbalabanov.meditationanywhere;

import com.kirillbalabanov.meditationanywhere.config.ApplicationConfigurations;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(ApplicationConfigurations.class)
public class MeditationanywhereApplication {
	public static void main(String[] args) {
		SpringApplication.run(MeditationanywhereApplication.class, args);
	}

}
