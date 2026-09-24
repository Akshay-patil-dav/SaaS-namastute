package com.example.otpauth.service;

import com.example.otpauth.model.Customer;
import com.example.otpauth.model.Interaction;
import com.example.otpauth.repository.CustomerRepository;
import com.example.otpauth.repository.InteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CrmService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private InteractionRepository interactionRepository;

    @Autowired
    private DataUsageService dataUsageService;

    public List<Customer> getAllCustomers() {
        return customerRepository.findByUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public Customer saveCustomer(Customer customer) {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        if (customer.getId() == null) {
            dataUsageService.checkDataLimit(userId);
        }
        customer.setUserId(userId);
        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) {
        if (customerRepository.existsByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId())) {
            customerRepository.deleteById(id);
        }
    }

    public Interaction addInteraction(Long customerId, Interaction interaction) {
        return customerRepository.findByIdAndUserId(customerId, com.example.otpauth.util.SecurityUtils.getCurrentUserId()).map(customer -> {
            interaction.setCustomer(customer);
            return interactionRepository.save(interaction);
        }).orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public List<Interaction> getInteractionsByCustomer(Long customerId) {
        return interactionRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }
}
