package smartmeal.service;

import org.springframework.stereotype.Service;
import smartmeal.entity.FoodWaste;
import smartmeal.exception.ResourceNotFoundException;
import smartmeal.repository.FoodWasteRepository;
import smartmeal.repository.MenuRepository;

import java.util.List;

@Service
public class FoodWasteService {

    private final FoodWasteRepository foodWasteRepository;
    private final MenuRepository menuRepository;
    public FoodWasteService(
        FoodWasteRepository foodWasteRepository,
        MenuRepository menuRepository) {

    this.foodWasteRepository = foodWasteRepository;
    this.menuRepository = menuRepository;
}

    // GET all food-waste records
    public List<FoodWaste> getAllFoodWaste() {
        return foodWasteRepository.findAll();
    }

    // GET food-waste record by ID
    public FoodWaste getFoodWasteById(Long id) {
    return foodWasteRepository.findById(id).orElseThrow(
        () -> new ResourceNotFoundException("Food waste not found with id: " + id));
}

    // POST - add food-waste record
 public FoodWaste addFoodWaste(FoodWaste foodWaste) {

    // Check Menu exists
    if (!menuRepository.existsById(foodWaste.getMenuId())) {
        throw new ResourceNotFoundException(
                "Menu not found with id: " + foodWaste.getMenuId()
        );
    }

    // Check served meals cannot be greater than prepared meals
    if (foodWaste.getServedMeals() > foodWaste.getPreparedMeals()) {
        throw new IllegalArgumentException(
                "Served meals cannot be greater than prepared meals"
        );
    }

    // Check leftover meals
    int expectedLeftover =
            foodWaste.getPreparedMeals() - foodWaste.getServedMeals();

    if (foodWaste.getLeftoverMeals() != expectedLeftover) {
        throw new IllegalArgumentException(
                "Leftover meals must be equal to prepared meals minus served meals"
        );
    }

    return foodWasteRepository.save(foodWaste);
}

    // PUT - update food-waste record
    public FoodWaste updateFoodWaste(
            Long id,
            FoodWaste updatedFoodWaste) {

        FoodWaste existingFoodWaste =
                foodWasteRepository.findById(id).orElse(null);

        if (existingFoodWaste == null) {
    throw new ResourceNotFoundException(
            "Food waste not found with id: " + id
    );
}

        existingFoodWaste.setMenuId(updatedFoodWaste.getMenuId());
        existingFoodWaste.setPreparedMeals(
                updatedFoodWaste.getPreparedMeals());
        existingFoodWaste.setServedMeals(
                updatedFoodWaste.getServedMeals());
        existingFoodWaste.setLeftoverMeals(
                updatedFoodWaste.getLeftoverMeals());
        existingFoodWaste.setWasteReason(
                updatedFoodWaste.getWasteReason());

        return foodWasteRepository.save(existingFoodWaste);
    }

    // DELETE - delete food-waste record
    public void deleteFoodWaste(Long id) {

    if (!foodWasteRepository.existsById(id)) {
        throw new ResourceNotFoundException(
                "Food waste not found with id: " + id
        );
    }

    foodWasteRepository.deleteById(id);
}
}