package smartmeal.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import smartmeal.entity.MealAttendance;
import smartmeal.service.MealAttendanceService;
import jakarta.validation.Valid;

import java.util.List;

@RestController
public class MealAttendanceController {

    private final MealAttendanceService mealAttendanceService;

    public MealAttendanceController(
            MealAttendanceService mealAttendanceService) {
        this.mealAttendanceService = mealAttendanceService;
    }

    // GET all attendance records
    @GetMapping("/meal-attendance")
    public List<MealAttendance> getAllAttendance() {
        return mealAttendanceService.getAllAttendance();
    }

    // GET attendance by ID
    @GetMapping("/meal-attendance/{id}")
    public MealAttendance getAttendanceById(@PathVariable Long id) {
        return mealAttendanceService.getAttendanceById(id);
    }

    // POST - add attendance
    @PostMapping("/meal-attendance")
    public MealAttendance addAttendance(@Valid @RequestBody MealAttendance attendance) {
        return mealAttendanceService.addAttendance(attendance);
    }

    // PUT - update attendance
    @PutMapping("/meal-attendance/{id}")
    public MealAttendance updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody MealAttendance attendance) {

        return mealAttendanceService.updateAttendance(id, attendance);
    }

    // DELETE - delete attendance
    @DeleteMapping("/meal-attendance/{id}")
    public void deleteAttendance(@PathVariable Long id) {
        mealAttendanceService.deleteAttendance(id);
    }
}