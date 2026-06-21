package com.stockpilot.stockpilot_backend.dto;

import com.stockpilot.stockpilot_backend.entity.Product;
import java.math.BigDecimal;

public class ProductDTO {

    private final Long id;
    private final String sku;
    private final String name;
    private final String description;
    private final String category;
    private final String supplier;
    private final BigDecimal unitPrice;
    private final Long stockQty;
    private final Long reorderLevel;
    private final boolean needsReorder;

    public ProductDTO(Product p) {
        this.id           = p.getId();
        this.sku          = p.getSku();
        this.name         = p.getName();
        this.description  = p.getDescription();
        this.category     = p.getCategory() != null ? p.getCategory().getName() : null;
        this.supplier     = p.getSupplier() != null ? p.getSupplier().getName() : null;
        this.unitPrice    = p.getUnitPrice();
        this.stockQty     = p.getStockQty();
        this.reorderLevel = p.getReorderLevel();
        this.needsReorder = p.getStockQty() <= p.getReorderLevel();
    }

    public Long getId() { return id; }
    public String getSku() { return sku; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getSupplier() { return supplier; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public Long getStockQty() { return stockQty; }
    public Long getReorderLevel() { return reorderLevel; }
    public boolean isNeedsReorder() { return needsReorder; }
}