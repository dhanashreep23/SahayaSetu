package com.sahayaSetu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SahayaSetuApplication {

	public static void main(String[] args) {
		SpringApplication.run(SahayaSetuApplication.class, args);
	}

}
