/*Funções para visualizar senha dos input's Senha e Repita Senha*/
document.addEventListener('DOMContentLoaded', function () {
    var passwordField1 = document.getElementById('password-field1');
    var togglePasswordButton1 = document.getElementById('togglePassword1');
    var passwordField2 = document.getElementById('password-field2');
    var togglePasswordButton2 = document.getElementById('togglePassword2');

    function togglePasswordVisibility() {
        const type1 = passwordField1.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField1.setAttribute('type', type1);
        togglePasswordButton1.children[0].classList.toggle('bi-eye');
        togglePasswordButton1.children[0].classList.toggle('bi-eye-slash');

        const type2 = passwordField2.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField2.setAttribute('type', type2);
        togglePasswordButton2.children[0].classList.toggle('bi-eye');
        togglePasswordButton2.children[0].classList.toggle('bi-eye-slash');
    }

    togglePasswordButton1.addEventListener('click', togglePasswordVisibility);
    togglePasswordButton2.addEventListener('click', togglePasswordVisibility);
});


/*Validar preenchimento do formulario */
function validarFormulario() {
    const senha1 = document.getElementById('password-field1').value;
    const senha2 = document.getElementById('password-field2').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;

    // Validar campos (exemplo simples)
    if (!nome || !email || !senha1 || !senha2) {
        alert('Por favor, preencha todos os campos.');
        return false;
    } else if (senha1 !== senha2) {
        alert('As senhas não coincidem. Tente novamente.');
        return false;
    } else {
        return true;
    }
}

// Adicionar função para um evento de envio ao formulário (no HTML)

document.getElementById('formulario').addEventListener('submit', function (event) {
    // Chame a função validarFormulario() e verifique o valor de retorno
    if (!validarFormulario()) {
        event.preventDefault(); // Impede o envio do formulário
    } else {
        // Se a validação for bem-sucedida, envie os dados para o servidor
        event.preventDefault(); // Ainda queremos prevenir o envio do formulário padrão
        const nomeUsuario = document.getElementById('nome').value;
        const emailUsuario = document.getElementById('email').value;
        const senhaUsuario = document.getElementById('password-field1').value;

        fetch('http://localhost:3000/inserirDados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: nomeUsuario,
                email: emailUsuario,
                senha: senhaUsuario,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Cadastro realizado com sucesso!');
                    // Redirecionar para a página Login.html
                    window.location.href = 'Login.html';
                } else {
                    alert('Ocorreu um erro ao inserir os dados.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
});
