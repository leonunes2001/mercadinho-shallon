document.addEventListener('DOMContentLoaded', function () {
    const produtos = document.querySelectorAll('.produto');
    const linkCarrinho = document.getElementById('link-carrinho');
    const carrinhoSection = document.getElementById('carrinho');
    const itensCarrinho = document.getElementById('itens-carrinho');
    const totalCarrinho = document.getElementById('total-carrinho');

    let carrinho = [];

    // Atualiza o carrinho e o total
    function atualizarCarrinho() {
        itensCarrinho.innerHTML = '';
        let total = 0;

        carrinho.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade}`;
            itensCarrinho.appendChild(li);
            total += item.preco * item.quantidade;
        });

        totalCarrinho.textContent = `Total: R$ ${total.toFixed(2)}`;
        linkCarrinho.textContent = `Carrinho (${carrinho.length})`;
    }

    // Adiciona um produto ao carrinho
    produtos.forEach(produto => {
        const botaoAdicionar = produto.querySelector('button');
        const nomeProduto = produto.querySelector('p').textContent.split(' - ')[0];
        const precoProduto = parseFloat(produto.querySelector('span').textContent.replace('R$ ', '').replace(',', '.'));

        botaoAdicionar.addEventListener('click', function () {
            // Verifica se o produto já está no carrinho
            const produtoExistente = carrinho.find(item => item.nome === nomeProduto);
            if (produtoExistente) {
                produtoExistente.quantidade++;
            } else {
                carrinho.push({ nome: nomeProduto, preco: precoProduto, quantidade: 1 });
            }

            atualizarCarrinho();
        });
    });

    // Exibe o carrinho quando o link for clicado
    linkCarrinho.addEventListener('click', function () {
        carrinhoSection.style.display = carrinhoSection.style.display === 'none' ? 'block' : 'none';
    });

    // Finaliza a compra e envia via WhatsApp
    document.getElementById("finalizar-compra").addEventListener("click", function() {
        const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');
        const rua = document.getElementById("rua").value;
        const bairro = document.getElementById("bairro").value;
        const numero = document.getElementById("numero").value;
        const cep = document.getElementById("cep").value;

        if (!pagamentoSelecionado || !rua || !bairro || !numero || !cep) {
            alert("Por favor, preencha todos os campos antes de finalizar a compra.");
            return;
        }

        const pagamento = pagamentoSelecionado.value;
        const itensCarrinho = getItensCarrinho(); // Função para obter os itens no carrinho
        const total = calcularTotal(itensCarrinho); // Função para calcular o total do carrinho

        // Criar mensagem de pedido
        let mensagem = `Pedido do Mercadinho Shallon:
Endereço de entrega:
Rua: ${rua}, Bairro: ${bairro}, Número: ${numero}, CEP: ${cep}

Itens:
`;

        // Adiciona cada item do carrinho à mensagem
        itensCarrinho.forEach(item => {
            mensagem += `${item.quantidade}x ${item.nome} - R$ ${item.preco.toFixed(2)} cada\n`;
        });

        mensagem += `\nTotal: R$ ${total.toFixed(2)}
Forma de pagamento: ${pagamento}`;

        // Gerar link do WhatsApp
        const whatsappLink = `https://wa.me/5582987181068?text=${encodeURIComponent(mensagem)}`;
        
        // Enviar via WhatsApp (abre diretamente a conversa)
        window.open(whatsappLink, '_blank');
    });

    // Função para obter os itens do carrinho
    function getItensCarrinho() {
        return carrinho;
    }

    // Função para calcular o total do carrinho
    function calcularTotal(itens) {
        return itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }
});
