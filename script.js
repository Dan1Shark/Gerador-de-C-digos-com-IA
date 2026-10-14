// 1. Pegando os elementos da tela
const botaoGerar = document.getElementById('gerar-btn');
const promptInput = document.getElementById('prompt-input');
const codigoSaida = document.getElementById('codigo-saida');
const previewFrame = document.getElementById('preview-frame');

// SUA CHAVE DA GROQ NÃO ESTÁ AQUI POR SEGURANÇA


// 2. Ouvindo o clique do usuário no botão
botaoGerar.addEventListener('click', async () => {
    const textoDoPedido = promptInput.value;

    if (!textoDoPedido.trim()) {
        alert('Por favor, digite o que você quer criar!');
        return;
    }

    codigoSaida.textContent = '// A IA está criando o seu código, aguarde... 🤖';

    try {
        const url = 'https://api.groq.com/openai/v1/chat/completions';
        
        // 3. Montando o objeto de pedido com o modelo escolhido
        const dadosDoPedido = {
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "system",
                    content: "Você é um gerador de código Web. Retorne APENAS o código HTML puro (incluindo CSS dentro da tag <style>), sem formatação em markdown (como ```html), sem explicações extras e sem saudações."
                },
                {
                    role: "user",
                    content: `Crie a seguinte animação/elemento em HTML/CSS: ${textoDoPedido}`
                }
            ],
            temperature: 0.7
        };

        // 4. Enviando a requisição para a Groq via fetch
        const resposta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(dadosDoPedido)
        });

        const resultado = await resposta.json();
        
        if (resultado.error) {
            throw new Error(resultado.error.message);
        }

        let codigoGerado = resultado.choices[0].message.content;

        // Limpeza caso venham crases de markdown
        codigoGerado = codigoGerado.replace(/```html/g, '').replace(/```/g, '').trim();

        // 5. Exibindo o código na tela e rodando no iframe
        codigoSaida.textContent = codigoGerado;

        const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(codigoGerado);
        frameDoc.close();

    } catch (erro) {
        console.error('Erro na requisição:', erro);
        codigoSaida.textContent = '// Ops! Ocorreu um erro ao gerar o código. Verifique o console (F12).';
    }
});