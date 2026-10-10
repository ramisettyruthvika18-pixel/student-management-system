package com.sms.controller;

import com.sms.entity.User;
import com.sms.repository.UserRepository;
import com.sms.security.JwtUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public record LoginRequest(@NotBlank(message = "Username is required") String username,
                               @NotBlank(message = "Password is required") String password) {}

    public record RegisterRequest(
            @NotBlank(message = "Username is required") @Size(min = 3, max = 50, message = "Username must be 3-50 characters") String username,
            @NotBlank(message = "Email is required") @Email(message = "Enter a valid email address") String email,
            @NotBlank(message = "Password is required") @Size(min = 6, message = "Password must be at least 6 characters") String password) {}

    public record AuthResponse(String token, String username, String role) {}

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtUtil jwtUtil) {
        this.users = users;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        User user = users.findByUsername(req.username())
                .filter(u -> encoder.matches(req.password(), u.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect username or password"));
        return new AuthResponse(jwtUtil.generateToken(user.getUsername(), user.getRole()), user.getUsername(), user.getRole());
    }

    /** Self-registration creates a STUDENT (view-only) account. Admins are created by seeding / database. */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        if (users.existsByUsername(req.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That username is already taken");
        }
        if (users.existsByEmail(req.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with that email already exists");
        }
        User user = users.save(new User(req.username(), req.email(), encoder.encode(req.password()), "STUDENT"));
        return new AuthResponse(jwtUtil.generateToken(user.getUsername(), user.getRole()), user.getUsername(), user.getRole());
    }
}
