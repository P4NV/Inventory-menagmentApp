package com.stockpilot.stockpilot_backend.repository;

import com.stockpilot.stockpilot_backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.supplier ORDER BY o.createdAt DESC")
    List<Order> findAllWithSupplier();
}