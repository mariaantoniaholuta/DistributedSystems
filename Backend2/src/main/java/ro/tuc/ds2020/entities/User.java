package ro.tuc.ds2020.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "app_user")
public class User {

    @Id
    @Column(name = "user_id")
    private String userId;

    public User() {
    }

    public User(String userId) {
        this.userId = userId;
    }

}