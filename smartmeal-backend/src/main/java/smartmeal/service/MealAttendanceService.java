package smartmeal.service;

import org.springframework.stereotype.Service;
import smartmeal.entity.MealAttendance;
import smartmeal.exception.ResourceNotFoundException;
import smartmeal.repository.MealAttendanceRepository;
import smartmeal.repository.MealBookingRepository;

import java.util.List;

@Service
public class MealAttendanceService {

    private final MealAttendanceRepository mealAttendanceRepository;
    private final MealBookingRepository mealBookingRepository;

   public MealAttendanceService(
        MealAttendanceRepository mealAttendanceRepository,
        MealBookingRepository mealBookingRepository) {

    this.mealAttendanceRepository = mealAttendanceRepository;
    this.mealBookingRepository = mealBookingRepository;
}

    // GET all attendance records
    public List<MealAttendance> getAllAttendance() {
        return mealAttendanceRepository.findAll();
    }

// GET attendance by ID
    public MealAttendance getAttendanceById(Long id) {
    return mealAttendanceRepository.findById(id).orElseThrow(
        () -> new ResourceNotFoundException("Meal attendance not found with id: " + id));
}
// POST - add attendance
    public MealAttendance addAttendance(MealAttendance attendance) {

    // Check booking exists
    if (!mealBookingRepository.existsById(attendance.getBookingId())) {
        throw new ResourceNotFoundException(
                "Meal booking not found with id: " + attendance.getBookingId()
        );
    }

    // Prevent duplicate attendance
    if (mealAttendanceRepository.existsByBookingId(
            attendance.getBookingId())) {

        throw new IllegalArgumentException(
                "Attendance already exists for booking id: "
                        + attendance.getBookingId()
        );
    }
    // Check Attendance Status
if (!attendance.getAttendanceStatus().equals("SERVED")
        && !attendance.getAttendanceStatus().equals("NOT_SERVED")) {

    throw new IllegalArgumentException(
            "Attendance status must be SERVED or NOT_SERVED"
    );
}

    return mealAttendanceRepository.save(attendance);
}
    // PUT - update attendance
    public MealAttendance updateAttendance(
            Long id,
            MealAttendance updatedAttendance) {

        MealAttendance existingAttendance =
                mealAttendanceRepository.findById(id).orElse(null);

        if (existingAttendance == null) {
    throw new ResourceNotFoundException(
            "Meal attendance not found with id: " + id
    );
}

        existingAttendance.setBookingId(updatedAttendance.getBookingId());
        existingAttendance.setAttendanceStatus(
                updatedAttendance.getAttendanceStatus());

        return mealAttendanceRepository.save(existingAttendance);
    }

    // DELETE - delete attendance
    public void deleteAttendance(Long id) {

    if (!mealAttendanceRepository.existsById(id)) {
        throw new ResourceNotFoundException(
                "Meal attendance not found with id: " + id
        );
    }

    mealAttendanceRepository.deleteById(id);
}
}