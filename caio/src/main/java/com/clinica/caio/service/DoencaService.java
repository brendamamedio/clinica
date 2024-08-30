package com.clinica.caio.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinica.caio.models.Doenca;
import com.clinica.caio.repository.DoencaRepository;

@Service
public class DoencaService {

    @Autowired
    private DoencaRepository doencaRepository;

    public List<Doenca> listarTodas() {
        return doencaRepository.findAll();
    }

    public Optional<Doenca> buscarPorId(String cid) {
        return doencaRepository.findById(cid);
    }
    
    public Doenca salvar(Doenca doenca) {
        return doencaRepository.save(doenca);
    }

    public boolean deletar(String cid) {
        doencaRepository.deleteById(cid);
        return true;
    }
}
