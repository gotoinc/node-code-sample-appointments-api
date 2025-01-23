import { HashingService } from './hashing.service';

describe('AuthService', () => {
  let service: HashingService;

  beforeEach(async () => {
    service = new HashingService();
  });

  it('should hash password', () => {
    const password = 'password';
    const hashedPassword = service.hash(password);
    expect(hashedPassword).not.toBeNull();
  });
});
