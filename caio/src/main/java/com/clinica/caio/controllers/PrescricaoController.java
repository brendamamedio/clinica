package com.clinica.caio.controllers;

import java.util.List;

import com.clinica.caio.dtos.PrescricaoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.caio.models.Prescricao;
import com.clinica.caio.service.PrescricaoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/prescricoes")
public class PrescricaoController {
    @Autowired
    private PrescricaoService prescricaoService;

    // EndPoints

    @PostMapping
    public ResponseEntity<Prescricao> criarPrescricao(@RequestBody Prescricao prescricao){
        Prescricao novaPrescricao = prescricaoService.createPrescription(prescricao);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaPrescricao);
    }

       @PutMapping("/{numero}")
    public ResponseEntity<Prescricao> atualizarPrescricao(@PathVariable Long numero, @RequestBody Prescricao prescricaoAtualizada) {
        Prescricao prescricaoAtualizadaResult = prescricaoService.atualizarPrescricao(numero, prescricaoAtualizada);
        return ResponseEntity.ok(prescricaoAtualizadaResult);
    }

    @GetMapping
    public List<PrescricaoDTO> listarTodasPrescricoes() {
        return prescricaoService.listarTodasPrescricoes().stream().map(PrescricaoDTO::new).toList();
    }

    @GetMapping("/{numero}")
    public ResponseEntity<Prescricao> buscarPrescricaoPorNumero(@PathVariable Long numero) {
        Prescricao prescricao = prescricaoService.buscarPorNumero(numero);
        return ResponseEntity.ok(prescricao);
    }

    @GetMapping("/atrasadas")
    public ResponseEntity<List<Prescricao>> listarPrescricoesAtrasadas() {
        List<Prescricao> prescricoesAtrasadas = prescricaoService.listarPrescricoesAtrasadas();
        return ResponseEntity.ok(prescricoesAtrasadas);
    }

    @PutMapping("/{numero}/concluir")
    public ResponseEntity<Prescricao> concluirPrescricao(@PathVariable Long numero) {
        Prescricao prescricaoConcluida = prescricaoService.concluirPrescricao(numero);
        return ResponseEntity.ok(prescricaoConcluida);
    }
    
}
