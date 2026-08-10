package com.example.otpauth.service;

import com.example.otpauth.dto.ProductRequest;
import com.example.otpauth.model.Product;
import com.example.otpauth.repository.ProductRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final com.example.otpauth.repository.UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ProductService(ProductRepository productRepository, com.example.otpauth.repository.UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    /** List all products */
    public List<Product> getAllProducts() {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return productRepository.findAll();
        }
        return productRepository.findByUserId(userId);
    }

    /** List expired products */
    public List<Product> getExpiredProducts() {
        return productRepository.findByExpiryDateBeforeAndUserId(LocalDate.now(), com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    /** Search products by name or barcode */
    public List<com.example.otpauth.dto.ProductSearchDTO> searchProducts(String query) {
        List<Product> products = productRepository.searchProductsByUserId(query, com.example.otpauth.util.SecurityUtils.getCurrentUserId());
        List<com.example.otpauth.dto.ProductSearchDTO> results = new java.util.ArrayList<>();
        String lowerQuery = query != null ? query.toLowerCase() : "";

        for (Product p : products) {
            if (!"Variable Product".equals(p.getProductType())) {
                com.example.otpauth.dto.ProductSearchDTO dto = new com.example.otpauth.dto.ProductSearchDTO();
                dto.setId(p.getId());
                dto.setName(p.getName());
                dto.setSku(p.getSku());
                dto.setItemBarcode(p.getItemBarcode());
                dto.setCategory(p.getCategory());
                dto.setPurchasePrice(p.getPurchasePrice());
                dto.setPrice(p.getPrice());
                dto.setQuantity(p.getQuantity());
                dto.setImages(p.getImages());
                dto.setProductType(p.getProductType());
                results.add(dto);
            } else {
                List<Object> variantTypes = p.getVariantsParsed();
                for (Object vtObj : variantTypes) {
                    if (vtObj instanceof java.util.Map) {
                        java.util.Map<?, ?> vtMap = (java.util.Map<?, ?>) vtObj;
                        Object valuesObj = vtMap.get("values");
                        if (valuesObj instanceof java.util.List) {
                            java.util.List<?> valuesList = (java.util.List<?>) valuesObj;
                            for (Object valObj : valuesList) {
                                if (valObj instanceof java.util.Map) {
                                    java.util.Map<?, ?> vMap = (java.util.Map<?, ?>) valObj;
                                    String vSku = (String) vMap.get("sku");
                                    String vBarcode = (String) vMap.get("barcode");
                                    String vValue = (String) vMap.get("value");
                                    
                                    boolean variantMatches = (vSku != null && vSku.toLowerCase().contains(lowerQuery)) ||
                                                             (vBarcode != null && vBarcode.toLowerCase().contains(lowerQuery)) ||
                                                             (p.getName() != null && p.getName().toLowerCase().contains(lowerQuery));

                                    if (variantMatches) {
                                        com.example.otpauth.dto.ProductSearchDTO dto = new com.example.otpauth.dto.ProductSearchDTO();
                                        dto.setId(p.getId());
                                        dto.setName(p.getName() + " (" + vValue + ")");
                                        dto.setSku(vSku);
                                        dto.setItemBarcode(vBarcode);
                                        dto.setCategory(p.getCategory());
                                        
                                        Object pPrice = vMap.get("price");
                                        if (pPrice instanceof Number) {
                                            dto.setPrice(new java.math.BigDecimal(pPrice.toString()));
                                        } else if (pPrice instanceof String) {
                                            try { dto.setPrice(new java.math.BigDecimal((String) pPrice)); } catch (Exception e) { dto.setPrice(java.math.BigDecimal.ZERO); }
                                        } else {
                                            dto.setPrice(java.math.BigDecimal.ZERO);
                                        }
                                        
                                        Object pQty = vMap.get("quantity");
                                        if (pQty instanceof Number) {
                                            dto.setQuantity(((Number) pQty).intValue());
                                        } else if (pQty instanceof String) {
                                            try { dto.setQuantity(Integer.parseInt((String) pQty)); } catch (Exception e) { dto.setQuantity(0); }
                                        } else {
                                            dto.setQuantity(0);
                                        }

                                        String vImg = (String) vMap.get("image");
                                        dto.setImages((vImg != null && !vImg.trim().isEmpty()) ? vImg : p.getImages());
                                        dto.setProductType(p.getProductType());
                                        
                                        results.add(dto);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return results;
    }


    /** Get single product */
    public Optional<Product> getProductById(@NonNull Long id) {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return productRepository.findById(id);
        }
        return productRepository.findByIdAndUserId(Objects.requireNonNull(id), userId);
    }

    /** Create a new product */
    public Product createProduct(ProductRequest req) {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        
        com.example.otpauth.model.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (com.example.otpauth.model.SubscriptionPlan.STARTER.equals(user.getPlan())) {
            long currentProductCount = productRepository.countByUserId(userId);
            if (currentProductCount >= 1000) {
                throw new RuntimeException("Product limit reached for STARTER plan. Upgrade to add more products.");
            }
        }

        Product p = new Product();
        p.setUserId(userId);
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
        return productRepository.findByIdAndUserId(safeId, com.example.otpauth.util.SecurityUtils.getCurrentUserId()).map(p -> {
            mapRequestToProduct(req, p);
            return productRepository.save(p);   // Spring Data save never returns null
        });
    }

    /** Delete a product */
    public boolean deleteProduct(@NonNull Long id) {
        if (productRepository.existsByIdAndUserId(Objects.requireNonNull(id), com.example.otpauth.util.SecurityUtils.getCurrentUserId())) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }


    public void bulkDeleteProducts(List<Long> ids) {
        if (ids != null && !ids.isEmpty()) {
            Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
            List<Product> products = productRepository.findAllById(ids);
            products.removeIf(p -> !p.getUserId().equals(userId));
            productRepository.deleteAll(products);
        }
    }

    /** Generate a new unique SKU */
    public String generateSku() {
        String sku;
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        do {
            sku = "SKU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (productRepository.existsBySkuAndUserId(sku, userId));
        return sku;
    }

    /** Generate a new unique barcode */
    public String generateBarcode() {
        return String.valueOf((long) (Math.random() * 9_000_000_000_000L) + 1_000_000_000_000L);
    }

    /** Import products from a CSV file */
    public List<Product> importProductsFromCsv(org.springframework.web.multipart.MultipartFile file) throws Exception {
        List<Product> importedProducts = new java.util.ArrayList<>();
        try (java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(file.getInputStream()))) {
            String headerLine = reader.readLine();
            if (headerLine == null) {
                throw new IllegalArgumentException("CSV file is empty");
            }
            
            // Parse headers
            String[] headers = headerLine.split(",");
            for (int i = 0; i < headers.length; i++) {
                headers[i] = headers[i].trim().toLowerCase().replaceAll("\"", "");
            }
            
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                
                // Parse line (handling quotes optionally, split on commas not inside quotes)
                String[] columns = line.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");
                ProductRequest req = new ProductRequest();
                
                for (int i = 0; i < Math.min(headers.length, columns.length); i++) {
                    String val = columns[i].trim().replaceAll("^\"|\"$", "");
                    if (val.isEmpty()) continue;
                    
                    String header = headers[i];
                    if (header.equals("name") || header.equals("product name") || header.equals("product_name")) {
                        req.setName(val);
                    } else if (header.equals("sku")) {
                        req.setSku(val);
                    } else if (header.equals("slug")) {
                        req.setSlug(val);
                    } else if (header.equals("description")) {
                        req.setDescription(val);
                    } else if (header.equals("store")) {
                        req.setStore(val);
                    } else if (header.equals("warehouse")) {
                        req.setWarehouse(val);
                    } else if (header.equals("sellingtype") || header.equals("selling_type") || header.equals("selling type")) {
                        req.setSellingType(val);
                    } else if (header.equals("category")) {
                        req.setCategory(val);
                    } else if (header.equals("subcategory") || header.equals("sub_category") || header.equals("sub category")) {
                        req.setSubCategory(val);
                    } else if (header.equals("brand")) {
                        req.setBrand(val);
                    } else if (header.equals("unit")) {
                        req.setUnit(val);
                    } else if (header.equals("barcodesymbology") || header.equals("barcode_symbology") || header.equals("barcode symbology")) {
                        req.setBarcodeSymbology(val);
                    } else if (header.equals("itembarcode") || header.equals("item_barcode") || header.equals("item barcode") || header.equals("barcode")) {
                        req.setItemBarcode(val);
                    } else if (header.equals("quantity") || header.equals("qty") || header.equals("stock")) {
                        try {
                            req.setQuantity(Integer.parseInt(val));
                        } catch (NumberFormatException ignored) {}
                    } else if (header.equals("purchaseprice") || header.equals("purchase_price") || header.equals("purchase price")) {
                        try {
                            req.setPurchasePrice(new java.math.BigDecimal(val));
                        } catch (NumberFormatException ignored) {}
                    } else if (header.equals("price") || header.equals("selling price") || header.equals("selling_price") || header.equals("rate")) {
                        try {
                            req.setPrice(new java.math.BigDecimal(val));
                        } catch (NumberFormatException ignored) {}
                    } else if (header.equals("producttype") || header.equals("product_type") || header.equals("product type")) {
                        req.setProductType(val);
                    } else if (header.equals("taxtype") || header.equals("tax_type") || header.equals("tax type")) {
                        req.setTaxType(val);
                    } else if (header.equals("tax")) {
                        req.setTax(val);
                    } else if (header.equals("discounttype") || header.equals("discount_type") || header.equals("discount type")) {
                        req.setDiscountType(val);
                    } else if (header.equals("discountvalue") || header.equals("discount_value") || header.equals("discount value")) {
                        try {
                            req.setDiscountValue(new java.math.BigDecimal(val));
                        } catch (NumberFormatException ignored) {}
                    } else if (header.equals("quantityalert") || header.equals("quantity_alert") || header.equals("quantity alert") || header.equals("alert quantity") || header.equals("alert_qty")) {
                        try {
                            req.setQuantityAlert(Integer.parseInt(val));
                        } catch (NumberFormatException ignored) {}
                    } else if (header.equals("warranty")) {
                        req.setWarranty(val);
                    } else if (header.equals("manufacturer")) {
                        req.setManufacturer(val);
                    } else if (header.equals("manufactureddate") || header.equals("manufactured_date") || header.equals("manufactured date")) {
                        req.setManufacturedDate(val);
                    } else if (header.equals("expirydate") || header.equals("expiry_date") || header.equals("expiry date")) {
                        req.setExpiryDate(val);
                    } else if (header.equals("images") || header.equals("image") || header.equals("image_url") || header.equals("image url")) {
                        req.setImages(val);
                    }
                }
                
                if (req.getName() != null && !req.getName().isBlank()) {
                    if (req.getPrice() == null) {
                        req.setPrice(java.math.BigDecimal.ZERO);
                    }
                    if (req.getQuantity() == null) {
                        req.setQuantity(0);
                    }
                    Product p = createProduct(req);
                    importedProducts.add(p);
                }
            }
        }
        return importedProducts;
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
        if (req.getPurchasePrice()    != null) p.setPurchasePrice(req.getPurchasePrice());
        if (req.getPrice()            != null) p.setPrice(req.getPrice());
        if (req.getProductType()      != null) p.setProductType(req.getProductType());
        if (req.getItemType()         != null) p.setItemType(req.getItemType());
        if (req.getTaxType()          != null) p.setTaxType(req.getTaxType());
        if (req.getTax()              != null) p.setTax(req.getTax());
        if (req.getDiscountType()     != null) p.setDiscountType(req.getDiscountType());
        if (req.getDiscountValue()    != null) p.setDiscountValue(req.getDiscountValue());
        if (req.getQuantityAlert()    != null) p.setQuantityAlert(req.getQuantityAlert());
        if (req.getWarranty()         != null) p.setWarranty(req.getWarranty());
        if (req.getManufacturer()     != null) p.setManufacturer(req.getManufacturer());
        if (req.getImages()           != null) p.setImages(req.getImages());

        // Serialize variants list to JSON string
        if (req.getVariants() != null) {
            try {
                p.setVariantsJson(objectMapper.writeValueAsString(req.getVariants()));
            } catch (JsonProcessingException e) {
                // If serialization fails, store as empty array
                p.setVariantsJson("[]");
            }
        }

        if (req.getManufacturedDate() != null && !req.getManufacturedDate().isBlank()) {
            p.setManufacturedDate(LocalDate.parse(req.getManufacturedDate()));
        }
        if (req.getExpiryDate() != null && !req.getExpiryDate().isBlank()) {
            p.setExpiryDate(LocalDate.parse(req.getExpiryDate()));
        }
    }
}
