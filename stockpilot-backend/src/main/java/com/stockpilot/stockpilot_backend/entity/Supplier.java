package com.stockpilot.stockpilot_backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "contact_email")
    private String contactEmail;

    private String phone;
    private String country;
    private BigDecimal rating;

    @Column(name = "lead_time_days")
    private Integer leadTimeDays;

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getContactEmail() { return contactEmail; }
    public String getPhone() { return phone; }
    public String getCountry() { return country; }
    public BigDecimal getRating() { return rating; }
    public Integer getLeadTimeDays() { return leadTimeDays; }
}