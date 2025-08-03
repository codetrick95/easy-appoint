// Máscaras para formatação de campos
export const maskCPF = (value: string) => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara de CPF (000.000.000-00)
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14); // Limita a 14 caracteres (incluindo pontos e hífen)
};

export const maskCEP = (value: string) => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara de CEP (00000-000)
  return numbers
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 9); // Limita a 9 caracteres (incluindo hífen)
};

export const maskPhone = (value: string) => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara de telefone ((00) 00000-0000)
  if (numbers.length <= 10) {
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 14); // Limita a 14 caracteres
  } else {
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15); // Limita a 15 caracteres
  }
};

export const maskCarteirinha = (value: string) => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara de carteirinha (00000000000000000000)
  return numbers.slice(0, 20); // Limita a 20 dígitos
};

// Funções para remover máscaras
export const unmaskCPF = (value: string) => {
  return value.replace(/\D/g, '');
};

export const unmaskCEP = (value: string) => {
  return value.replace(/\D/g, '');
};

export const unmaskPhone = (value: string) => {
  return value.replace(/\D/g, '');
};

export const unmaskCarteirinha = (value: string) => {
  return value.replace(/\D/g, '');
};

// Validação de CPF
export const validateCPF = (cpf: string) => {
  const cleanCPF = unmaskCPF(cpf);
  
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

// Validação de CEP
export const validateCEP = (cep: string) => {
  const cleanCEP = unmaskCEP(cep);
  return cleanCEP.length === 8;
};

// Validação de telefone
export const validatePhone = (phone: string) => {
  const cleanPhone = unmaskPhone(phone);
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}; 