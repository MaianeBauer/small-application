import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmacaoSenha: "",
  });

  const [flipCard, setFlipCard] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const unavailableEmails = [
      "teste@exemplo.com",
      "joao@exemplo.com",
      "maria@acme.net",
    ];
    return emailRegex.test(email) && !unavailableEmails.includes(email);
  };

  const validatePassword = (senha) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(senha);
    const hasLowerCase = /[a-z]/.test(senha);
    const hasNumber = /[0-9]/.test(senha);
    return (
      senha.length >= minLength && hasUpperCase && hasLowerCase && hasNumber
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome) {
      setError("Nome é obrigatório");
      return;
    }
    if (!validateEmail(formData.email)) {
      setError("Email inválido ou indisponível");
      return;
    }
    if (!validatePassword(formData.senha)) {
      setError(
        "A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e números"
      );
      return;
    }
    if (formData.senha !== formData.confirmacaoSenha) {
      setError("As senhas não coincidem");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "ECA1AB4CE8583613A2C759B445E98",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message || "Cadastro realizado com sucesso");
        setError("");
      } else {
        setError(result.message || "Erro no cadastro");
        setSuccess("");
      }
    } catch (error) {
      setError("Erro na conexão com o servidor");
      setSuccess("");
    }
  };

  const toggleFlipCard = () => {
    setFlipCard(!flipCard);
  };

  return (
    <div className="main">
      <div className="flip-card" onClick={toggleFlipCard}>
        {flipCard ? "Reset" : "Animate"}
      </div>

      <div className="wrapper">
        <h1 className="left-title">olablbalbla</h1>
        <div className={`contact-wrapper`}>
          <div className={`envelope ${flipCard ? "active" : ""}`}>
            <div className="back paper"></div>
            <div className="content">
              <div className="form-wrapper">
                <form onSubmit={handleSubmit}>
                  <div className="top-wrapper">
                    <h1> Cadastre-se</h1>
                    <br></br>
                    <div className="input">
                      <label>Nome</label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="input">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="bottom-wrapper">
                    <div className="input">
                      <label>Senha</label>
                      <input
                        type="password"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="input">
                      <label>Confirme a senha</label>
                      <input
                        type="password"
                        name="confirmacaoSenha"
                        value={formData.confirmacaoSenha}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="submit">
                      <button type="submit" className="submit-card">
                        {flipCard ? "Send Mail" : "Cadastrar"}
                      </button>
                    </div>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                  </div>
                </form>
              </div>
            </div>
            <div className="front paper"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
