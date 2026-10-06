package smartmeal.service;

import org.springframework.stereotype.Service;
import smartmeal.entity.Menu;
import smartmeal.exception.ResourceNotFoundException;
import smartmeal.repository.MenuRepository;

import java.util.List;

@Service
public class MenuService {

    private final MenuRepository menuRepository;

    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    // GET all menus
    public List<Menu> getAllMenus() {
        return menuRepository.findAll();
    }

    // GET menu by ID
    public Menu getMenuById(Long id) {
    return menuRepository.findById(id).orElseThrow(
        () ->new ResourceNotFoundException("Menu not found with id: " + id));
}
    // POST - add menu
    public Menu addMenu(Menu menu) {
        return menuRepository.save(menu);
    }

    // PUT - update menu
    public Menu updateMenu(Long id, Menu updatedMenu) {

        Menu existingMenu = menuRepository.findById(id).orElse(null);

        if (existingMenu == null) {
    throw new ResourceNotFoundException(
            "Menu not found with id: " + id
    );
}

        existingMenu.setMenuDate(updatedMenu.getMenuDate());
        existingMenu.setMealType(updatedMenu.getMealType());
        existingMenu.setFoodItems(updatedMenu.getFoodItems());

        return menuRepository.save(existingMenu);
    }

    // DELETE - delete menu
    public void deleteMenu(Long id) {

    if (!menuRepository.existsById(id)) {
        throw new ResourceNotFoundException(
                "Menu not found with id: " + id
        );
    }

    menuRepository.deleteById(id);
}
}
