document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-twk');
  const nomeInput = document.getElementById('nome');
  const telefoneInput = document.getElementById('telefone');
  const dataNascimentoInput = document.getElementById('data_nascimento');
  const cidadeInput = document.getElementById('cidade');
  const estadoInput = document.getElementById('estado');
  const privacyCheckbox = document.getElementById('privacy');
  const checkoutBox = document.querySelector('.checkout-box'); // Para o checkbox de privacidade

  // Array de campos que precisam de validação de preenchimento
  const fieldsToValidate = [nomeInput, telefoneInput, dataNascimentoInput, cidadeInput, estadoInput];

  // --- Funções de formatação ---

  // Função genérica para remover números e limitar tamanho
  function formatText(inputElement, maxLength) {
    inputElement.addEventListener('input', function() {
      this.value = this.value.replace(/\d/g, ''); // Remove números
      if (this.value.length > maxLength) {
        this.value = this.value.slice(0, maxLength);
      }
    });
  }

  formatText(nomeInput, 20);
  formatText(cidadeInput, 20);
  formatText(estadoInput, 15); // Estado geralmente é menor

  telefoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

    let formattedValue = '';
    if (value.length > 0) formattedValue = '(' + value.substring(0, 2);
    if (value.length > 2) formattedValue += ') ' + value.substring(2, 7);
    if (value.length > 7) formattedValue += '-' + value.substring(7, 11);
    e.target.value = formattedValue;
  });

  // --- FUNÇÃO dataNascimentoInput CORRIGIDA ---
  dataNascimentoInput.addEventListener('input', function(e) {
    let value = e.target.value; // Pega o valor atual
    let originalLength = value.length; // Guarda o tamanho original

    // Remove tudo que não é dígito para a lógica de formatação
    value = value.replace(/\D/g, '');

    // Limita a 8 dígitos (DDMMAAAA)
    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    let formattedValue = value;

    // Adiciona as barras apenas se o comprimento for apropriado
    if (value.length > 4) {
      formattedValue = `${value.substring(0, 2)}/${value.substring(2, 4)}/${value.substring(4)}`;
    } else if (value.length > 2) {
      formattedValue = `${value.substring(0, 2)}/${value.substring(2)}`;
    }

    // Atualiza o valor do input
    e.target.value = formattedValue;

    // Opcional: Reposicionar o cursor se uma barra foi adicionada automaticamente
    // Isso melhora a experiência do usuário, especialmente em dispositivos móveis
    if (formattedValue.length > originalLength && (formattedValue.charAt(originalLength) === '/' || formattedValue.charAt(originalLength -1) === '/')) {
        // Se uma barra foi adicionada e o cursor estava antes dela, move o cursor para depois da barra
        e.target.setSelectionRange(formattedValue.length, formattedValue.length);
    }
  });
  // --- FIM DA FUNÇÃO dataNascimentoInput CORRIGIDA ---


  // --- Lógica de Validação e Envio do Formulário ---

  form.addEventListener('submit', function(e) {
    e.preventDefault(); // IMPEDE O ENVIO PADRÃO DO FORMULÁRIO

    let isFormValid = true;
    const invalidFields = []; // Para coletar os campos inválidos

    // Remove classes 'invalid' de todos os campos antes de revalidar
    fieldsToValidate.forEach(field => field.classList.remove('invalid'));
    checkoutBox.classList.remove('invalid'); // Remove do container do checkbox também

    // 1. Validação de campos vazios
    fieldsToValidate.forEach(field => {
      if (field.value.trim() === '') {
        isFormValid = false;
        invalidFields.push(field);
      }
    });

    // 2. Validação de formato do telefone
    const telefonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (telefoneInput.value && !telefonePattern.test(telefoneInput.value)) {
        isFormValid = false;
        invalidFields.push(telefoneInput);
    }

    // 3. Validação de formato da data de nascimento
    const dataPattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (dataNascimentoInput.value && !dataPattern.test(dataNascimentoInput.value)) {
        isFormValid = false;
        invalidFields.push(dataNascimentoInput);
    }

    // 4. Validação do checkbox de privacidade
    if (!privacyCheckbox.checked) {
      isFormValid = false;
      invalidFields.push(checkoutBox); // Adiciona o container para estilizar
    }

    // --- Ação com base na validação ---
    if (isFormValid) {
      console.log('Formulário válido! Enviando...');

      // Coleta os dados do formulário
      const formData = new FormData(form);
      const url = form.action; // Pega a URL do atributo action do formulário

      // Envia o formulário usando a API Fetch
      fetch(url, {
        method: 'POST',
        body: formData, // FormData já formata para application/x-www-form-urlencoded
      })
      .then(response => {
        if (response.ok) {
          console.log('Formulário enviado com sucesso para Sheet Monkey!');
          // --- REDIRECIONAMENTO PARA O JOGO ---
          window.location.href = 'https://twkgamerace.netlify.app';
        } else {
          // Se a resposta não for OK (ex: status 4xx, 5xx )
          console.error('Erro ao enviar formulário para Sheet Monkey:', response.status, response.statusText);
          // Opcional: Tentar ler a mensagem de erro do corpo da resposta
          return response.text().then(text => {
            console.error('Detalhes do erro:', text);
            alert('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente. Detalhes: ' + text.substring(0, 100) + '...');
          });
        }
      })
      .catch(error => {
        // Erros de rede ou problemas antes da resposta do servidor
        console.error('Erro de rede ou ao enviar formulário:', error);
        alert('Ocorreu um erro de conexão. Verifique sua internet e tente novamente.');
      });

    } else {
      console.log('Formulário inválido. Mostrando erros...');

      // Adiciona a classe 'invalid' aos campos inválidos e remove após um tempo
      invalidFields.forEach(element => {
        element.classList.add('invalid');
        // Para campos de input, você pode focar no primeiro campo inválido
        if (element.tagName === 'INPUT' && !element.readOnly) {
            element.focus();
        }
        setTimeout(() => {
          element.classList.remove('invalid');
        }, 1500); // Remove a classe 'invalid' após 1.5 segundos
      });
      // Para o checkbox, você pode querer um feedback visual diferente,
      // mas a classe 'invalid' no checkoutBox já ajuda com CSS.
    }
  });
});
