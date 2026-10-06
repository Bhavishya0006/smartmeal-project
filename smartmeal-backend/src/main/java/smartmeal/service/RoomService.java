package smartmeal.service;

import org.springframework.stereotype.Service;
import smartmeal.entity.Room;
import smartmeal.exception.ResourceNotFoundException;
import smartmeal.repository.RoomRepository;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // GET all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // GET room by ID
    public Room getRoomById(Long id) {
    return roomRepository.findById(id).orElseThrow(
        () ->new ResourceNotFoundException("Room not found with id: " + id));
}

    // POST - add room
    public Room addRoom(Room room) {
    // Check Room Status
if (!room.getStatus().equals("AVAILABLE")
        && !room.getStatus().equals("OCCUPIED")
        && !room.getStatus().equals("MAINTENANCE")) {

    throw new IllegalArgumentException(
            "Room status must be AVAILABLE, OCCUPIED or MAINTENANCE"
    );
}
        return roomRepository.save(room);
    }

    // PUT - update room
    public Room updateRoom(Long id, Room updatedRoom) {
        Room existingRoom = roomRepository.findById(id).orElse(null);

        if (existingRoom == null) {
    throw new ResourceNotFoundException(
            "Room not found with id: " + id
    );
}
        existingRoom.setRoomNumber(updatedRoom.getRoomNumber());
        existingRoom.setFloor(updatedRoom.getFloor());
        existingRoom.setCapacity(updatedRoom.getCapacity());
        existingRoom.setStatus(updatedRoom.getStatus());

        return roomRepository.save(existingRoom);
    }

    // DELETE - delete room
    public void deleteRoom(Long id) {

    if (!roomRepository.existsById(id)) {
        throw new ResourceNotFoundException(
                "Room not found with id: " + id
        );
    }

    roomRepository.deleteById(id);
}
}