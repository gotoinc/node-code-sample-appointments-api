import { HashingService } from './hashing.service';

describe('HashingService', () => {
  let hashingService: HashingService;

  beforeEach(() => {
    hashingService = new HashingService();
  });

  describe('hash', () => {
    it('should generate a hash with salt', () => {
      const password = 'testPassword123';
      const hashedPassword = hashingService.hash(password);

      const [hash, salt] = hashedPassword.split(':');

      expect(hash).toBeTruthy();
      expect(salt).toBeTruthy();
      expect(hashedPassword.split(':').length).toBe(2);
    });

    it('should generate different hashes for the same password', () => {
      const password = 'testPassword123';
      const hash1 = hashingService.hash(password);
      const hash2 = hashingService.hash(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verify', () => {
    it('should return true for correct password', () => {
      const password = 'testPassword123';
      const hashedPassword = hashingService.hash(password);

      const isValid = hashingService.verify(password, hashedPassword);

      expect(isValid).toBe(true);
    });

    it('should return false for incorrect password', () => {
      const password = 'testPassword123';
      const incorrectPassword = 'wrongPassword';
      const hashedPassword = hashingService.hash(password);

      const isValid = hashingService.verify(incorrectPassword, hashedPassword);

      expect(isValid).toBe(false);
    });

    it('should return false for malformed hash', () => {
      const password = 'testPassword123';
      const malformedHash = 'invalidHash';

      const isValid = hashingService.verify(password, malformedHash);

      expect(isValid).toBe(false);
    });

    it('should return false when salt is missing', () => {
      const password = 'testPassword123';
      const incompleteHash = 'partialHash';

      const isValid = hashingService.verify(password, incompleteHash);

      expect(isValid).toBe(false);
    });
  });
});
