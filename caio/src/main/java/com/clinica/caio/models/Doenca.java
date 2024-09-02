package com.clinica.caio.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Doenca {

    @Id
    private String cid;
    private String nome;
    private String descricao;

    @OneToMany(mappedBy = "doenca", cascade = CascadeType.ALL)
    @JsonManagedReference("doencaPrescricoes")
    private List<Prescricao> prescricoes;

    
}
