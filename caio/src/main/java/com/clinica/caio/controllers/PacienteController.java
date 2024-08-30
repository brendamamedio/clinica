package com.clinica.caio.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.clinica.caio.models.Paciente;
import com.clinica.caio.service.PacienteService;

import java.util.List;

@RestController
@RequestMapping("/pacientes")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    /**
     * Endpoint para cadastrar um novo paciente.
     */
    @PostMapping("/criar")
    public ResponseEntity<Paciente> cadastrarPaciente(@RequestBody Paciente paciente) {
        Paciente novoPaciente = pacienteService.save(paciente);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoPaciente);
    }

    /**
     * Endpoint para atualizar um paciente existente.
     */
    @PutMapping("/atualizar{id}")
    public ResponseEntity<Paciente> atualizarPaciente(@PathVariable String id, @RequestBody Paciente pacienteAtualizado) {
        Paciente pacienteAtualizadoResult = pacienteService.atualizarPaciente(id, pacienteAtualizado);
        return ResponseEntity.ok(pacienteAtualizadoResult);
    }

    /**
     * Endpoint para excluir um paciente pelo ID.
     */
    @DeleteMapping("/delete{id}")
    public ResponseEntity<Void> excluirPaciente(@PathVariable String id) {
        pacienteService.deleteByCpf(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para buscar um paciente pelo ID.
     */
    // @GetMapping("/{id}")
    // public ResponseEntity<Paciente> buscarPacientePorId(@PathVariable String id) {
    //     Paciente paciente = pacienteService.findById(id);
    //     return ResponseEntity.ok(paciente);
    // }

    /**
     * Endpoint para buscar pacientes por nome.
     */
    @GetMapping("/buscar-por-nome")
    public ResponseEntity<List<Paciente>> buscarPacientesPorNome(@RequestParam String nome) {
        List<Paciente> pacientes = pacienteService.findByNome(nome);
        return ResponseEntity.ok(pacientes);
    }

    /**
     * Endpoint para buscar pacientes por CPF.
     */
    @GetMapping("/buscar-por-cpf")
    public ResponseEntity<Paciente> buscarPacientePorCpf(@RequestParam String cpf) {
        Paciente paciente = pacienteService.findById(cpf);
        return ResponseEntity.ok(paciente);
    }

    /**
     * Endpoint para listar todos os pacientes.
     */
     @GetMapping
     public ResponseEntity<List<Paciente>> listarTodosPacientes() {
         List<Paciente> pacientes = pacienteService.listarTodosPacientes();
         return ResponseEntity.ok(pacientes);
    }
}
