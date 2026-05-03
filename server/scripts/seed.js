/**
 * Creates default roles (if missing), an admin user, and a normal user for local dev.
 * Usage: from repo root, set MONGODB_URI and SECRET_KEY in .env, then:
 *   cd server && npm run seed
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDb } from '../src/db.js';
import { Role } from '../src/models/Role.js';
import { User } from '../src/models/User.js';
import { UserRole } from '../src/models/UserRole.js';
import { hashPassword } from '../src/utils/password.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  await connectDb();

  for (const [id, name] of [
    [1, 'admin'],
    [2, 'user'],
  ]) {
    await Role.findOneAndUpdate(
      { _id: id },
      { $setOnInsert: { name } },
      { upsert: true }
    );
  }

  const adminEmail = 'admin@taskboard.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Admin User',
      email: adminEmail,
      password_hash: hashPassword('admin123'),
    });
    await UserRole.create({ user_id: admin._id, role_id: 1 });
    await UserRole.create({ user_id: admin._id, role_id: 2 });
    console.log('Created admin:', adminEmail, '/ admin123');
  } else {
    console.log('Admin already exists:', adminEmail);
  }

  const userEmail = 'user@taskboard.com';
  let user = await User.findOne({ email: userEmail });
  if (!user) {
    user = await User.create({
      name: 'Regular User',
      email: userEmail,
      password_hash: hashPassword('user123'),
    });
    await UserRole.create({ user_id: user._id, role_id: 2 });
    console.log('Created user:', userEmail, '/ user123');
  } else {
    console.log('User already exists:', userEmail);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
