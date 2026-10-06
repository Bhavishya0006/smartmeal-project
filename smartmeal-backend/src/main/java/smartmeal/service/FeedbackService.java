package smartmeal.service;

import org.springframework.stereotype.Service;
import smartmeal.entity.Feedback;
import smartmeal.exception.ResourceNotFoundException;
import smartmeal.repository.FeedbackRepository;
import smartmeal.repository.ResidentRepository;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ResidentRepository residentRepository;

   public FeedbackService(
        FeedbackRepository feedbackRepository,
        ResidentRepository residentRepository) {

    this.feedbackRepository = feedbackRepository;
    this.residentRepository = residentRepository;
}

    // GET all feedback
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    // GET feedback by ID
    public Feedback getFeedbackById(Long id) {
    return feedbackRepository.findById(id).orElseThrow(
        () ->new ResourceNotFoundException("Feedback not found with id: " + id));
}

    // POST - add feedback
    public Feedback addFeedback(Feedback feedback) {

    if (!residentRepository.existsById(feedback.getResidentId())) {
        throw new ResourceNotFoundException(
                "Resident not found with id: " + feedback.getResidentId()
        );
    }

    return feedbackRepository.save(feedback);
}

    // PUT - update feedback
    public Feedback updateFeedback(Long id, Feedback updatedFeedback) {

        Feedback existingFeedback =
                feedbackRepository.findById(id).orElse(null);

        if (existingFeedback == null) {
    throw new ResourceNotFoundException(
            "Feedback not found with id: " + id
    );
}

        existingFeedback.setResidentId(updatedFeedback.getResidentId());
        existingFeedback.setRating(updatedFeedback.getRating());
        existingFeedback.setComment(updatedFeedback.getComment());

        return feedbackRepository.save(existingFeedback);
    }

    // DELETE - delete feedback
    public void deleteFeedback(Long id) {

    if (!feedbackRepository.existsById(id)) {
        throw new ResourceNotFoundException(
                "Feedback not found with id: " + id
        );
    }

    feedbackRepository.deleteById(id);
}
}