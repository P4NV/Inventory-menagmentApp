package com.stockpilot.stockpilot_backend.controller;

import com.stockpilot.stockpilot_backend.dto.ProductDTO;
import com.stockpilot.stockpilot_backend.entity.Category;
import com.stockpilot.stockpilot_backend.entity.Product;
import com.stockpilot.stockpilot_backend.entity.Supplier;
import com.stockpilot.stockpilot_backend.repository.CategoryRepository;
import com.stockpilot.stockpilot_backend.repository.ProductRepository;
import com.stockpilot.stockpilot_backend.repository.SupplierRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository repo;
    private final CategoryRepository categoryRepo;
    private final SupplierRepository supplierRepo;

    public ProductController(ProductRepository repo,
                             CategoryRepository categoryRepo,
                             SupplierRepository supplierRepo) {
        this.repo = repo;
        this.categoryRepo = categoryRepo;
        this.supplierRepo = supplierRepo;
    }

    @GetMapping
    public List<ProductDTO> getProducts(@RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return repo.searchProducts(search).stream().map(ProductDTO::new).toList();
        }
        return repo.findAllWithDetails().stream().map(ProductDTO::new).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        return repo.findById(id)
                .map(p -> ResponseEntity.ok(new ProductDTO(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody Map<String, Object> body) {
        Product p = new Product();
        applyBody(p, body);
        return ResponseEntity.ok(new ProductDTO(repo.save(p)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id,
                                                    @RequestBody Map<String, Object> body) {
        return repo.findById(id).map(p -> {
            applyBody(p, body);
            return ResponseEntity.ok(new ProductDTO(repo.save(p)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void applyBody(Product p, Map<String, Object> body) {
        if (body.containsKey("sku"))          p.setSku((String) body.get("sku"));
        if (body.containsKey("name"))         p.setName((String) body.get("name"));
        if (body.containsKey("description"))  p.setDescription((String) body.get("description"));
        if (body.containsKey("unitPrice"))    p.setUnitPrice(new java.math.BigDecimal(body.get("unitPrice").toString()));
        if (body.containsKey("stockQty"))     p.setStockQty(((Number) body.get("stockQty")).longValue());
        if (body.containsKey("reorderLevel")) p.setReorderLevel(((Number) body.get("reorderLevel")).longValue());
        if (body.containsKey("categoryId")) {
            Long catId = ((Number) body.get("categoryId")).longValue();
            categoryRepo.findById(catId).ifPresent(p::setCategory);
        }
        if (body.containsKey("supplierId")) {
            Long supId = ((Number) body.get("supplierId")).longValue();
            supplierRepo.findById(supId).ifPresent(p::setSupplier);
        }
    }
}