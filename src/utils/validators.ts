export const isEmailValid = (email: string) => {
  return email.includes("@");
};

export const isEmpty = (value: string) => {
  return value.trim() === "";
};
