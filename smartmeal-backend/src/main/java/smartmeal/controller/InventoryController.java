package smartmeal.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import smartmeal.entity.Inventory;
import smartmeal.service.InventoryService;
import jakarta.validation.Valid;

import java.util.List;

@RestController
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }
// get all data
    @GetMapping("/inventory")
    public List<Inventory> getAllInventory() {
        return inventoryService.getAllInventory();
    }
// get {id}
    @GetMapping("/inventory/{id}")
    public Inventory getInventoryById(@PathVariable Long id) {
        return inventoryService.getInventoryById(id);
    }
// post add 
    @PostMapping("/inventory")
    public Inventory addInventory(@Valid @RequestBody Inventory inventory) {
        return inventoryService.addInventory(inventory);
    }
//put modify
    @PutMapping("/inventory/{id}")
    public Inventory updateInventory(
            @PathVariable Long id,
            @Valid @RequestBody Inventory inventory) {

        return inventoryService.updateInventory(id, inventory);
    }
// delete 
    @DeleteMapping("/inventory/{id}")
    public void deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
    }
}