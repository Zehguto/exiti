package com.example.projeto_exiti.application.users;

import com.example.projeto_exiti.domain.entity.StatusUsuario;
import com.example.projeto_exiti.domain.entity.User;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Component
public class UserMapper {

    public User mapToUser(UserDTO dto) {
        LocalDateTime data = dto.getDataCriacao();
        if (data == null) {
            data = LocalDateTime.now();
        }
        return User.builder()
                .email(dto.getEmail())
                .nome(dto.getNome())
                .status(dto.getStatus())
                .build();
    }

    public UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setEmail(user.getEmail());
        dto.setNome(user.getNome());
        dto.setStatus(user.getStatus());
        dto.setDataCriacao(user.getDataCriacao());
        return dto;
    }

    public List<User> mapFromCsv(MultipartFile file) throws Exception {
        List<User> users = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            boolean isFirstLine = true;

            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }

                String[] fields = line.split(",");
                if (fields.length < 3) continue;

                String nome = fields[0].trim();
                String email = fields[1].trim();
                String status = fields[2].trim();
                String dataStr = fields.length >= 4 ? fields[3].trim() : "";

                LocalDateTime dataCriacao = LocalDateTime.now();
                if (!dataStr.isEmpty()) {
                    DateTimeFormatter[] formatos = new DateTimeFormatter[]{
                            DateTimeFormatter.ofPattern("dd/MM/yyyy"),
                            DateTimeFormatter.ofPattern("dd-MM-yyyy"),
                            DateTimeFormatter.ISO_LOCAL_DATE
                    };
                    for (DateTimeFormatter f : formatos) {
                        try {
                            LocalDate date = LocalDate.parse(dataStr, f);
                            dataCriacao = date.atStartOfDay();
                            break;
                        } catch (Exception ignored) {}
                    }
                }

                StatusUsuario statusEnum;
                try {
                    statusEnum = StatusUsuario.valueOf(status.toUpperCase());
                } catch (Exception e) {
                    statusEnum = StatusUsuario.ATIVO;
                }

                User user = User.builder()
                        .nome(nome)
                        .email(email)
                        .status(statusEnum)
                        .dataCriacao(dataCriacao)
                        .build();
                users.add(user);
            }
        }
        return users;
    }

    public List<User> mapFromExcel(MultipartFile file) throws Exception {
        List<User> users = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null) return users;

            int firstDataRow = 1;
            DateTimeFormatter[] formatos = new DateTimeFormatter[]{
                    DateTimeFormatter.ofPattern("dd/MM/yyyy"),
                    DateTimeFormatter.ofPattern("dd-MM-yyyy"),
                    DateTimeFormatter.ofPattern("yyyy-MM-dd")
            };

            for (int r = firstDataRow; r <= sheet.getLastRowNum(); r++) {
                Row row = sheet.getRow(r);
                if (row == null) continue;

                String nome = getCellAsString(row.getCell(0));
                String email = getCellAsString(row.getCell(1));
                String statusStr = getCellAsString(row.getCell(2)).toUpperCase();

                if (nome.isBlank() && email.isBlank()) continue;

                LocalDateTime dataCriacao = LocalDateTime.now();

                Cell dataCell = row.getCell(3);
                if (dataCell != null) {
                    try {
                        String valorBruto = getCellAsString(dataCell);
                        System.out.println("Valor de data detectado: [" + valorBruto + "]");

                        if (DateUtil.isCellDateFormatted(dataCell)) {
                            java.util.Date date = dataCell.getDateCellValue();
                            dataCriacao = LocalDateTime.ofInstant(date.toInstant(), java.time.ZoneId.systemDefault());
                        } else {
                            for (DateTimeFormatter f : formatos) {
                                try {
                                    LocalDate parsed = LocalDate.parse(valorBruto.trim(), f);
                                    dataCriacao = parsed.atStartOfDay();
                                    break;
                                } catch (Exception ignored) {}
                            }
                        }
                    } catch (Exception e) {
                        System.out.println("Erro ao converter data: " + e.getMessage());
                    }
                }

                StatusUsuario status;
                try {
                    status = StatusUsuario.valueOf(statusStr);
                } catch (Exception ex) {
                    status = StatusUsuario.ATIVO;
                }

                users.add(User.builder()
                        .nome(nome)
                        .email(email)
                        .status(status)
                        .dataCriacao(dataCriacao)
                        .build());
            }
        }
        return users;
    }


    private String getCellAsString(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    java.util.Date d = cell.getDateCellValue();
                    return java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")
                            .format(d.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate());
                } else {
                    double numeric = cell.getNumericCellValue();
                    long maybeInt = (long) numeric;
                    if (Math.abs(numeric - maybeInt) < 0.00001) return String.valueOf(maybeInt);
                    return String.valueOf(numeric);
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return cell.getStringCellValue().trim();
                } catch (Exception e) {
                    return String.valueOf(cell.getNumericCellValue());
                }
            default:
                return "";
        }
    }
}
