package smartmeal.service;

import org.springframework.stereotype.Service;

import smartmeal.dto.LoginResponse;
import smartmeal.entity.User;
import smartmeal.exception.ResourceNotFoundException;
import smartmeal.repository.UserRepository;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET user by ID
    public User getUserById(Long id) {
    return userRepository.findById(id).orElseThrow(
        () -> new ResourceNotFoundException("User not found with id: " + id));
}
    // POST - add user
    public User addUser(User user) {

        // Check User Role
if (!user.getRole().equals("ADMIN")
        && !user.getRole().equals("RESIDENT")
        && !user.getRole().equals("COOK")) {

    throw new IllegalArgumentException(
            "User role must be ADMIN, RESIDENT or COOK"
    );
}

        return userRepository.save(user);
    }

    // PUT - update user
    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id).orElse(null);

       if (existingUser == null) {
    throw new ResourceNotFoundException(
            "User not found with id: " + id
    );
    
}

        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setPasswordHash(updatedUser.getPasswordHash());
        existingUser.setRole(updatedUser.getRole());

        // Check User Role
if (!existingUser.getRole().equals("ADMIN")
        && !existingUser.getRole().equals("RESIDENT")
        && !existingUser.getRole().equals("COOK")) {

    throw new IllegalArgumentException(
            "User role must be ADMIN, RESIDENT or COOK"
    );
}
        return userRepository.save(existingUser);
    }

    // DELETE - delete user
    public void deleteUser(Long id) {

    if (!userRepository.existsById(id)) {
        throw new ResourceNotFoundException(
                "User not found with id: " + id
        );
    }

    userRepository.deleteById(id);
}
public LoginResponse login(String username, String password) {

    User user = userRepository.findByUsername(username)
            .orElseThrow(() ->
                    new RuntimeException("Invalid username or password"));

    if (!user.getPasswordHash().equals(password)) {
        throw new RuntimeException("Invalid username or password");
    }

    return new LoginResponse(
            user.getId(),
            user.getUsername(),
            user.getRole(),
            "Login successful"
    );
}
}