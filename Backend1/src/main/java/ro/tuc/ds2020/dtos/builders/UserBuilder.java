package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.dtos.UserDetailsDTO;
import ro.tuc.ds2020.entities.User;

public class UserBuilder {
    private UserBuilder() {
    }

    public static UserDTO toUserDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getPassword(), user.getRole());
    }

    public static User toEntity(UserDetailsDTO personDetailsDTO) {
        return new User(personDetailsDTO.getId(),
                personDetailsDTO.getName(),
                personDetailsDTO.getPassword(),
                personDetailsDTO.getRole(),
                personDetailsDTO.getTokens(),
                personDetailsDTO.getDevices());
    }
}
