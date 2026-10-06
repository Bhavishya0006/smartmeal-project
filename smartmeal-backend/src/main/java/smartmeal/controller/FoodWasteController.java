package smartmeal.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import smartmeal.entity.FoodWaste;
import smartmeal.service.FoodWasteService;
import jakarta.validation.Valid;

import java.util.List;

@RestController
public class FoodWasteController {

    private final FoodWasteService foodWasteService;

    public FoodWasteController(FoodWasteService foodWasteService) {
        this.foodWasteService = foodWasteService;
    }
// get
    @GetMapping("/food-waste")
    public List<FoodWaste> getAllFoodWaste() {
        return foodWasteService.getAllFoodWaste();
    }
// get [id]
    @GetMapping("/food-waste/{id}")
    public FoodWaste getFoodWasteById(@PathVariable Long id) {
        return foodWasteService.getFoodWasteById(id);
    }
// post add
    @PostMapping("/food-waste")
    public FoodWaste addFoodWaste(@Valid @RequestBody FoodWaste foodWaste) {
        return foodWasteService.addFoodWaste(foodWaste);
    }
//get
    @PutMapping("/food-waste/{id}")
    public FoodWaste updateFoodWaste(
            @PathVariable Long id,
            @Valid @RequestBody FoodWaste foodWaste) {

        return foodWasteService.updateFoodWaste(id, foodWaste);
    }
// delete
    @DeleteMapping("/food-waste/{id}")
    public void deleteFoodWaste(@PathVariable Long id) {
        foodWasteService.deleteFoodWaste(id);
    }
}