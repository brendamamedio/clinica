package com.clinica.caio.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinica.caio.models.Prescricao;
import com.clinica.caio.repository.PrescricaoRepository;

@Service
public class PrescricaoService {
    @Autowired
    private PrescricaoRepository prescricaoRepository;
 
    private String determinarTratamento(int idade){
        if (idade < 10) {
            return "Medicação 1 vez ao dia";
        } else if (idade >= 11 && idade <= 40) {
            return "Medicação 2 vezes ao dia";
        } else if (idade >= 41 && idade <= 60) {
            return "Medicação 3 vezes ao dia";
        } else {
            return "Medicação 1 vez ao dia";
        }
    }

    public Prescricao createPrescription (Prescricao prescricao) {
        // Configuração do tratamento pela idade
        String tratamento = determinarTratamento(prescricao.getPaciente().getIdade());
        prescricao.setTratamento(tratamento);

        // Calcular a revisão após 30 dias da consulta
        LocalDate dataRevisao = prescricao.getDataConsulta().plusDays(30);
        prescricao.setDataRevisao(dataRevisao);

        // Definição de status inicial
        prescricao.setStatus("Em andamento");

        return prescricaoRepository.save(prescricao);
    }

    public Prescricao atualizarPrescricao(Long numero, Prescricao prescricaoAtualizada){
        Prescricao prescricaoExistente = prescricaoRepository.findById(numero)
        .orElseThrow(() -> new RuntimeException("Prescrição não encontrada com esse número" + numero));

        prescricaoExistente.setNomeRemedio(prescricaoAtualizada.getNomeRemedio());
        prescricaoExistente.setDataConsulta(prescricaoAtualizada.getDataConsulta());
        prescricaoExistente.setTratamento(determinarTratamento(prescricaoExistente.getPaciente().getIdade()));
        prescricaoExistente.setDataRevisao(prescricaoAtualizada.getDataConsulta().plusDays(30));
        prescricaoExistente.setStatus(prescricaoAtualizada.getStatus());

        return prescricaoRepository.save(prescricaoExistente);
    }

    public List<Prescricao> listarPrescricoesAtrasadas() {
        LocalDate hoje = LocalDate.now();
        return prescricaoRepository.findByDataRevisaoBeforeAndStatus(hoje, "Em andamento");
    }

    public Prescricao buscarPorNumero(Long numero){
        return prescricaoRepository.findById(numero)
        .orElseThrow(() -> new RuntimeException("Prescrição não encontrada:" + numero));
    }
    
    public Prescricao concluirPrescricao(Long numero){
        Prescricao prescricao = buscarPorNumero(numero);

        if(!prescricao.getStatus().equals("Em andamento")){
            throw new RuntimeException("A prescrição já foi concluida ou não inicializada");
        }
        prescricao.setStatus("Concluída");

        return prescricaoRepository.save(prescricao);
    }

    public List<Prescricao> listarTodasPrescricoes(){
        return prescricaoRepository.findAll();
    }
}
