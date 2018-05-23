package com.classifiedmapbackend.boundary;

import com.classifiedmapbackend.control.auth.UserAuthenticationService;
import com.classifiedmapbackend.control.auth.UserRegistrationService;
import com.classifiedmapbackend.entity.dto.UserDTO;
import com.classifiedmapbackend.entity.jpa.UserAccountEntity;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotNull;

import java.util.Optional;
import java.util.UUID;

import static lombok.AccessLevel.PRIVATE;
import static lombok.AccessLevel.PUBLIC;

@RestController
@CrossOrigin
@RequestMapping("/public/users")
@FieldDefaults(level = PRIVATE, makeFinal = true)
@AllArgsConstructor(access = PUBLIC)
public final class PublicUsersResource {
  @NonNull
  UserAuthenticationService authentication;

  @NotNull
  UserRegistrationService registrationService;

  @PostMapping("/login")
  public ResponseEntity login(@RequestParam("username") final String username, @RequestParam("password") final String password) {
    Optional<String> token = authentication.login(username, password);
    return token.<ResponseEntity>map(s -> ResponseEntity.status(HttpStatus.OK).body(s)).orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
  }

  @PostMapping("/register")
  public ResponseEntity register(@RequestBody UserDTO userDTO)
  {
    if(registrationService.existsByUsername(userDTO.getUserName()))
      return ResponseEntity.status(HttpStatus.CONFLICT).body("username");

    if(registrationService.existsByEmail(userDTO.getEmail()))
      return ResponseEntity.status(HttpStatus.CONFLICT).body("email");

    UserAccountEntity newUser = mapToUserAccountEntity(userDTO);
    registrationService.register(newUser);

    return ResponseEntity.status(HttpStatus.OK).body(newUser.getId());
  }

  private UserAccountEntity mapToUserAccountEntity(UserDTO userDTO) {
    return UserAccountEntity.builder()
            .id(UUID.randomUUID().toString())
            .firstName(userDTO.getFirstName())
            .lastName(userDTO.getLastName())
            .phoneNumber(userDTO.getPhoneNumber())
            .email(userDTO.getPhoneNumber())
            .userName(userDTO.getUserName())
            .password(userDTO.getPassword())
            .build();
  }

}