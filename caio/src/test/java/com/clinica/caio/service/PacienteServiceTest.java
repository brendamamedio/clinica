package com.clinica.caio.service;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;

import com.clinica.caio.models.Paciente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;

@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PacienteServiceTest {

    private final PacienteService pacienteService;

    @Autowired
    public PacienteServiceTest(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    @Test
    public void testCriarPaciente(){
    Paciente Paciente = new Paciente("123124124", "Caio", 30, "Rua A, 120", "99090930", Collections.emptyList());
    Paciente salvo = pacienteService.save(Paciente);

    assertNotNull(salvo);
    assertEquals("123124124", salvo.getCpf());
    assertEquals("Caio", salvo.getNome());
    assertEquals(30, salvo.getIdade());

    }

    @Test
    public void testBuscarPacientePorCpf() {
        Paciente paciente = new Paciente("123.456.789-00", "João", 25, "Rua A, 123", "99999-9999", Collections.emptyList());
        pacienteService.save(paciente);

        Optional<Paciente> result = Optional.ofNullable(pacienteService.findById("123.456.789-00"));

        assertTrue(result.isPresent());
        assertEquals("João", result.get().getNome());
    }


    @Test
    public void testAtualizarPaciente() {
        Paciente paciente = new Paciente("123.456.789-00", "João", 25, "Rua A, 123", "99999-9999", Collections.emptyList());
        pacienteService.save(paciente);

        Paciente atualizado = new Paciente("123.456.789-00", "João Silva", 26, "Rua B, 456", "98888-8888", Collections.emptyList());
        String cpf = atualizado.getCpf();

        Paciente result = pacienteService.atualizarPaciente(cpf, atualizado);

        assertEquals("João Silva", result.getNome());
        assertEquals(26, result.getIdade());
    }

    // @Test
    // public void testExcluirPaciente() {
    //     Paciente paciente = new Paciente("123.456.789-00", "João", 25, "Rua A, 123", "99999-9999");
    //     pacienteService.save(paciente);

    //     boolean excluido = pacienteService.deleteByCpf("123.456.789-00");

    //     assertTrue(excluido);
    //     assertFalse(pacienteService.findById("123.456.789-00").isPresent());
    // }
}
