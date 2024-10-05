//v1
let selectCidades = document.querySelector('#cidades');
let listaCidades = [];
let sistema;
let modal = document.querySelector('.modal')

let voltarBtn = document.querySelector('#closeBtn').addEventListener('click',() => {
    modal.style.display = 'none'
});

function verificaRedes(facebookLink, instagramLink) {
    console.log('Verifcou rede social')

    let strFace = 'Facebook: '
    let strInsta = 'Instagram: '

    facebookLink = facebookLink || ''; // Reinicializa a cada chamada
    instagramLink = instagramLink || '';

    if(facebookLink == '') {
        strFace = ''
    }
    if(instagramLink == '') {
        strInsta = ''
    }

    let textToShare;
    
    if (instagramLink || facebookLink) {
        textToShare = (strFace + facebookLink) + '\n' +  (strInsta + instagramLink);
    }
    return textToShare;
}


function detectaSistema() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    console.log('Detectou sistema')

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
    console.log(sistema)
    return sistema;
}

function exibeModal(div, facebook, instagram) {

    let linkFace = facebook;
    let linkInsta = instagram;

    let perfilDiv = div
    let sistemaAtual = detectaSistema()

    if (sistemaAtual == 'IOS')  {
        async function shareIOS() {

            try {
                let blobImage = await getPrint(perfilDiv);
    
                console.log(blobImage)
                let textToShare = verificaRedes(linkFace, linkInsta);
                console.log(textToShare)
                shareData = {
                    text: textToShare,
                    files: [new File([blobImage], "image.jpeg", { type: "image/jpeg" })]
                }
                
                if (navigator.share) {
                    navigator.share(shareData);
                }
            } catch (err) {
                console.log(err)
            }
        }
        shareIOS();

    } else {
        modal.style.display = 'block'

        let btnImagem = document.getElementById('imagem');
        let btnLinks = document.getElementById('links');

        // Enviar apenas a foto
        btnImagem.addEventListener('click', async () =>  {

            try {
                let blobImage = await getPrint(perfilDiv); // Aguarda a resolução da Promise
                console.log(blobImage)
                let shareData = {
                    files: [new File([blobImage], "image.jpeg", { type: "image/jpeg" })]
                };

                console.log(shareData);
        
                modal.style.display = 'none'
                if (navigator.share) {
                    await navigator.share(shareData); // Aguarda o compartilhamento
                    console.log('Compartilhamento bem-sucedido');
                } else {
                    console.log('API de compartilhamento não suportada');
                }
            } catch (error) {
                console.error('Erro ao compartilhar:', error);
            }
            
        }, {once: true})

        btnLinks.addEventListener('click', () => {
           
            let textToShare = verificaRedes(linkFace, linkInsta);
            
            shareData = {
                text: textToShare
            }
            modal.style.display = 'none'
            if (navigator.share) {
                navigator.share(shareData)
            }
        }, {once: true})
    }

}


async function getPrint(div) {
    
    function base64ToBlob(base64, type = 'image/jpeg') {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type });
    }

    // Aguardar o carregamento da imagem e retornar o blob
    return new Promise((resolve, reject) => {
        html2canvas(div, {
            scale: 2, // Ajuste o valor conforme necessário
            useCORS: true,
            backgroundColor: '#a8a8a8'  
        }).then(canvas => {
            let imagem = canvas.toDataURL("image/jpeg");
            // Remover o prefixo 'data:image/jpeg;base64,' da string
            const base64Data = imagem.split(',')[1];
            let blob = base64ToBlob(base64Data); // Converter Base64 para Blob
            console.log('retornando blob');
            resolve(blob); // Resolver a Promise com o blob
        }).catch(error => {
            console.error('Erro ao gerar canvas:', error);
            reject(error); // Em caso de erro, rejeitar a Promise
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
                    // Joga os dados tudo dentro da div 'perfilDiv'
                    perfilDiv.appendChild(foto);
                    perfilDiv.appendChild(nomeUrna);
                    perfilDiv.appendChild(numeroUrna);
                    perfilDiv.appendChild(nomeCompleto);
                    perfilDiv.appendChild(cidade);
                    perfilDiv.appendChild(partido);

                    // Adiciona o botão para tirar print
                    botaoCompartilhar.src = 'images/shareIcon.svg';
                    botaoCompartilhar.addEventListener('click', () => exibeModal(perfilDiv, facebookLink, instagramLink)); // Chama getPrint ao clicar
                    perfilDiv.appendChild(botaoCompartilhar); // Adiciona o botão ao perfilDiv


                    divCandidatos.appendChild(perfilDiv); // Exibe tudo na tela
                });
            });
        });
    });
});