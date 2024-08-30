package com.clinica.caio.dtos;

import com.clinica.caio.models.Doenca;
import com.clinica.caio.models.Paciente;
import com.clinica.caio.models.Prescricao;

import java.io.Serializable;
import java.time.LocalDate;

public record PrescricaoDTO(
        Long numero,
        Paciente paciente,
        Doenca doenca,
        String nomeRemedio,
        LocalDate dataConsulta,
        String tratamento,
        LocalDate dataRevisao,
        String status
) implements Serializable {

    public PrescricaoDTO(Prescricao prescricao) {
        this(
                prescricao.getNumero(),
                prescricao.getPaciente(),
                prescricao.getDoenca(),
                prescricao.getNomeRemedio(),
                prescricao.getDataConsulta(),
                prescricao.getTratamento(),
                prescricao.getDataRevisao(),
                prescricao.getStatus()
        );

    }
}
