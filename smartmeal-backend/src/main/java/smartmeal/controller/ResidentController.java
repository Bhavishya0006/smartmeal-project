package smartmeal.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import smartmeal.entity.Resident;
import smartmeal.service.ResidentService;

import java.util.List;

@RestController


public class ResidentController {

    private final ResidentService residentService;

    public ResidentController(ResidentService residentService) {
        this.residentService = residentService;
    }

    @GetMapping("/residents")
    public List<Resident> getAllResidents() {
        return residentService.getAllResidents();
    }
    @GetMapping("/residents/{id}")
public Resident getResidentById(@PathVariable Long id) {
    return residentService.getResidentById(id);
}
@PostMapping("/residents")
public Resident addResident(@Valid @RequestBody Resident resident) {
    return residentService.addResident(resident);
}
@DeleteMapping("/residents/{id}")
public void deleteResident(@PathVariable Long id) {
    residentService.deleteResident(id);
}

@PutMapping("/residents/{id}")
public Resident updateResident(
        @PathVariable Long id,
        @Valid @RequestBody Resident resident) {

    return residentService.updateResident(id, resident);
}
}