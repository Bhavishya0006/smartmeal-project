package smartmeal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import smartmeal.entity.MealAttendance;

public interface MealAttendanceRepository extends JpaRepository<MealAttendance, Long> {

    boolean existsByBookingId(Long bookingId);

}