export const validateRegisterForm = (formData: any) => {
  let errors: any = {};

  // Validar Nome
  if (!formData.nome || formData.nome.trim() === "") {
    errors.nome = "Nome é obrigatório";
  }

  // Validar E-mail
  const emailRegex = /\S+@\S+\.\S+/;
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

  // Validar Confirmação
  if (!formData.confirmar) {
    errors.confirmar = "Confirme sua senha";
  } else if (formData.senha !== formData.confirmar) {
    errors.confirmar = "As senhas não coincidem";
  }

  return errors;
};
