package com.stockpilot.stockpilot_backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private BigDecimal total;

    @Column(name = "item_count", nullable = false)
    private Integer itemCount;

    @Column(name = "expected_date")
    private LocalDate expectedDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public String getOrderNumber() { return orderNumber; }
    public Supplier getSupplier() { return supplier; }
    public String getStatus() { return status; }
    public BigDecimal getTotal() { return total; }
    public Integer getItemCount() { return itemCount; }
    public LocalDate getExpectedDate() { return expectedDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}