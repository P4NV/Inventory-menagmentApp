package com.stockpilot.stockpilot_backend.controller;

import com.stockpilot.stockpilot_backend.entity.Supplier;
import com.stockpilot.stockpilot_backend.repository.OrderRepository;
import com.stockpilot.stockpilot_backend.repository.SupplierRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {

    private final SupplierRepository supplierRepo;
    private final OrderRepository orderRepo;

    public SupplierController(SupplierRepository supplierRepo, OrderRepository orderRepo) {
        this.supplierRepo = supplierRepo;
        this.orderRepo = orderRepo;
    }

    @GetMapping
    public List<Map<String, Object>> getSuppliers() {
        var allOrders = orderRepo.findAllWithSupplier();
        var activeStatuses = List.of("Open", "In Transit");

        return supplierRepo.findAll().stream().map(s -> {
            long activeOrders = allOrders.stream()
                    .filter(o -> o.getSupplier() != null
                            && o.getSupplier().getId().equals(s.getId())
                            && activeStatuses.contains(o.getStatus()))
                    .count();

            Map<String, Object> map = new java.util.LinkedHashMap<>();
            map.put("id", s.getId());
            map.put("name", s.getName());
            map.put("contactEmail", s.getContactEmail() != null ? s.getContactEmail() : "");
            map.put("country", s.getCountry() != null ? s.getCountry() : "");
            map.put("rating", s.getRating());
            map.put("leadTimeDays", s.getLeadTimeDays());
            map.put("activeOrders", activeOrders);
            return map;
        }).collect(Collectors.toList());
    }
}