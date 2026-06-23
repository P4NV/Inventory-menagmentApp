package com.stockpilot.stockpilot_backend.repository;

import com.stockpilot.stockpilot_backend.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {}