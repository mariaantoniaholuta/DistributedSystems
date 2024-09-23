package ro.tuc.ds2020.dtos;

import lombok.Getter;
import lombok.Setter;
import ro.tuc.ds2020.entities.util.UserRole;
import ro.tuc.ds2020.entities.Token;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class UserDetailsDTO {
    private UUID id;
    @NotNull
    private String name;
    @NotNull
    private String password;
    @NotNull
    private UserRole role;

    private List<Token> tokens;
    private List<String> devices;

    public UserDetailsDTO(String name, String password, UserRole role, List<Token> tokens) {
        this.name = name;
        this.password = password;
        this.role = role;
        this.tokens = tokens;
    }
}
