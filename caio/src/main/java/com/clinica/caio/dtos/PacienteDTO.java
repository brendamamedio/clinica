package com.clinica.caio.dtos;

import com.clinica.caio.models.Paciente;

import java.io.Serializable;

public record PacienteDTO(
         String cpf,
         String nome,
         Integer idade,
         String endereco,
         String telefone

) implements Serializable {
    public PacienteDTO(Paciente paciente){
        this(
                paciente.getCpf(),
                paciente.getNome(),
                paciente.getIdade(),
                paciente.getEndereco(),
                paciente.getTelefone()

        );
    }
}
