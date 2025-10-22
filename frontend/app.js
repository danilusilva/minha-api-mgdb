// app.js
document.addEventListener('DOMContentLoaded', () => {
  
  const form = document.getElementById('registrationForm');
  const messageDiv = document.getElementById('message');

  form.addEventListener('submit', async (event) => {
    // 1. Impede o comportamento padrão do formulário (que recarrega a página)
    event.preventDefault();

    // 2. Limpa mensagens anteriores
    messageDiv.innerHTML = '';
    messageDiv.className = '';

    // 3. Pega os valores dos inputs
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;

    // 4. Monta o objeto de dados
    const userData = {
      nome: name,
      email: email,
      idade: parseInt(age) // Garante que a idade seja um número
    };

    try {
      // 5. Envia a requisição para o Backend (API)
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData) // Converte o objeto JS para uma string JSON
      });

      // 6. Converte a resposta do servidor de JSON para objeto
      const data = await response.json();

      // 7. Verifica se a resposta foi bem-sucedida (status 201)
      if (response.status === 201) {
        messageDiv.innerHTML = data.message;
        messageDiv.className = 'success';
        form.reset(); // Limpa o formulário
      } else {
        // Mostra mensagens de erro vindas do backend (ex: e-mail duplicado)
        messageDiv.innerHTML = data.message;
        messageDiv.className = 'error';
      }

    } catch (error) {
      // 8. Trata erros de rede (ex: API fora do ar)
      console.error('Erro na requisição:', error);
      messageDiv.innerHTML = 'Não foi possível conectar ao servidor. Tente novamente.';
      messageDiv.className = 'error';
    }
  });
});