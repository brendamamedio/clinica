package com.clinica.caio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinica.caio.models.Doenca;

@Repository
public interface DoencaRepository extends JpaRepository<Doenca, String>{

}
