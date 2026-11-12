//Constantes dos elementos que vamos interagir;
const selectUf = document.getElementById("uf")
const inputCidade = document.getElementById('cidade');
const inputRua = document.getElementById('rua');

const btnBuscar = document.getElementById('btnBuscar');
const divMensagem = document.getElementById('mensagem');
const divResultado = document.getElementById('resultado');

const containerListaResultados = document.getElementById("listaResultados")

btnBuscar.addEventListener('click',buscarEndereco);

[selectUf,inputCidade,inputRua].forEach(campo => {
    campo.addEventListener('keypress',(e)=>{
        if (e.key == "Enter"){
            buscarEndereco()
        }
    })
});


//Função principal para buscar cep
async function buscarEndereco()  {
    const valorUf = selectUf.value.trim();
    const valorCidade = inputCidade.value.trim();
    const valorRua = inputRua.value.trim();
    esconderElemento(divMensagem);
    esconderElemento(divResultado);
    containerListaResultados.innerHTML="";

    //Verificação uf
    if (!valorUf) {
        mostrarMensagem('Por favor, selecione um estado (UF)','erro');
        selectUf.focus();
        return;
    }
    //Verificação cidade
    if (valorCidade.length<3){
        mostrarMensagem("Por favor, insira um valor para cidade com no mínimo 3 caracteres");
        inputCidade.focus()
        return;
    }
    
    //Verificação Logradouro
    if(valorRua.length<3) {
        mostrarMensagem("Por favor, insira um valor para rua/logradouro com no mínimo 3 caracteres");
        inputCidade.focus()
        return;
    }

    mostrarMensagem("Buscando CEP...","info")

    try {
        const cidadeFormatada = encodeURIComponent(valorCidade)
        const ruaFormatada = encodeURIComponent(valorRua)
        //Montando URL de requisição
        const URL = `https://viacep.com.br/ws/${valorUf}/${cidadeFormatada}/${ruaFormatada}/json/`;

        const resposta = await fetch(URL);
        if (!resposta.ok) {
            throw new Error(`Falha na requisição; Código de status: ${resposta.status}`);
        }
        const enderecos = await resposta.json();
    
        if (!Array.isArray(enderecos) || enderecos.length===0) {
            mostrarMensagem("Nenhum CEP/endereço encontrado para os dados informados",'erro');
            return;
        }

        enderecos.forEach((itemEndereco) => {
            var card = document.createElement('div')
            card.className = 'item-endereco'
            card.innerHTML = `
                <p class="destaque-cep">CEP: ${itemEndereco.cep}</p>
                <p><b>Logradouro:</b> ${itemEndereco.logradouro || 'Não informado'}</p>
                <p><b>Bairro:</b> ${itemEndereco.bairro || 'Não informado'}</p>
                <p><b>Cidade:</b> ${itemEndereco.localidade} - ${itemEndereco.uf}</p>
                <p><b>Complemento:</b> ${itemEndereco.complemento ? itemEndereco.complemento : "Nenhum"}</p>
            `;
            containerListaResultados.appendChild(card);
        });

        esconderElemento(divMensagem);
        exibirElemento(divResultado);

    } catch(erro) {
        console.error("Erro na requisição: ", erro)
        mostrarMensagem("Tente novamente mais tarde.","erro");
    }
}

//Funções auxiliares
function esconderElemento(elem) {
    elem.classList.add('oculto');
}

function exibirElemento(elem) {
    elem.classList.remove('oculto');
}

function mostrarMensagem(texto, tipo){
    divMensagem.textContent=texto;
    divMensagem.className=`mensagem ${tipo}`;
}