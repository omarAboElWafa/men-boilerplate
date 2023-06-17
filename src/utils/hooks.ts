import bcrypt from 'bcryptjs';
import { HASH_SALT_ROUNDS, JWT_SECRET } from './config';


export const hashPassword = async (password :string) => {
    const salt = await bcrypt.genSalt(HASH_SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
}

