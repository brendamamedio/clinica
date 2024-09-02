package com.clinica.caio.dtos;

import com.clinica.caio.models.Prescricao;
import java.io.Serializable;
import java.time.LocalDate;

public record PrescricaoDTO(
        Long numero,
        PacienteDTO paciente,
        DoencaDTO doenca,
        String nomeRemedio,
        LocalDate dataConsulta,
        String tratamento,
        LocalDate dataRevisao,
        String status
) implements Serializable {

    public PrescricaoDTO(Prescricao prescricao) {
        this(
                prescricao.getNumero(),
                new PacienteDTO(prescricao.getPaciente()), // Usando PacienteDTO
                new DoencaDTO(prescricao.getDoenca()), // Usando DoencaDTO
                prescricao.getNomeRemedio(),
                prescricao.getDataConsulta(),
                prescricao.getTratamento(),
                prescricao.getDataRevisao(),
                prescricao.getStatus()
        );
    }
}
