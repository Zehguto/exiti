package com.example.projeto_exiti.application.users;

import com.example.projeto_exiti.domain.entity.StatusUsuario;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private String nome;
    private String email;
    private StatusUsuario status;
    private LocalDateTime dataCriacao;

}
