package smartmeal.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import smartmeal.entity.MealBooking;
import smartmeal.service.MealBookingService;
import jakarta.validation.Valid;

import java.util.List;

@RestController
public class MealBookingController {

    private final MealBookingService mealBookingService;

    public MealBookingController(MealBookingService mealBookingService) {
        this.mealBookingService = mealBookingService;
    }

    // GET all bookings
    @GetMapping("/meal-bookings")
    public List<MealBooking> getAllBookings() {
        return mealBookingService.getAllBookings();
    }

    // GET booking by ID
    @GetMapping("/meal-bookings/{id}")
    public MealBooking getBookingById(@PathVariable Long id) {
        return mealBookingService.getBookingById(id);
    }

    // POST - add booking
    @PostMapping("/meal-bookings")
    public MealBooking addBooking(@Valid @RequestBody MealBooking booking) {
        return mealBookingService.addBooking(booking);
    }

    // PUT - update booking
    @PutMapping("/meal-bookings/{id}")
    public MealBooking updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody MealBooking booking) {

        return mealBookingService.updateBooking(id, booking);
    }

    // DELETE - delete booking
    @DeleteMapping("/meal-bookings/{id}")
    public void deleteBooking(@PathVariable Long id) {
        mealBookingService.deleteBooking(id);
    }
}