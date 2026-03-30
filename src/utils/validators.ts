// Expressão regular para validar formato de e-mail
const emailRegex = /\S+@\S+\.\S+/;

/**
 * Validação para o formulário de Cadastro
 */
export const validateRegisterForm = (formData: any) => {
  let errors: any = {};

  // Validar Nome
  if (!formData.nome || formData.nome.trim() === "") {
    errors.nome = "Nome é obrigatório";
  }

  // Validar E-mail
  if (!formData.email) {
    errors.email = "E-mail é obrigatório";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "E-mail inválido";
  }

  // Validar Contato
  if (!formData.contato) {
    errors.contato = "Contato é obrigatório";
  }

  // Validar Senha
  if (!formData.senha) {
    errors.senha = "Senha é obrigatória";
  } else if (formData.senha.length < 6) {
    errors.senha = "A senha deve ter pelo menos 6 caracteres";
  }

  // Validar Confirmação de Senha
  if (!formData.confirmar) {
    errors.confirmar = "Confirme sua senha";
  } else if (formData.senha !== formData.confirmar) {
    errors.confirmar = "As senhas não coincidem";
  }

  return errors;
};

/**
 * Validação para o formulário de Login
 * Atende ao pedido da líder: feedback para campo vazio ou senha inválida
 */
export const validateLoginForm = (formData: any) => {
  let errors: any = {};

  if (!formData.email) {
    errors.email = "E-mail é obrigatório";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "E-mail inválido";
  }

  if (!formData.senha) {
    errors.senha = "Senha é obrigatória";
  } else if (formData.senha.length < 6) {
    errors.senha = "Senha inválida (mínimo 6 caracteres)";
  }

  return errors;
};