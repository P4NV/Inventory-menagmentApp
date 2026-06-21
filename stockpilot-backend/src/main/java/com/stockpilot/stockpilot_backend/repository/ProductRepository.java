package com.stockpilot.stockpilot_backend.repository;

import com.stockpilot.stockpilot_backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
        SELECT p FROM Product p
        LEFT JOIN FETCH p.category
        LEFT JOIN FETCH p.supplier
        WHERE (:search IS NULL OR
               LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
               LOWER(p.sku)  LIKE LOWER(CONCAT('%', :search, '%')))
        ORDER BY p.name ASC
    """)
    List<Product> searchProducts(@Param("search") String search);

    @Query("""
        SELECT p FROM Product p
        LEFT JOIN FETCH p.category
        LEFT JOIN FETCH p.supplier
        ORDER BY p.name ASC
    """)
    List<Product> findAllWithDetails();
}