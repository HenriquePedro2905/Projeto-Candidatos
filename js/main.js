//v1
let selectCidades = document.querySelector('#cidades');
let listaCidades = [];
let sistema;
let modal = document.querySelector('.modal')

let voltarBtn = document.querySelector('#closeBtn').addEventListener('click',() => {
    modal.style.display = 'none'
})

function detectaSistema() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if(/android/i.test(userAgent)) {
        sistema = 'Android';
    } else if(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        sistema = 'IOS';
    }else if (/windows/i.test(userAgent)) {
        sistema = 'Windows';
    } else if (/macintosh|mac os x/i.test(userAgent)) {
        sistema = 'macOS';
    } else if (/linux/i.test(userAgent)) {
        sistema = 'Linux';
    }
    return sistema;
}

async function getPrint(div, candidato) {

    let facebookLink = candidato.facebook || ''; // Use empty string if no Facebook link
    let instagramLink = candidato.instagram || ''; // Use empty string if no Instagram link


    function verificaRedes() {
        let strFace = 'Facebook: '
        let strInsta = 'Instagram: '
        if(!facebookLink) {
            strFace = ''
        }
        if(!instagramLink) {
            strInsta = ''
        }
        
        let textToShare = ''
        if (instagramLink || facebookLink) {
            textToShare = (strFace + facebookLink) + '\n' +  (strInsta + instagramLink).trim();
            return textToShare;
        }
    }
    
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
            // Remover o prefixo 'data:image/jpeg;base64,' da string
            const base64Data = imagem.split(',')[1];
            const blob = base64ToBlob(base64Data); // Converter Base64 para Blob
            
            sistema = detectaSistema();
            let links = verificaRedes()

            
            if (sistema == 'Android') {
                
                // if (links != undefined) {
                    modal.style.display = 'block';

                    const compartilharImagem = () => {
                        shareData = ''
                        shareData = {
                            files: [new File([blob], "image.jpeg", { type: "image/jpeg" })],
                        }
                        modal.style.display = 'none';
                        
                        if (navigator.share) {
                            navigator.share(shareData)
                        }
                    }
                    const compartilharLinks = () => {
                        shareData = ''
                        shareData = {
                            text: links
                        }
                        modal.style.display = 'none';
                        
                        if (navigator.share) {
                            navigator.share(shareData)
                        }
                    }
                    document.querySelector('#imagem').removeEventListener('click', compartilharImagem);
                    document.querySelector('#links').removeEventListener('click', compartilharLinks);
                    document.querySelector('#imagem').addEventListener('click', compartilharImagem)
                    document.querySelector('#links').addEventListener('click', compartilharLinks)
                    
                // } else {
                //     // Envia a foto direto se a pessoa não tiver redes socias
                //     shareData = {
                //         files: [new File([blob], "image.jpeg", { type: "image/jpeg" })],
                //     }
                //     modal.style.display = 'none';

                //     if (navigator.share) {
                //         navigator.share(shareData)
                //     }
                // }

            }
            if (sistema == 'IOS') {
                shareData = {
                    text: links,
                    files: [new File([blob], "image.jpeg", { type: "image/jpeg" })],
                };
                if (navigator.share) {
                    navigator.share(shareData);
                }
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
                modal.style.display = 'none'
                        
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
                    const botaoCompartilhar = document.createElement('img');

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
                    botaoCompartilhar.addEventListener('click', () => getPrint(perfilDiv,candidato)); // Chama getPrint ao clicar
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