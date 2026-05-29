package com.example.otpauth.controller;

import com.example.otpauth.model.Customer;
import com.example.otpauth.model.Interaction;
import com.example.otpauth.service.CrmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crm")
@CrossOrigin(origins = "*") // Adjust in production
public class CrmController {

    @Autowired
    private CrmService crmService;

    @GetMapping("/customers")
    public List<Customer> getAllCustomers() {
        return crmService.getAllCustomers();
    }

    @PostMapping("/customers")
    public Customer createCustomer(@RequestBody Customer customer) {
        return crmService.saveCustomer(customer);
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return crmService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customerDetails) {
        return crmService.getCustomerById(id).map(customer -> {
            customer.setName(customerDetails.getName());
            customer.setEmail(customerDetails.getEmail());
            customer.setPhone(customerDetails.getPhone());
            customer.setAddress(customerDetails.getAddress());
            customer.setCompany(customerDetails.getCompany());
            customer.setLoyaltyTier(customerDetails.getLoyaltyTier());
            return ResponseEntity.ok(crmService.saveCustomer(customer));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        crmService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/customers/{id}/interactions")
    public List<Interaction> getInteractions(@PathVariable Long id) {
        return crmService.getInteractionsByCustomer(id);
    }

    @PostMapping("/customers/{id}/interactions")
    public Interaction addInteraction(@PathVariable Long id, @RequestBody Interaction interaction) {
        return crmService.addInteraction(id, interaction);
    }
}
