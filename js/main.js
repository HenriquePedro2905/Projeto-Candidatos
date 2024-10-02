//v1
let selectCidades = document.querySelector('#cidades');
let listaCidades = [];

async function getPrint(div, facebookLink, instagramLink) {

    function base64ToBlob(base64, type = 'image/jpeg') {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type });
    }

    
    // Aguardar o carregamento da imagem
    await new Promise(resolve => {
        html2canvas(div, {
            scale: 2, // Ajuste o valor conforme necessário
            useCORS: true,
            backgroundColor: '#a8a8a8'
        }).then(canvas => {
            const imagem = canvas.toDataURL("image/jpeg");
            console.log(imagem)
            // Remover o prefixo 'data:image/jpeg;base64,' da string
            const base64Data = imagem.split(',')[1];
            const blob = base64ToBlob(base64Data); // Converter Base64 para Blob
            const shareData = {
                files: [new File([blob], "image.jpeg", { type: "image/jpeg" })],
            };

            let textToShare = '';
            if (facebookLink) {
                textToShare += `Facebook: ${facebookLink}\n`;
            }
            if (instagramLink) {
                textToShare += `Instagram: ${instagramLink}\n`;
            }

            // Adicionar o texto com os links
            if (textToShare) {
                shareData.text = textToShare;
            }

            if (navigator.share) {
                navigator.share(shareData);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetch("./candidatos.json").then((response) => {
        response.json().then((dados) => {

            const cidadesSet = new Set();
            
            // Criando a lista de cidades únicas
            dados.candidatos.forEach((candidato) => {
                if (candidato.cidade) {
                    cidadesSet.add(candidato.cidade);
                }
            });
            listaCidades = Array.from(cidadesSet);
            listaCidades.sort((a, b) => a.localeCompare(b)); // Ordena as cidades por ordem alfabética

            // Passa por todas as cidades e cria as options do select
            listaCidades.forEach(cidade => {
                let option = document.createElement('option');
                option.value = cidade;
                option.textContent = cidade;
                selectCidades.appendChild(option);
            });
                
            // Evento escutando dentro do select
            selectCidades.addEventListener('change', () => {
                let divCandidatos = document.querySelector('.candidatos');
                        
                // Pega os candidatos com base no valor do select
                const candidatosFiltrados = dados.candidatos.filter(candidato => candidato.cidade === selectCidades.value);

                // Função para ordenar os candidatos em ordem alfabética
                candidatosFiltrados.sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));

                divCandidatos.innerHTML = ''; // Limpando as div para atualizar os dados exibidos

                // Iterando por cada candidato
                candidatosFiltrados.forEach((candidato) => {
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
                    const botaoCompartilhar = document.createElement('img'); // Cria o botão para tirar print

                    // Definindo id dos elementos do perfil
                    instagramImg.id = 'instagram';
                    facebookImg.id = 'facebook';
                    nomeUrna.id = 'nomeUrna';
                    numeroUrna.id = 'numeroUrna';
                    nomeCompleto.id = 'nomeCompleto';
                    cidade.id = 'cidade';
                    partido.id = 'partidoSigla';
                    botaoCompartilhar.id = 'compartilhar'
                    
                    // Escrevendo os dados nas variáveis
                    foto.src = candidato.linkFoto;
                    nomeUrna.textContent = candidato.nomeUrna.toUpperCase();
                    numeroUrna.textContent = candidato.numUrna;
                    cidade.textContent = candidato.cidade;
                    partido.textContent = `${candidato.partido} - ${candidato.siglaPartido.toUpperCase()}`;

                    // Expressão Regular para deixar as primeiras letras maiúsculas do NomeCompleto
                    const capitalize = candidato.nomeCompleto.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
                    nomeCompleto.textContent = capitalize;

                    // Verificar se o Instagram está definido
                    if (candidato.instagram) {
                        instagramLink.href = candidato.instagram;
                        instagramImg.src = 'images/instagram.svg';
                        instagramLink.appendChild(instagramImg);
                        perfilDiv.appendChild(instagramLink);
                    } else {
                        facebookImg.id = 'uniqueIcon'
                    }

                    // Verificar se o Facebook está definido
                    if (candidato.facebook) {
                        facebookLink.href = candidato.facebook;
                        facebookImg.src = 'images/facebook.svg';
                        facebookLink.appendChild(facebookImg);
                        perfilDiv.appendChild(facebookLink);
                    } else {
                        instagramImg.id = 'uniqueIcon'
                    }

                    // Adiciona o botão para tirar print
                    botaoCompartilhar.src = 'images/shareIcon.svg';
                    botaoCompartilhar.addEventListener('click', () => getPrint(perfilDiv, facebookLink, instagramLink)); // Chama getPrint ao clicar
                    perfilDiv.appendChild(botaoCompartilhar); // Adiciona o botão ao perfilDiv

                    // Joga os dados tudo dentro da div 'perfilDiv'
                    perfilDiv.appendChild(foto);
                    perfilDiv.appendChild(nomeUrna);
                    perfilDiv.appendChild(numeroUrna);
                    perfilDiv.appendChild(nomeCompleto);
                    perfilDiv.appendChild(cidade);
                    perfilDiv.appendChild(partido);

                    divCandidatos.appendChild(perfilDiv); // Exibe tudo na tela
                });
            });
        });
    });
});