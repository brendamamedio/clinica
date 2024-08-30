package com.clinica.caio.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.caio.models.Doenca;
import com.clinica.caio.service.DoencaService;

@RestController
@RequestMapping("/api/doencas")
public class DoencaController {

    @Autowired
    private DoencaService doencaService;

    @GetMapping
    public List<Doenca> listarTodas() {
        return doencaService.listarTodas();
    }

    @GetMapping("buscar/{id}")
    public ResponseEntity<Doenca> buscarPorId(@PathVariable String id) {
        Optional<Doenca> doenca = doencaService.buscarPorId(id);
        if(doenca.isPresent()){
            return ResponseEntity.ok(doenca.get());
        }else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/criar")
    public Doenca criar(@RequestBody Doenca doenca) {
        return doencaService.salvar(doenca);
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<Doenca> atualizar(@PathVariable String id, @RequestBody Doenca doenca){
        if (!doencaService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        doenca.setCid(id);
        return ResponseEntity.ok(doencaService.salvar(doenca));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id){
        if (!doencaService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        doencaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
