package smartmeal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import smartmeal.entity.MealBooking;

public interface MealBookingRepository extends JpaRepository<MealBooking, Long> {

    boolean existsByResidentIdAndMenuId(Long residentId, Long menuId);
}