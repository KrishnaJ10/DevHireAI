package com.krishna.devhire_ai.controller;

import com.krishna.devhire_ai.config.JwtService;
import com.krishna.devhire_ai.dto.LoginRequest;
import com.krishna.devhire_ai.entity.User;
import com.krishna.devhire_ai.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    public User saveUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest) {
        return userService.findByEmail(loginRequest.getEmail())
                .filter(user -> userService.login(loginRequest.getEmail(), loginRequest.getPassword()))
                .map(user -> jwtService.generateToken(user.getEmail(), user.getRole()))
                .orElse("Invalid Email or Password");
    }
}