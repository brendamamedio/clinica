package com.clinica.caio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinica.caio.models.Paciente;
import com.clinica.caio.models.Prescricao;
import java.time.LocalDate;


public interface PrescricaoRepository extends JpaRepository<Prescricao, Long>{
    List<Prescricao> findByStatus(String status);
    List<Prescricao> findByDataRevisaoBefore(LocalDate dataRevisao);
    boolean existsByPaciente(Paciente paciente);
    List<Prescricao> findByDataRevisaoBeforeAndStatus(LocalDate hoje, String string);
}
