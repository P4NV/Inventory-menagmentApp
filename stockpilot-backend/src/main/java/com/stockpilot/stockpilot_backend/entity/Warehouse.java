package com.stockpilot.stockpilot_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "warehouses")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    private String location;
    private String manager;

    @Column(nullable = false)
    private Integer capacity;

    public Long getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }
    public String getLocation() { return location; }
    public String getManager() { return manager; }
    public Integer getCapacity() { return capacity; }
}