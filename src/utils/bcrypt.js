import bcrypt from "bcryptjs";
const salt = 15;

export const hashPassword = (plainPass) => {
  return bcrypt.hashSync(plainPass, salt);
};

export const comparePassword = (plainPassword, hashPassword) => {
  return bcrypt.compareSync(plainPassword, hashPassword);
};
