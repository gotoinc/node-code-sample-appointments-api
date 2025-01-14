export class UserEntity {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'doctor' | 'patient';

  constructor(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role: 'doctor' | 'patient',
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
