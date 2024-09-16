let selectCidades = document.querySelector('#cidades');
let listaCidades = [];


document.addEventListener('DOMContentLoaded', () => {
    fetch("./candidatos.json").then((response) => {
        response.json().then((dados) => {

            const cidadesSet = new Set();

            dados.candidatos.forEach((candidato) => {
                if (candidato.cidade) {
                    cidadesSet.add(candidato.cidade);
                }

            });
                listaCidades = Array.from(cidadesSet)

                listaCidades.forEach(cidade => {
                    let option = document.createElement('option');
                    option.value = cidade;
                    option.textContent = cidade;
                    selectCidades.appendChild(option);
                })
                    
                
                selectCidades.addEventListener('click',() => {
                    let divCandidatos = document.querySelector('.candidatos');
                            
                            //Limpando as div para atualizar os dados exibidos
                            divCandidatos.innerHTML = '';

                    dados.candidatos.forEach((candidato) => {
                        if(selectCidades.value == candidato.cidade) {
                            
                         
                            // Variáveis de elementos do perfil
                            const perfilDiv = document.createElement('div');
                            const foto = document.createElement('img');
                            const nomeUrna = document.createElement('span');
                            const numeroUrna = document.createElement('span');
                            const nomeCompleto = document.createElement('span');
                            const cidade = document.createElement('span');
                            const partido = document.createElement('span');
                            const instagramLink = document.createElement('a');
                            const instagramImg = document.createElement('img');
                            const facebookLink = document.createElement('a');
                            const facebookImg = document.createElement('img');

                            // Definindo id dos elementos do perfil
                            instagramImg.id = 'instagram';
                            facebookImg.id = 'facebook';
                            nomeUrna.id = 'nomeUrna';
                            numeroUrna.id = 'numeroUrna';
                            nomeCompleto.id = 'nomeCompleto';
                            cidade.id = 'cidade';
                            partido.id = 'partidoSigla';
                            
                            // Escrevendo os dados nas variaveis
                            foto.src = candidato.linkFoto;
                            nomeUrna.textContent = candidato.nomeUrna.toUpperCase();
                            numeroUrna.textContent = candidato.numUrna;

                            // Expressão Regular para deixar as primeiras letras maiusculas
                            capitalize = candidato.nomeCompleto.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
                            nomeCompleto.textContent = capitalize

                            cidade.textContent = candidato.cidade;
                            partido.textContent = `${candidato.partido} - ${candidato.siglaPartido.toUpperCase()}`;

                            // Verificar se o Instagram esta definido
                            if (candidato.instagram) {
                                instagramLink.href = candidato.instagram;
                                instagramImg.src = 'svgs/instagram.svg';
                                instagramLink.appendChild(instagramImg);
                                perfilDiv.appendChild(instagramLink);
                            }

                            // Verificar se o Facebook esta definido
                            if (candidato.facebook) {
                                facebookLink.href = candidato.facebook;
                                facebookImg.src = 'svgs/facebook.svg';
                                facebookLink.appendChild(facebookImg);
                                perfilDiv.appendChild(facebookLink);
                            }

                            // Exibir os dados na tela
                            perfilDiv.appendChild(foto);
                            perfilDiv.appendChild(nomeUrna);
                            perfilDiv.appendChild(numeroUrna);
                            perfilDiv.appendChild(nomeCompleto);
                            perfilDiv.appendChild(cidade);
                            perfilDiv.appendChild(partido);
                                             
                            // Exibi tudo na tela
                            divCandidatos.appendChild(perfilDiv);
                        }
                    })
                })
        })
    })
})