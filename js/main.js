let selectCidades = document.querySelector('#cidades');
let listaCidades = [];

// Variáveis de elementos do perfil
const perfilDiv = document.createElement('div');
const foto = document.createElement('img');
const nomeUrna = document.createElement('span');
const numeroUrna = document.createElement('span');
const nomeCompleto = document.createElement('span');
const cidade = document.createElement('span');
const partido = document.createElement('span');
const siglaPartido = document.createElement('span');
const instagramLink = document.createElement('a');
const instagramImg = document.createElement('img');
const facebookLink = document.createElement('a');
const facebookImg = document.createElement('img');


document.addEventListener('DOMContentLoaded', () => {
    fetch("./candidatos.json").then((response) => {
        response.json().then((dados) => {

            const cidadesSet = new Set();

            dados.candidatos.forEach((candidato) => {
                if (candidato.cidade) {
                    console.log(candidato.cidade);
                    cidadesSet.add(candidato.cidade);
                }

            });
                listaCidades = Array.from(cidadesSet)

                console.log(listaCidades)
                listaCidades.forEach(cidade => {
                    let option = document.createElement('option');
                    option.value = cidade;
                    option.textContent = cidade;
                    selectCidades.appendChild(option);
                })
                    
                
                selectCidades.addEventListener('click',() => {
                    console.log(selectCidades.value);
                    
                    dados.candidatos.forEach((candidato) => {
                        if(selectCidades.value == candidato.cidade) {
                            let divCandidatos = document.querySelector('.candidatos');

                            // Escrevendo os dados nas variáveis
                            foto.src = candidato.linkFoto;
                            nomeUrna.textContent = candidato.nomeUrna;
                            numeroUrna.textContent = candidato.numUrna;
                            nomeCompleto.textContent = candidato.nomeCompleto;
                            cidade.textContent = candidato.cidade;
                            partido.textContent = candidato.partido;
                            siglaPartido.textContent = candidato.siglaPartido;
                            instagramLink.href = candidato.instagram;
                            instagramImg.src = 'svgs/instagram.svg';
                            facebookLink.href = candidato.facebook;
                            facebookImg.src = 'svgs/facebook.svg';

                            // Formatando link e icone - instagram e facebook
                            instagramLink.appendChild(instagramImg);
                            facebookLink.appendChild(facebookImg);

                            // Exibir os dados na tela
                            perfilDiv.appendChild(foto);
                            perfilDiv.appendChild(nomeUrna);
                            perfilDiv.appendChild(numeroUrna);
                            perfilDiv.appendChild(nomeCompleto);
                            perfilDiv.appendChild(cidade);
                            perfilDiv.appendChild(partido);
                            perfilDiv.appendChild(siglaPartido);
                            perfilDiv.appendChild(instagramLink);
                            perfilDiv.appendChild(facebookLink);

                            divCandidatos.appendChild(perfilDiv);

                        }
                    })
                })
        })
    })
})



