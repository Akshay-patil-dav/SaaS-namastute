package com.example.otpauth.config;

import com.example.otpauth.model.Product;
import com.example.otpauth.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DummyDataSeeder {

    @Bean
    public CommandLineRunner initDummyData(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                System.out.println("No products found in DB. Seeding dummy data for ecomm storefront...");

                Product p1 = new Product();
                p1.setName("Quantum Wireless Headphones");
                p1.setSlug("quantum-wireless-headphones");
                p1.setSku("QWH-001");
                p1.setPrice(new BigDecimal("299.99"));
                p1.setPurchasePrice(new BigDecimal("150.00"));
                p1.setDescription("Experience absolute acoustic clarity. The Quantum Wireless Headphones combine industry-leading active noise cancellation with a stunning ergonomic design, providing 40 hours of uninterrupted high-fidelity audio.");
                p1.setImages("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop");
                p1.setQuantity(100);
                p1.setCategory("Audio");
                p1.setBrand("Quantum");
                p1.setManufacturer("Quantum Audio Inc.");
                
                Product p2 = new Product();
                p2.setName("Nebula Smartwatch Pro");
                p2.setSlug("nebula-smartwatch-pro");
                p2.setSku("NSP-002");
                p2.setPrice(new BigDecimal("349.99"));
                p2.setPurchasePrice(new BigDecimal("200.00"));
                p2.setDescription("Track your life with the Nebula Smartwatch Pro. Features a stunning AMOLED display, 24/7 heart rate tracking, ECG apps, and advanced sleep monitoring in a sleek titanium case.");
                p2.setImages("https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=2000&auto=format&fit=crop");
                p2.setQuantity(50);
                p2.setCategory("Wearables");
                p2.setBrand("Nebula");
                
                Product p3 = new Product();
                p3.setName("Aero Mechanical Keyboard");
                p3.setSlug("aero-mechanical-keyboard");
                p3.setSku("AMK-003");
                p3.setPrice(new BigDecimal("159.99"));
                p3.setPurchasePrice(new BigDecimal("80.00"));
                p3.setDescription("Elevate your typing experience. The Aero features premium tactile switches, per-key RGB illumination, and an aerospace-grade aluminum chassis for ultimate durability.");
                p3.setImages("https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2071&auto=format&fit=crop");
                p3.setQuantity(200);
                p3.setCategory("Peripherals");
                p3.setBrand("Aero");
                
                productRepository.saveAll(List.of(p1, p2, p3));
                System.out.println("Dummy products seeded successfully.");
            } else {
                System.out.println("Products already exist in DB. Skipping seeder.");
            }
        };
    }
}
