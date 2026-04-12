package com.example.otpauth.config;

import com.example.otpauth.model.Unit;
import com.example.otpauth.repository.UnitRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initData(UnitRepository unitRepository) {
        return args -> {
            if (unitRepository.count() == 0) {
                Unit pieces = new Unit();
                pieces.setName("Pieces");
                pieces.setShortName("pcs");
                pieces.setStatus(true);
                
                Unit kg = new Unit();
                kg.setName("Kilograms");
                kg.setShortName("kg");
                kg.setStatus(true);

                Unit grams = new Unit();
                grams.setName("Grams");
                grams.setShortName("g");
                grams.setStatus(true);

                Unit meters = new Unit();
                meters.setName("Meters");
                meters.setShortName("m");
                meters.setStatus(true);

                Unit liters = new Unit();
                liters.setName("Liters");
                liters.setShortName("L");
                liters.setStatus(true);

                unitRepository.saveAll(List.of(pieces, kg, grams, meters, liters));
                System.out.println("DataSeeder: Initial units seeded into database.");
            }
        };
    }
}
