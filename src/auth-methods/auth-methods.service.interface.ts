export interface IAuthMethodsService {
  createNewUser(
    email: string,
    firstName: string,
    lastName: string,
    roleName: string,
  ): Promise<any>;
}
