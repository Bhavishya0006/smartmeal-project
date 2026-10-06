package smartmeal.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import smartmeal.entity.Menu;
import smartmeal.service.MenuService;
import jakarta.validation.Valid;

import java.util.List;

@RestController
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    // GET all menus
    @GetMapping("/menus")
    public List<Menu> getAllMenus() {
        return menuService.getAllMenus();
    }

    // GET menu by ID
    @GetMapping("/menus/{id}")
    public Menu getMenuById(@PathVariable Long id) {
        return menuService.getMenuById(id);
    }

    // POST - add menu
    @PostMapping("/menus")
    public Menu addMenu( @Valid @RequestBody Menu menu) {
        return menuService.addMenu(menu);
    }

    // PUT - update menu
    @PutMapping("/menus/{id}")
    public Menu updateMenu(
            @PathVariable Long id,
            @Valid @RequestBody Menu menu) {

        return menuService.updateMenu(id, menu);
    }

    // DELETE - delete menu
    @DeleteMapping("/menus/{id}")
    public void deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
    }
}
