package ro.tuc.ds2020.entities.util;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {

    Admin("Admin"),
    Client("Client");

    @Getter
    private final String permission;
}
