package smartmeal.service;

import org.springframework.stereotype.Service;
import smartmeal.entity.Resident;
import smartmeal.entity.Room;
import smartmeal.repository.ResidentRepository;
import smartmeal.repository.RoomRepository;
import smartmeal.repository.UserRepository;
import smartmeal.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class ResidentService {

    private final ResidentRepository residentRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

   public ResidentService(
        ResidentRepository residentRepository,
        UserRepository userRepository,
        RoomRepository roomRepository) {

    this.residentRepository = residentRepository;
    this.userRepository = userRepository;
    this.roomRepository = roomRepository;
}

// get 
    public List<Resident> getAllResidents() {
        return residentRepository.findAll();
    }

    // get [id]
    public Resident getResidentById(Long id) {
    return residentRepository.findById(id).orElseThrow(
        () -> new ResourceNotFoundException("Resident not found with id: " + id));
}

// post add
public Resident addResident(Resident resident) {

    // Check if User is already assigned to a Resident
if (residentRepository.existsByUserId(resident.getUserId())) {
    throw new IllegalArgumentException(
            "User is already assigned to a resident"
    );
}

    // Check User
    if (!userRepository.existsById(resident.getUserId())) {
        throw new ResourceNotFoundException(
                "User not found with id: " + resident.getUserId()
        );
    }

    // Check Room if roomId is provided
    if (resident.getRoomId() != null &&
            !roomRepository.existsById(resident.getRoomId())) {

        throw new ResourceNotFoundException(
                "Room not found with id: " + resident.getRoomId()
        );
    }

    // Check Room Capacity
    if (resident.getRoomId() != null) {

        Room room = roomRepository.findById(resident.getRoomId()).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Room not found with id: " + resident.getRoomId()
                )
        );

        long currentResidents =
                residentRepository.countByRoomId(resident.getRoomId());

        if (currentResidents >= room.getCapacity()) {
            throw new IllegalArgumentException(
                    "Room " + room.getRoomNumber() + " is already full"
            );
        }
    }
    // Check Resident Status
if (!resident.getStatus().equals("ACTIVE")
        && !resident.getStatus().equals("INACTIVE")) {

    throw new IllegalArgumentException(
            "Resident status must be ACTIVE or INACTIVE"
    );
}

    return residentRepository.save(resident);
}
// delete 
public void deleteResident(Long id) {

    if (!residentRepository.existsById(id)) {
        throw new ResourceNotFoundException(
                "Resident not found with id: " + id
        );
    }

    residentRepository.deleteById(id);
}
//put update
public Resident updateResident(Long id, Resident updatedResident) {
    Resident existingResident = residentRepository.findById(id).orElse(null);

    if (existingResident == null) {
    throw new ResourceNotFoundException("Resident not found with id: " + id);
}

    existingResident.setUserId(updatedResident.getUserId());
    existingResident.setResidentId(updatedResident.getResidentId());
    existingResident.setName(updatedResident.getName());
    existingResident.setEmail(updatedResident.getEmail());
    existingResident.setPhone(updatedResident.getPhone());
    existingResident.setRoomId(updatedResident.getRoomId());
    existingResident.setStatus(updatedResident.getStatus());

    return residentRepository.save(existingResident);
}
}