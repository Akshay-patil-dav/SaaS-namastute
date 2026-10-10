package com.example.otpauth.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email"),
    @Index(name = "idx_user_plan",  columnList = "subscription_plan"),
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name")       private String fullName;
    @Column(name = "first_name")      private String firstName;
    @Column(name = "last_name")       private String lastName;
    @Column(name = "username", unique = true) private String username;
    @Column(name = "business_type")   private String businessType;
    @Column(name = "phone_number")    private String phoneNumber;
    @Column(name = "email_verified")  private Boolean emailVerified  = false;
    @Column(name = "phone_verified")  private Boolean phoneVerified  = false;
    @Column(name = "active_project_id") private Long activeProjectId;

    // ── Subscription ─────────────────────────────────────────────────────────

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_plan")
    private SubscriptionPlan plan = SubscriptionPlan.NONE;

    @Column(name = "subscription_end_date")
    private LocalDateTime subscriptionEndDate;

    // Queued plan — auto-promoted when current plan expires (lazy, on next login)
    @Enumerated(EnumType.STRING)
    @Column(name = "next_subscription_plan")
    private SubscriptionPlan nextPlan = null;

    // Stored as an absolute end-date, not days — survives clock drift / restarts
    @Column(name = "next_subscription_end_date")
    private LocalDateTime nextSubscriptionEndDate;

    // ── Roles ────────────────────────────────────────────────────────────────

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    // ── Constructors ─────────────────────────────────────────────────────────

    public User() {}

    public User(String email, String password, String fullName) {
        this.email    = email;
        this.password = password;
        this.fullName = fullName;
    }

    // ── Getters / Setters ────────────────────────────────────────────────────

    public Long getId()                     { return id; }
    public void setId(Long id)              { this.id = id; }

    public String getEmail()                { return email; }
    public void setEmail(String email)      { this.email = email; }

    public String getPassword()             { return password; }
    public void setPassword(String password){ this.password = password; }

    public String getFullName()             { return fullName; }
    public void setFullName(String v)       { this.fullName = v; }

    public String getFirstName()            { return firstName; }
    public void setFirstName(String v)      { this.firstName = v; }

    public String getLastName()             { return lastName; }
    public void setLastName(String v)       { this.lastName = v; }

    public String getUsername()             { return username; }
    public void setUsername(String v)       { this.username = v; }

    public String getBusinessType()         { return businessType; }
    public void setBusinessType(String v)   { this.businessType = v; }

    public String getPhoneNumber()          { return phoneNumber; }
    public void setPhoneNumber(String v)    { this.phoneNumber = v; }

    public Boolean isEmailVerified()        { return emailVerified != null && emailVerified; }
    public void setEmailVerified(Boolean v) { this.emailVerified = v; }

    public Boolean isPhoneVerified()        { return phoneVerified != null && phoneVerified; }
    public void setPhoneVerified(Boolean v) { this.phoneVerified = v; }

    public Long getActiveProjectId()        { return activeProjectId; }
    public void setActiveProjectId(Long v)  { this.activeProjectId = v; }

    public Set<Role> getRoles()             { return roles; }
    public void setRoles(Set<Role> roles)   { this.roles = roles; }

    public SubscriptionPlan getPlan()       { return plan; }
    public void setPlan(SubscriptionPlan p) { this.plan = p; }

    public LocalDateTime getSubscriptionEndDate()            { return subscriptionEndDate; }
    public void setSubscriptionEndDate(LocalDateTime v)      { this.subscriptionEndDate = v; }

    public SubscriptionPlan getNextPlan()                    { return nextPlan; }
    public void setNextPlan(SubscriptionPlan p)              { this.nextPlan = p; }

    public LocalDateTime getNextSubscriptionEndDate()        { return nextSubscriptionEndDate; }
    public void setNextSubscriptionEndDate(LocalDateTime v)  { this.nextSubscriptionEndDate = v; }

    /** Derived — exact days queued for the upcoming plan. */
    public Integer getNextSubscriptionDays() {
        if (nextSubscriptionEndDate == null) return 0;
        LocalDateTime start = (subscriptionEndDate != null && subscriptionEndDate.isAfter(LocalDateTime.now()))
                ? subscriptionEndDate
                : LocalDateTime.now();
        long days = java.time.temporal.ChronoUnit.DAYS.between(start, nextSubscriptionEndDate);
        return (int) Math.max(0, days);
    }
}
