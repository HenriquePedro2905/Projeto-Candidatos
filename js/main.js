let perfilDiv = document.querySelector('.perfil')
let selectCidades = document.querySelector('#cidades')
let listaCidades = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch("./candidatos.json").then((response) => {
        response.json().then((dados) => {

            const cidadesSet = new Set();

            dados.candidatos.forEach(candidato => {
                if (candidato.Cidade) {
                    console.log(candidato.Cidade)
                    cidadesSet.add(candidato.Cidade)
                }

            });
                listaCidades = Array.from(cidadesSet)
                
                console.log(listaCidades)
                listaCidades.forEach(cidade => {
                    let option = document.createElement('option');
                    option.value = cidade
                    option.textContent = cidade;
                    selectCidades.appendChild(option)
                })
                    
            console.log(listaCidades);
        })
    })
})

