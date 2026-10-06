package smartmeal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "food_waste")
public class FoodWaste {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "menu_id", nullable = false)
    private Long menuId;

    @NotNull
    @Min(0)
    @Column(name = "prepared_meals", nullable = false)
    private Integer preparedMeals;

    @NotNull
    @Min(0)
    @Column(name = "served_meals", nullable = false)
    private Integer servedMeals;

    @NotNull
    @Min(0)
    @Column(name = "leftover_meals", nullable = false)
    private Integer leftoverMeals;

    @Size(max = 255)
    @Column(name = "waste_reason", length = 255)
    private String wasteReason;

    @CreationTimestamp
    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    public FoodWaste() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMenuId() {
        return menuId;
    }

    public void setMenuId(Long menuId) {
        this.menuId = menuId;
    }

    public Integer getPreparedMeals() {
        return preparedMeals;
    }

    public void setPreparedMeals(Integer preparedMeals) {
        this.preparedMeals = preparedMeals;
    }

    public Integer getServedMeals() {
        return servedMeals;
    }

    public void setServedMeals(Integer servedMeals) {
        this.servedMeals = servedMeals;
    }

    public Integer getLeftoverMeals() {
        return leftoverMeals;
    }

    public void setLeftoverMeals(Integer leftoverMeals) {
        this.leftoverMeals = leftoverMeals;
    }

    public String getWasteReason() {
        return wasteReason;
    }

    public void setWasteReason(String wasteReason) {
        this.wasteReason = wasteReason;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}