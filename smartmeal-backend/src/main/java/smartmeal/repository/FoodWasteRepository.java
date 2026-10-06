package smartmeal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import smartmeal.entity.FoodWaste;

public interface FoodWasteRepository extends JpaRepository<FoodWaste, Long> {
}