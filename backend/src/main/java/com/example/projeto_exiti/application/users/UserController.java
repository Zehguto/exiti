package com.example.projeto_exiti.application.users;

import com.example.projeto_exiti.domain.entity.User;
import com.example.projeto_exiti.domain.exception.TuplaDuplicada;
import com.example.projeto_exiti.domain.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor

public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping
    public ResponseEntity save(@RequestBody UserDTO dto) {
        try {
            User user = userMapper.mapToUser(dto);
            userService.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (TuplaDuplicada e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @GetMapping //Get all
    public ResponseEntity<List<UserDTO>> findAll() {
        List<User> users = userService.findAll();
        List<UserDTO> UsersDTOs = users.stream()
                .map(userMapper::mapToDTO)
                .toList();
        return ResponseEntity.ok(UsersDTOs);
    }

    @GetMapping("/by-email")
    public ResponseEntity<UserDTO> findByEmail(@RequestParam String email) {
        User user = userService.findByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(userMapper.mapToDTO(user));

        }else  {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/import")
    public ResponseEntity<String> importUsers(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("Arquivo vazio");
        }
        try {
            String name = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
            List<User> users;
            if (name.endsWith(".csv")) {
                users = userMapper.mapFromCsv(file);
            } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
                users = userMapper.mapFromExcel(file);
            } else {
                return ResponseEntity.badRequest().body("Formato não suportado. Use CSV ou XLSX.");
            }
            userService.saveAll(users);
            return ResponseEntity.ok("Usuários importados: " + users.size());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro no servidor: " + e.getMessage());
        }
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]>exportUsersToCsv(){
        try {
            List<User> users = userService.findAll();
            StringBuilder csvBuilder = new StringBuilder();
            csvBuilder.append("Nome, Email, Status, Data Criacao\n");

            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");

            for (User user : users) {
                csvBuilder
                        .append(user.getNome()).append(",")
                        .append(user.getEmail()).append(",")
                        .append(user.getStatus()).append(",");

                if (user.getDataCriacao() != null) {
                    csvBuilder.append(user.getDataCriacao().format(formatter));
                }

                csvBuilder.append("\n");
            }
            byte[] csvBytes = csvBuilder.toString().getBytes(StandardCharsets.UTF_8);

            String filePath = "/Users/joseaugusto/Documents/ProjetoExiti/frontexiti/usuarios_export.csv";java.nio.file.Files.write(java.nio.file.Paths.get(filePath), csvBytes);
            java.nio.file.Files.write(java.nio.file.Paths.get(filePath), csvBytes);

            System.out.println("CSV exportado e salvo em: " + filePath);


            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=usuarios_export.csv")
                    .header("Content-Type", "text/csv; charset=UTF-8")
                    .body(csvBytes);
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Erro ao exportar usuários: " + e.getMessage()).getBytes());        }
    }

    @PutMapping("/{email}")
    public ResponseEntity update(@PathVariable String email, @RequestBody UserDTO dto) {
        try {
            User existingUser = userService.findByEmail(email);
            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario com email: "+email+" nao encontrado!");
            }
            if(dto.getNome()!= null && !dto.getNome().isEmpty()) {
                existingUser.setNome(dto.getNome());
            }

            if(dto.getEmail()!= null && !dto.getEmail().isEmpty()) {
                existingUser.setEmail(dto.getEmail());
            }
            if(dto.getStatus()!= null) {
                existingUser.setStatus(dto.getStatus());
            }
            userService.update(existingUser);
            return ResponseEntity.ok("Editado com sucesso!");

        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao editar"+e.getMessage());
        }

    }

    @DeleteMapping("/{email}")
    public ResponseEntity<String> delete(@PathVariable String email) {
        try{
            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario com email: "+email+" nao encontrado!");
            }
            userService.deleteByEmail(email);
            return ResponseEntity.ok("Deletado com sucesso!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao deletar"+e.getMessage());
        }
    }

}
