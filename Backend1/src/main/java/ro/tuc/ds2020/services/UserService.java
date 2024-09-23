package ro.tuc.ds2020.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.dtos.UserDetailsDTO;
import ro.tuc.ds2020.dtos.builders.UserBuilder;
import ro.tuc.ds2020.entities.User;
import ro.tuc.ds2020.entities.util.UserRole;
import ro.tuc.ds2020.repositories.TokenRepository;
import ro.tuc.ds2020.repositories.UserRepository;
import ro.tuc.ds2020.token.TokenUtility;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final TokenRepository tokenRepository;

    private final TokenUtility tokenUtility;

    public List<UserDTO> findUsers() {
        List<User> userList = userRepository.findAll();
        return userList.stream()
                .map(UserBuilder::toUserDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> findUsersByRole(UserRole role) {
        List<User> users = userRepository.findByRole(role);
        return users.stream()
                .map(UserBuilder::toUserDTO)
                .collect(Collectors.toList());
    }

    public UserDTO findUserById(UUID id) {
        Optional<User> prosumerOptional = userRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            log.error("User with id {} was not found in db", id);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + id);
        }
        return UserBuilder.toUserDTO(prosumerOptional.get());
    }

    public UUID insert(UserDetailsDTO userDTO) {
        User user = UserBuilder.toEntity(userDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user = userRepository.save(user);
        log.debug("Person with id {} was inserted in db", user.getId());
        return user.getId();
    }

    public boolean update(UUID id, UserDetailsDTO updatedUserDTO) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            User updatedUser = UserBuilder.toEntity(updatedUserDTO);
            updatedUser.setId(user.getId());
            updatedUser.setPassword(passwordEncoder.encode(updatedUserDTO.getPassword()));

            userRepository.save(updatedUser);
            log.debug("User with id {} was updated in the database", user.getId());
            return true;
        } else {
            log.error("User with id {} was not found in the database", id);
            return false;
        }
    }

    public boolean delete(UUID id) {
        if (userRepository.existsById(id)) {
            //tokenRepository.deleteByUserId(id);
            userRepository.deleteById(id);
            log.debug("User with id {} was deleted from the database", id);
            return true;
        } else {
            log.error("User with id {} was not found in the database", id);
            return false;
        }
    }

    public boolean addDeviceToUser(UUID userId, String device) {
        System.out.println(userId.toString());
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            System.out.println("HERE");
            User user = userOptional.get();
            System.out.println(user.getDevices());
            user.getDevices().add(device);
            System.out.println(user.getDevices());
            userRepository.save(user);
            log.debug("Device with ID {} was added to user with ID {}", device, userId);
            return true;
        } else {
            log.error("User with ID {} was not found in the database", userId);
            return false;
        }
    }


}
