package smartmeal.service;

import org.springframework.stereotype.Service;
import smartmeal.entity.Inventory;
import smartmeal.exception.ResourceNotFoundException;
import smartmeal.repository.InventoryRepository;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    // GET all inventory items
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    // GET inventory item by ID
    public Inventory getInventoryById(Long id) {
    return inventoryRepository.findById(id).orElseThrow(
        () -> new ResourceNotFoundException("Inventory not found with id: " + id));
}

    // POST - add inventory item
    public Inventory addInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    // PUT - update inventory item
    public Inventory updateInventory(
            Long id,
            Inventory updatedInventory) {

        Inventory existingInventory =
                inventoryRepository.findById(id).orElse(null);

        if (existingInventory == null) {
    throw new ResourceNotFoundException(
            "Inventory not found with id: " + id
    );
}

        existingInventory.setItemName(
                updatedInventory.getItemName());

        existingInventory.setQuantity(
                updatedInventory.getQuantity());

        existingInventory.setUnit(
                updatedInventory.getUnit());

        existingInventory.setMinimumStock(
                updatedInventory.getMinimumStock());

        return inventoryRepository.save(existingInventory);
    }

    // DELETE - delete inventory item
    public void deleteInventory(Long id) {

    if (!inventoryRepository.existsById(id)) {
        throw new ResourceNotFoundException(
                "Inventory not found with id: " + id
        );
    }

    inventoryRepository.deleteById(id);
}
}