package smartmeal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import smartmeal.entity.Resident;

public interface ResidentRepository extends JpaRepository<Resident, Long> {

    long countByRoomId(Long roomId);
    
    boolean existsByUserId(Long userId);
}