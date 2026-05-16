package com.gregluna.civiclens.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    // Base URL is externalized so local, Render, and test environments can override it.
    @Bean
    public RestClient nycOpenDataRestClient(
            RestClient.Builder builder,
            @Value("${civiclens.nyc-open-data.base-url}") String baseUrl) {
        return builder.baseUrl(baseUrl).build();
    }
}
