package com.gregluna.civiclens;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@Component
public class RouteLogger {

    @Bean
    CommandLineRunner logRoutes(RequestMappingHandlerMapping mapping) {
        return args -> mapping.getHandlerMethods()
                .forEach((key, value) -> System.out.println("ROUTE: " + key));
    }
}