package com.example.otpauth.service;

import com.example.otpauth.dto.BestSellerDTO;
import com.example.otpauth.dto.ChartDataDTO;
import com.example.otpauth.dto.DashboardDTO;
import com.example.otpauth.dto.LowStockProductDTO;
import com.example.otpauth.dto.RecentTransactionDTO;
import com.example.otpauth.model.PosOrder;
import com.example.otpauth.model.SaleOrder;
import com.example.otpauth.repository.CustomerRepository;
import com.example.otpauth.repository.PosOrderRepository;
import com.example.otpauth.repository.ProductRepository;
import com.example.otpauth.repository.SaleOrderRepository;
import com.example.otpauth.model.Product;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final PosOrderRepository posOrderRepository;
    private final SaleOrderRepository saleOrderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    public DashboardService(PosOrderRepository posOrderRepository,
                            SaleOrderRepository saleOrderRepository,
                            CustomerRepository customerRepository,
                            ProductRepository productRepository,
                            ObjectMapper objectMapper) {
        this.posOrderRepository = posOrderRepository;
        this.saleOrderRepository = saleOrderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.objectMapper = objectMapper;
    }

    public DashboardDTO getDashboardAnalytics(Long userId) {
        DashboardDTO dashboard = new DashboardDTO();

        List<PosOrder> allPosOrders = posOrderRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
        List<SaleOrder> allSaleOrders = saleOrderRepository.findAllByUserIdOrderByCreatedAtDesc(userId);

        // 1. Total Orders
        long totalOrders = allPosOrders.size() + allSaleOrders.size();
        dashboard.setTotalOrders(totalOrders);

        // 2. Total Customers
        long totalCustomers = customerRepository.findByUserId(userId).size();
        dashboard.setTotalCustomers(totalCustomers);

        // 3. Weekly Earnings (Last 7 days) & Percentage Increase
        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(7);
        LocalDate fourteenDaysAgo = today.minusDays(14);

        BigDecimal currentWeekEarnings = BigDecimal.ZERO;
        BigDecimal previousWeekEarnings = BigDecimal.ZERO;

        for (PosOrder order : allPosOrders) {
            if (order.getDate() != null) {
                if (!order.getDate().isBefore(sevenDaysAgo)) {
                    currentWeekEarnings = currentWeekEarnings.add(order.getGrandTotal() != null ? order.getGrandTotal() : BigDecimal.ZERO);
                } else if (!order.getDate().isBefore(fourteenDaysAgo)) {
                    previousWeekEarnings = previousWeekEarnings.add(order.getGrandTotal() != null ? order.getGrandTotal() : BigDecimal.ZERO);
                }
            }
        }
        for (SaleOrder order : allSaleOrders) {
            if (order.getDate() != null) {
                if (!order.getDate().isBefore(sevenDaysAgo)) {
                    currentWeekEarnings = currentWeekEarnings.add(order.getGrandTotal() != null ? order.getGrandTotal() : BigDecimal.ZERO);
                } else if (!order.getDate().isBefore(fourteenDaysAgo)) {
                    previousWeekEarnings = previousWeekEarnings.add(order.getGrandTotal() != null ? order.getGrandTotal() : BigDecimal.ZERO);
                }
            }
        }

        dashboard.setWeeklyEarnings(currentWeekEarnings);

        double percentageIncrease = 0.0;
        if (previousWeekEarnings.compareTo(BigDecimal.ZERO) > 0) {
            percentageIncrease = currentWeekEarnings.subtract(previousWeekEarnings)
                    .divide(previousWeekEarnings, 4, java.math.RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100")).doubleValue();
        } else if (currentWeekEarnings.compareTo(BigDecimal.ZERO) > 0) {
            percentageIncrease = 100.0;
        }
        dashboard.setPercentageIncrease(percentageIncrease);

        // 4. Recent Transactions (Top 5)
        List<RecentTransactionDTO> recentTransactions = new ArrayList<>();
        
        List<Object> combinedOrders = new ArrayList<>();
        combinedOrders.addAll(allPosOrders);
        combinedOrders.addAll(allSaleOrders);

        combinedOrders.sort((o1, o2) -> {
            java.time.LocalDateTime t1 = o1 instanceof PosOrder ? ((PosOrder) o1).getCreatedAt() : ((SaleOrder) o1).getCreatedAt();
            java.time.LocalDateTime t2 = o2 instanceof PosOrder ? ((PosOrder) o2).getCreatedAt() : ((SaleOrder) o2).getCreatedAt();
            if (t1 == null && t2 == null) return 0;
            if (t1 == null) return 1;
            if (t2 == null) return -1;
            return t2.compareTo(t1); // Descending
        });

        int limit = Math.min(5, combinedOrders.size());
        for (int i = 0; i < limit; i++) {
            Object order = combinedOrders.get(i);
            if (order instanceof PosOrder) {
                PosOrder p = (PosOrder) order;
                String stClass = "success";
                if ("Pending".equalsIgnoreCase(p.getStatus())) stClass = "warning";
                if ("Cancelled".equalsIgnoreCase(p.getStatus())) stClass = "danger";

                recentTransactions.add(new RecentTransactionDTO(
                        p.getId(),
                        p.getCustomerName() != null ? p.getCustomerName() : "Unknown Customer",
                        "Just Now", // You can calculate actual time ago here if needed
                        p.getPaymentStatus() != null ? p.getPaymentStatus() : "N/A",
                        p.getReferenceNo() != null ? p.getReferenceNo() : "N/A",
                        p.getStatus() != null ? p.getStatus() : "Completed",
                        stClass,
                        "₹" + (p.getGrandTotal() != null ? p.getGrandTotal() : "0.00")
                ));
            } else {
                SaleOrder s = (SaleOrder) order;
                String stClass = "success";
                if ("Pending".equalsIgnoreCase(s.getStatus())) stClass = "warning";
                if ("Cancelled".equalsIgnoreCase(s.getStatus())) stClass = "danger";

                recentTransactions.add(new RecentTransactionDTO(
                        s.getId(),
                        s.getCustomerName() != null ? s.getCustomerName() : "Unknown Customer",
                        "Just Now",
                        s.getPaymentStatus() != null ? s.getPaymentStatus() : "N/A",
                        s.getReferenceNo() != null ? s.getReferenceNo() : "N/A",
                        s.getStatus() != null ? s.getStatus() : "Completed",
                        stClass,
                        "₹" + (s.getGrandTotal() != null ? s.getGrandTotal() : "0.00")
                ));
            }
        }
        dashboard.setRecentTransactions(recentTransactions);

        // 5. Chart Data (Last 7 Days)
        List<ChartDataDTO> chartData = new ArrayList<>();
        DateTimeFormatter chartFormatter = DateTimeFormatter.ofPattern("MMM dd");
        
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            BigDecimal dayTotal = BigDecimal.ZERO;
            for (PosOrder p : allPosOrders) {
                if (p.getDate() != null && p.getDate().equals(d)) {
                    dayTotal = dayTotal.add(p.getGrandTotal() != null ? p.getGrandTotal() : BigDecimal.ZERO);
                }
            }
            for (SaleOrder s : allSaleOrders) {
                if (s.getDate() != null && s.getDate().equals(d)) {
                    dayTotal = dayTotal.add(s.getGrandTotal() != null ? s.getGrandTotal() : BigDecimal.ZERO);
                }
            }
            chartData.add(new ChartDataDTO(d.format(chartFormatter), dayTotal));
        }
        dashboard.setChartData(chartData);

        // 6. Best Sellers (Dummy logic for now, in a real scenario you'd parse productsJson)
        // I will implement basic parsing of productsJson to find the top 5
        Map<String, Integer> productSales = new HashMap<>();
        Map<String, BigDecimal> productPrices = new HashMap<>();

        for (Object order : combinedOrders) {
            String status = order instanceof PosOrder ? ((PosOrder) order).getStatus() : ((SaleOrder) order).getStatus();
            if ("Cancelled".equalsIgnoreCase(status)) {
                continue;
            }

            String json = order instanceof PosOrder ? ((PosOrder) order).getProductsJson() : ((SaleOrder) order).getProductsJson();
            if (json != null && !json.isBlank()) {
                try {
                    List<Map<String, Object>> items = objectMapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {});
                    for (Map<String, Object> item : items) {
                        String name = (String) item.get("name");
                        if (name != null) {
                            int qty = 1;
                            if (item.containsKey("quantity")) {
                                Object q = item.get("quantity");
                                if (q instanceof Integer) qty = (Integer) q;
                                else if (q instanceof String) qty = Integer.parseInt((String) q);
                            }
                            productSales.put(name, productSales.getOrDefault(name, 0) + qty);
                            
                            if (!productPrices.containsKey(name) && item.containsKey("price")) {
                                Object p = item.get("price");
                                if (p instanceof Number) {
                                    productPrices.put(name, new BigDecimal(p.toString()));
                                } else if (p instanceof String) {
                                    productPrices.put(name, new BigDecimal((String) p));
                                }
                            }
                        }
                    }
                } catch (Exception e) {
                    // Skip if JSON is invalid
                }
            }
        }

        List<BestSellerDTO> bestSellers = productSales.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(5)
                .map(e -> {
                    String name = e.getKey();
                    BigDecimal price = productPrices.getOrDefault(name, BigDecimal.ZERO);
                    return new BestSellerDTO(name, "₹" + price.toString(), e.getValue());
                })
                .collect(Collectors.toList());

        // Fallback if no best sellers found
        if (bestSellers.isEmpty()) {
            bestSellers.add(new BestSellerDTO("No products sold yet", "₹0.00", 0));
        }

        dashboard.setBestSellers(bestSellers);

        // 7. Low Stock Products
        List<Product> allProducts = productRepository.findByUserId(userId);
        List<LowStockProductDTO> lowStockProducts = allProducts.stream()
                .filter(p -> p.getQuantity() != null && p.getQuantityAlert() != null && p.getQuantity() <= p.getQuantityAlert())
                .sorted(Comparator.comparingInt(Product::getQuantity))
                .limit(5)
                .map(p -> new LowStockProductDTO(p.getName(), p.getSku(), Math.max(0, p.getQuantity())))
                .collect(Collectors.toList());

        if (lowStockProducts.isEmpty()) {
            lowStockProducts.add(new LowStockProductDTO("All stocks are healthy", "N/A", 0));
        }

        dashboard.setLowStockProducts(lowStockProducts);

        return dashboard;
    }
}
