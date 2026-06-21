package com.stockpilot.stockpilot_backend.repository;

import com.stockpilot.stockpilot_backend.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {}