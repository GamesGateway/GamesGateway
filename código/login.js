document.addEventListener('DOMContentLoaded', function() {
    var passwordField1 = document.getElementById('password-field1');
    var togglePasswordButton1 = document.getElementById('togglePassword1');

    togglePasswordButton1.addEventListener('click', function (e) {
        // toggle the type attribute
        const type = passwordField1.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField1.setAttribute('type', type);
        // toggle the eye / eye slash icon
        this.children[0].classList.toggle('bi-eye');
        this.children[0].classList.toggle('bi-eye-slash');
    });
});


/*Validar preenchimento do formulario */
function validarFormulario() {
    const senha1 = document.getElementById('password-field1').value;
    const email = document.getElementById('email').value;

    // Validar campos (exemplo simples)
    if ( !email || !senha1 ) {
        alert('Por favor, preencha todos os campos.');
        return false;
    }
    else {
        return true;
    }
}

// Adicionar função para um evento de envio ao formulário (no HTML)
document.getElementById('formulario').addEventListener('submit', function (event) {
    if (!validarFormulario()) {
        event.preventDefault(); // Impede o envio do formulário
    }
    else {
        event.preventDefault(); // Impede o envio do formulário padrão

        const emailUsuario = document.getElementById('email').value;
        const senhaUsuario = document.getElementById('password-field1').value;

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: emailUsuario,
                senha: senhaUsuario,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Login realizado com sucesso!');
                    // Redirecionar para a página principal ou painel do usuário
                    window.location.href = "index.html";
                } else {
                    alert('Email ou senha incorretos.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
});
