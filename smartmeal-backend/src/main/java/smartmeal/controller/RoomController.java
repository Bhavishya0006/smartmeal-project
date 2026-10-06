package smartmeal.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import smartmeal.entity.Room;
import smartmeal.service.RoomService;
import jakarta.validation.Valid;

import java.util.List;

@RestController
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // GET all rooms
    @GetMapping("/rooms")
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    // GET room by ID
    @GetMapping("/rooms/{id}")
    public Room getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }

    // POST - add room
    @PostMapping("/rooms")
    public Room addRoom(@Valid @RequestBody Room room) {
        return roomService.addRoom(room);
    }

    // PUT - update room
    @PutMapping("/rooms/{id}")
    public Room updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody Room room) {

        return roomService.updateRoom(id, room);
    }

    // DELETE - delete room
    @DeleteMapping("/rooms/{id}")
    public void deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
    }
}