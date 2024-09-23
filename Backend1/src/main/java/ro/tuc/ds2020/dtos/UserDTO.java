package ro.tuc.ds2020.dtos;

import lombok.Getter;
import lombok.Setter;
import ro.tuc.ds2020.entities.util.UserRole;

import java.util.UUID;

@Getter
@Setter
public class UserDTO {

    private UUID id;
    private String name;
    private String password;
    private UserRole role;
//    private List<Token> tokens;
//
//    private List<String> devices;
//
//    public UserDTO() {
//        this.devices = new ArrayList<>();
//    }

    public UserDTO(UUID id, String name, String password, UserRole role) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.role = role;
//        this.tokens = tokens;
//        this.devices = new ArrayList<>();
    }

}
