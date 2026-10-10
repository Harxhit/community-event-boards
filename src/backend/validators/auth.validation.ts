import { z } from 'zod';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-])[A-Za-z\d@$!%*?&#^()_\-]{8,}$/;

const signInValidation = z.object({
  email: z
    .string()
    .trim()
    .regex(emailPattern, 'Invalid email address')
    .toLowerCase(),
  password: z
    .string()
    .regex(passwordPattern, 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'),
});

const signUpValidation = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .toLowerCase(),
  name: z.string().trim().min(1, 'Name is required'),
  email: z
    .string()
    .trim()
    .regex(emailPattern, 'Invalid email address')
    .toLowerCase(),
  password: z
    .string()
    .regex(passwordPattern, 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'),
});

export { signInValidation, signUpValidation };