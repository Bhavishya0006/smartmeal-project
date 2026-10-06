package smartmeal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import smartmeal.entity.Menu;

public interface MenuRepository extends JpaRepository<Menu, Long> {
}
