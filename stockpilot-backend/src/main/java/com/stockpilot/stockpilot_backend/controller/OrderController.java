package com.stockpilot.stockpilot_backend.controller;

import com.stockpilot.stockpilot_backend.entity.Order;
import com.stockpilot.stockpilot_backend.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepo;

    public OrderController(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    @GetMapping
    public List<Map<String, Object>> getOrders() {
        return orderRepo.findAllWithSupplier().stream().map(o -> {
            Map<String, Object> map = new java.util.LinkedHashMap<>();
            map.put("id", o.getId());
            map.put("orderNumber", o.getOrderNumber());
            map.put("supplier", o.getSupplier() != null ? o.getSupplier().getName() : "—");
            map.put("status", o.getStatus());
            map.put("total", o.getTotal());
            map.put("itemCount", o.getItemCount());
            map.put("expectedDate", o.getExpectedDate() != null ? o.getExpectedDate().toString() : null);
            map.put("createdAt", o.getCreatedAt() != null ? o.getCreatedAt().toString() : null);
            return map;
        }).collect(Collectors.toList());
    }
}