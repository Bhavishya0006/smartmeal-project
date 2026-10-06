package smartmeal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import smartmeal.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {

}