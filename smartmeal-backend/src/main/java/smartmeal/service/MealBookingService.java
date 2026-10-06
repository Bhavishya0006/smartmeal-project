package smartmeal.service;

import org.springframework.stereotype.Service;
import smartmeal.entity.MealBooking;
import smartmeal.exception.ResourceNotFoundException;
import smartmeal.repository.MealBookingRepository;
import smartmeal.repository.ResidentRepository;
import smartmeal.repository.MenuRepository;

import java.util.List;

@Service
public class MealBookingService {

    private final MealBookingRepository mealBookingRepository;
    private final ResidentRepository residentRepository;
    private final MenuRepository menuRepository;

    public MealBookingService(
        MealBookingRepository mealBookingRepository,
        ResidentRepository residentRepository,
        MenuRepository menuRepository) {

    this.mealBookingRepository = mealBookingRepository;
    this.residentRepository = residentRepository;
    this.menuRepository = menuRepository;
}

    // GET all bookings
    public List<MealBooking> getAllBookings() {
        return mealBookingRepository.findAll();
    }

    // GET booking by ID
    public MealBooking getBookingById(Long id) {
    return mealBookingRepository.findById(id).orElseThrow(
        () -> new ResourceNotFoundException("Meal booking not found with id: " + id));
}

    // POST - add booking
   public MealBooking addBooking(MealBooking booking) {
// check resident exist
    if (!residentRepository.existsById(booking.getResidentId())) {
        throw new ResourceNotFoundException(
                "Resident not found with id: " + booking.getResidentId()
        );
        
    }
// check menu exist
    if (!menuRepository.existsById(booking.getMenuId())) {
        throw new ResourceNotFoundException(
                "Menu not found with id: " + booking.getMenuId()
        );
    }

    // check booking status
    if (!booking.getBookingStatus().equals("YES")
        && !booking.getBookingStatus().equals("NO")) {

    throw new IllegalArgumentException(
            "Booking status must be YES or NO"
    );
}

// Check Duplicate Booking
if (mealBookingRepository.existsByResidentIdAndMenuId(
        booking.getResidentId(),
        booking.getMenuId())) {

    throw new IllegalArgumentException(
            "Resident has already booked this menu"
    );
}

    return mealBookingRepository.save(booking);
}

    // PUT - update booking
    public MealBooking updateBooking(Long id, MealBooking updatedBooking) {

        MealBooking existingBooking =
                mealBookingRepository.findById(id).orElse(null);

        if (existingBooking == null) {
    throw new ResourceNotFoundException(
            "Meal booking not found with id: " + id
    );
}

        existingBooking.setResidentId(updatedBooking.getResidentId());
        existingBooking.setMenuId(updatedBooking.getMenuId());
        existingBooking.setBookingStatus(updatedBooking.getBookingStatus());

        return mealBookingRepository.save(existingBooking);
    }

    // DELETE - delete booking
   public void deleteBooking(Long id) {

    if (!mealBookingRepository.existsById(id)) {
        throw new ResourceNotFoundException(
                "Meal booking not found with id: " + id
        );
    }

    mealBookingRepository.deleteById(id);
}
}