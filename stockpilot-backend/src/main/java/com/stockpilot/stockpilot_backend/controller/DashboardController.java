package com.stockpilot.stockpilot_backend.controller;

import com.stockpilot.stockpilot_backend.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final ProductRepository repo;

    public DashboardController(ProductRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        var products = repo.findAllWithDetails();

        long totalProducts = products.size();
        long lowStockCount = products.stream().filter(p -> p.getStockQty() <= p.getReorderLevel()).count();
        BigDecimal totalValue = products.stream()
                .map(p -> p.getUnitPrice().multiply(BigDecimal.valueOf(p.getStockQty())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Stock by category
        Map<String, Long> stockByCategory = products.stream()
                .filter(p -> p.getCategory() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getCategory().getName(),
                        Collectors.summingLong(p -> p.getStockQty())
                ));

        // Product count by category
        Map<String, Long> countByCategory = products.stream()
                .filter(p -> p.getCategory() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getCategory().getName(),
                        Collectors.counting()
                ));

        // Low stock items
        List<Map<String, Object>> lowStockItems = products.stream()
                .filter(p -> p.getStockQty() <= p.getReorderLevel())
                .map(p -> Map.<String, Object>of(
                        "name", p.getName(),
                        "sku", p.getSku(),
                        "stockQty", p.getStockQty(),
                        "reorderLevel", p.getReorderLevel()
                ))
                .collect(Collectors.toList());

        return Map.of(
                "totalProducts", totalProducts,
                "lowStockCount", lowStockCount,
                "totalValue", totalValue,
                "stockByCategory", stockByCategory,
                "countByCategory", countByCategory,
                "lowStockItems", lowStockItems
        );
    }
}