import { LoginRequest } from "../../features/auth/interfaces/login.interface";
import { RegisterRequest } from "../../features/auth/interfaces/register.interface";

export const registerRequest: RegisterRequest = {
  name: 'John Doe',
  email: 'john.doe@email.com',
  password: 'JohnDoePassword0!',
  confirmedPassword: 'JohnDoePassword0!',
  phone: '+1202-555-0125'
};

export const loginRequest: LoginRequest = { email: 'john.doe@email.com', password: 'JohnDoePassword0!'};