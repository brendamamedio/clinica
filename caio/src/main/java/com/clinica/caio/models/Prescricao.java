package com.clinica.caio.models;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Prescricao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long numero;

    @ManyToOne
    @JoinColumn(name = "paciente_cpf")
    @JsonBackReference("pacientePrescricoes")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "doenca_cid")
    @JsonBackReference("doencaPrescricoes")
    private Doenca doenca;

    private String nomeRemedio;
    private LocalDate dataConsulta;
    private String tratamento;
    private LocalDate dataRevisao;
    private String status;
}
