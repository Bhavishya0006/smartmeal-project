package smartmeal.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import smartmeal.entity.Feedback;
import smartmeal.service.FeedbackService;
import jakarta.validation.Valid;

import java.util.List;

@RestController
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // GET all feedback
    @GetMapping("/feedback")
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }

    // GET feedback by ID
    @GetMapping("/feedback/{id}")
    public Feedback getFeedbackById(@PathVariable Long id) {
        return feedbackService.getFeedbackById(id);
    }

    // POST - add feedback
    @PostMapping("/feedback")
    public Feedback addFeedback(@Valid @RequestBody Feedback feedback) {
        return feedbackService.addFeedback(feedback);
    }

    // PUT - update feedback
    @PutMapping("/feedback/{id}")
    public Feedback updateFeedback(
            @PathVariable Long id,
            @Valid @RequestBody Feedback feedback) {

        return feedbackService.updateFeedback(id, feedback);
    }

    // DELETE - delete feedback
    @DeleteMapping("/feedback/{id}")
    public void deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
    }
}