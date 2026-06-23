package com.stockpilot.stockpilot_backend.controller;

import com.stockpilot.stockpilot_backend.entity.Warehouse;
import com.stockpilot.stockpilot_backend.repository.ProductRepository;
import com.stockpilot.stockpilot_backend.repository.WarehouseRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/warehouses")
@CrossOrigin(origins = "*")
public class WarehouseController {

    private final WarehouseRepository warehouseRepo;
    private final ProductRepository productRepo;

    public WarehouseController(WarehouseRepository warehouseRepo, ProductRepository productRepo) {
        this.warehouseRepo = warehouseRepo;
        this.productRepo = productRepo;
    }

    @GetMapping
    public List<Map<String, Object>> getWarehouses() {
        var products = productRepo.findAllWithDetails();
        long totalStock = products.stream().mapToLong(p -> p.getStockQty()).sum();

        return warehouseRepo.findAll().stream().map(w -> {
            // Distribute stock evenly across warehouses for demo
            long whStock = switch (w.getCode()) {
                case "WH-01" -> products.stream()
                        .filter(p -> p.getSku().startsWith("ELEC") || p.getSku().startsWith("FURN"))
                        .mapToLong(p -> p.getStockQty()).sum();
                case "WH-02" -> products.stream()
                        .filter(p -> p.getSku().startsWith("OFF") || p.getSku().startsWith("TOOL"))
                        .mapToLong(p -> p.getStockQty()).sum();
                default -> products.stream()
                        .filter(p -> p.getSku().startsWith("CLTH"))
                        .mapToLong(p -> p.getStockQty()).sum();
            };

            int capacityPct = (int) Math.min(100, (whStock * 100) / Math.max(1, w.getCapacity()));

            return Map.<String, Object>of(
                    "id", w.getId(),
                    "code", w.getCode(),
                    "name", w.getName(),
                    "location", w.getLocation() != null ? w.getLocation() : "",
                    "manager", w.getManager() != null ? w.getManager() : "",
                    "capacity", w.getCapacity(),
                    "skusStored", whStock,
                    "capacityPct", capacityPct
            );
        }).collect(Collectors.toList());
    }
}