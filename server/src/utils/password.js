import bcrypt from 'bcryptjs';

export function hashPassword(plain) {
  return bcrypt.hashSync(plain, 10);
}

export function verifyPassword(plain, hashed) {
  if (!plain || !hashed) return false;
  try {
    return bcrypt.compareSync(plain, hashed);
  } catch {
    return false;
  }
}
