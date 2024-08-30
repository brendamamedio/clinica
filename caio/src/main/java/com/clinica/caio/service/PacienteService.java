package com.clinica.caio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinica.caio.models.Paciente;
import com.clinica.caio.repository.PacienteRepository;
import com.clinica.caio.repository.PrescricaoRepository;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private PrescricaoRepository prescricaoRepository;

    // Método para salvar
    public Paciente save(Paciente paciente){
        return pacienteRepository.save(paciente);
    }

    // Método para deletar por CPF
    public void deleteByCpf(String cpf){
        Paciente paciente = pacienteRepository.findById(cpf).orElseThrow();
        if (prescricaoRepository.existsByPaciente(paciente)) {
            throw new RuntimeException("Não é possivel encontrar o paciente, ele tem prescroções associadas");
        }
        pacienteRepository.deleteById(cpf);
    }

    // Buscar por nome
    public List<Paciente> findByNome(String nome){
        return pacienteRepository.findByNomeContaining(nome);
    }

    public Paciente findById(String cpf){
        return pacienteRepository.findById(cpf)
        .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
    }

    // metodo para atualizar
    public Paciente atualizarPaciente(String cpf, Paciente pacienteAtualizado){
        // Verifica a existencia
        Paciente pacienteExistente = pacienteRepository.findById(cpf).
        orElseThrow(()-> new RuntimeException("Paciente com cpf não encontrado:" + cpf));
        // Atualiza os dados
        pacienteExistente.setNome(pacienteAtualizado.getNome());
        pacienteExistente.setIdade(pacienteAtualizado.getIdade());
        pacienteExistente.setEndereco(pacienteAtualizado.getEndereco());
        pacienteExistente.setTelefone(pacienteAtualizado.getTelefone());

        return pacienteRepository.save(pacienteAtualizado);
    }

    public List <Paciente> listarTodosPacientes(){
        return pacienteRepository.findAll();
    }
}
