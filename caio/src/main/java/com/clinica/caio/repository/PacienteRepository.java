package com.clinica.caio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.caio.models.Paciente;

public interface PacienteRepository extends JpaRepository<Paciente, String>{
    List<Paciente> findByNomeContaining(String nome);
}
