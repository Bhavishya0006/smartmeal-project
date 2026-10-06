package smartmeal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import smartmeal.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}