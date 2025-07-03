document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-twk');
  const nomeInput = document.getElementById('nome');
  const telefoneInput = document.getElementById('telefone');
  const dataNascimentoInput = document.getElementById('data_nascimento');
  const cidadeInput = document.getElementById('cidade');
  const estadoInput = document.getElementById('estado');
  const privacyCheckbox = document.getElementById('privacy');
  const checkoutBox = document.querySelector('.checkout-box');

  const fieldsToValidate = [nomeInput, telefoneInput, dataNascimentoInput, cidadeInput, estadoInput];

  // --- Funções de formatação ---
  nomeInput.addEventListener('input', function() {
    this.value = this.value.replace(/\d/g, ''); // Remove números
    if (this.value.length > 20) this.value = this.value.slice(0, 20);
  });

  cidadeInput.addEventListener('input', function() {
    this.value = this.value.replace(/\d/g, ''); // Remove números
    if (this.value.length > 20) this.value = this.value.slice(0, 20);
  });

  estadoInput.addEventListener('input', function() {
    this.value = this.value.replace(/\d/g, ''); // Remove números
    if (this.value.length > 15) this.value = this.value.slice(0, 20);
  });

  telefoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    let formattedValue = '';
    if (value.length > 0) formattedValue = '(' + value.substring(0, 2);
    if (value.length > 2) formattedValue += ') ' + value.substring(2, 7);
    if (value.length > 7) formattedValue += '-' + value.substring(7, 11);
    e.target.value = formattedValue;
  });

  dataNascimentoInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 4) value = `${value.substring(0, 2)}/${value.substring(2, 4)}/${value.substring(4)}`;
    else if (value.length > 2) value = `${value.substring(0, 2)}/${value.substring(2)}`;
    e.target.value = value;
  });


  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isFormValid = true;
    const invalidFields = []; 

    fieldsToValidate.forEach(field => field.classList.remove('invalid'));
    checkoutBox.classList.remove('invalid');

    fieldsToValidate.forEach(field => {
      if (field.value.trim() === '') {
        isFormValid = false;
        invalidFields.push(field);
      }
    });

    const telefonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (telefoneInput.value && !telefonePattern.test(telefoneInput.value)) {
        isFormValid = false;
        invalidFields.push(telefoneInput);
    }

    const dataPattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (dataNascimentoInput.value && !dataPattern.test(dataNascimentoInput.value)) {
        isFormValid = false;
        invalidFields.push(dataNascimentoInput);
    }

    if (!privacyCheckbox.checked) {
      isFormValid = false;
      invalidFields.push(checkoutBox);
    }

  
    if (isFormValid) {
      console.log('Formulário válido! Enviando...');
      form.submit();
    } else {

      console.log('Formulário inválido. Mostrando erros...');
      
      invalidFields.forEach(element => {
  
        element.classList.add('invalid');


        setTimeout(() => {
          element.classList.remove('invalid');
        }, 1500);
      });
    }
  });
});
