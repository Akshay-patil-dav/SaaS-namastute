package com.example.otpauth.service;

import com.example.otpauth.dto.ProductRequest;
import com.example.otpauth.model.Product;
import com.example.otpauth.repository.ProductRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@SuppressWarnings("null")   // Spring Data's save() / findById() are guaranteed non-null at runtime
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /** List all products */
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /** Get single product */
    public Optional<Product> getProductById(@NonNull Long id) {
        return productRepository.findById(Objects.requireNonNull(id));
    }

    /** Create a new product */
    public Product createProduct(ProductRequest req) {
        Product p = new Product();
        mapRequestToProduct(req, p);

        // Auto-generate SKU if blank
        if (p.getSku() == null || p.getSku().isBlank()) {
            p.setSku("SKU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        // Auto-generate slug if blank
        if (p.getSlug() == null || p.getSlug().isBlank()) {
            String name = p.getName() != null ? p.getName() : "product";
            p.setSlug(name.toLowerCase().replaceAll("\\s+", "-").replaceAll("[^a-z0-9-]", ""));
        }

        return Objects.requireNonNull(productRepository.save(p));
    }

    /** Update an existing product */
    public Optional<Product> updateProduct(@NonNull Long id, ProductRequest req) {
        long safeId = Objects.requireNonNull(id);
        return productRepository.findById(safeId).map(p -> {
            mapRequestToProduct(req, p);
            return productRepository.save(p);   // Spring Data save never returns null
        });
    }

    /** Delete a product */
    public boolean deleteProduct(@NonNull Long id) {
        long safeId = Objects.requireNonNull(id);
        if (productRepository.existsById(safeId)) {
            productRepository.deleteById(safeId);
            return true;
        }
        return false;
    }

    /** Generate a new unique SKU */
    public String generateSku() {
        String sku;
        do {
            sku = "SKU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (productRepository.existsBySku(sku));
        return sku;
    }

    /** Generate a new unique barcode */
    public String generateBarcode() {
        return String.valueOf((long) (Math.random() * 9_000_000_000_000L) + 1_000_000_000_000L);
    }

    // ── Private helper ────────────────────────────────────────────────────────
    private void mapRequestToProduct(ProductRequest req, Product p) {
        if (req.getName()             != null) p.setName(req.getName());
        if (req.getSlug()             != null) p.setSlug(req.getSlug());
        if (req.getSku()              != null) p.setSku(req.getSku());
        if (req.getDescription()      != null) p.setDescription(req.getDescription());
        if (req.getStore()            != null) p.setStore(req.getStore());
        if (req.getWarehouse()        != null) p.setWarehouse(req.getWarehouse());
        if (req.getSellingType()      != null) p.setSellingType(req.getSellingType());
        if (req.getCategory()         != null) p.setCategory(req.getCategory());
        if (req.getSubCategory()      != null) p.setSubCategory(req.getSubCategory());
        if (req.getBrand()            != null) p.setBrand(req.getBrand());
        if (req.getUnit()             != null) p.setUnit(req.getUnit());
        if (req.getBarcodeSymbology() != null) p.setBarcodeSymbology(req.getBarcodeSymbology());
        if (req.getItemBarcode()      != null) p.setItemBarcode(req.getItemBarcode());
        if (req.getQuantity()         != null) p.setQuantity(req.getQuantity());
        if (req.getPrice()            != null) p.setPrice(req.getPrice());
        if (req.getProductType()      != null) p.setProductType(req.getProductType());
        if (req.getTaxType()          != null) p.setTaxType(req.getTaxType());
        if (req.getTax()              != null) p.setTax(req.getTax());
        if (req.getDiscountType()     != null) p.setDiscountType(req.getDiscountType());
        if (req.getDiscountValue()    != null) p.setDiscountValue(req.getDiscountValue());
        if (req.getQuantityAlert()    != null) p.setQuantityAlert(req.getQuantityAlert());
        if (req.getWarranty()         != null) p.setWarranty(req.getWarranty());
        if (req.getManufacturer()     != null) p.setManufacturer(req.getManufacturer());
        if (req.getImages()           != null) p.setImages(req.getImages());

        if (req.getManufacturedDate() != null && !req.getManufacturedDate().isBlank()) {
            p.setManufacturedDate(LocalDate.parse(req.getManufacturedDate()));
        }
        if (req.getExpiryDate() != null && !req.getExpiryDate().isBlank()) {
            p.setExpiryDate(LocalDate.parse(req.getExpiryDate()));
        }
    }
}
