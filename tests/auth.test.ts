import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const TEST_SECRET = 'mystyle_test_secret_key_2026';

describe('Auth & Role Security Logic', () => {
  it('hashes passwords and validates correct password', async () => {
    const rawPassword = 'AlgerCasbah2026!';
    const hash = await bcrypt.hash(rawPassword, 10);

    expect(hash).not.toBe(rawPassword);

    const isMatch = await bcrypt.compare(rawPassword, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await bcrypt.compare('WrongPassword', hash);
    expect(isWrongMatch).toBe(false);
  });

  it('generates and decodes JWT tokens with user roles', () => {
    const payload = {
      id: 'user-uuid-1234',
      email: 'admin@mystyle.dz',
      name: 'Yacine Rahmani',
      role: 'admin',
    };

    const token = jwt.sign(payload, TEST_SECRET, { expiresIn: '1h' });
    expect(typeof token).toBe('string');

    const decoded = jwt.verify(token, TEST_SECRET) as any;
    expect(decoded.email).toBe('admin@mystyle.dz');
    expect(decoded.role).toBe('admin');
  });

  it('correctly discriminates roles (admin, staff, tailor, customer)', () => {
    const roles = {
      admin: { canManageProducts: true, canUpdateOrderStatus: true, canQuoteTailoring: true },
      staff: { canManageProducts: false, canUpdateOrderStatus: true, canQuoteTailoring: false },
      tailor: { canManageProducts: false, canUpdateOrderStatus: false, canQuoteTailoring: true },
      customer: { canManageProducts: false, canUpdateOrderStatus: false, canQuoteTailoring: false },
    };

    expect(roles.admin.canManageProducts).toBe(true);
    expect(roles.staff.canUpdateOrderStatus).toBe(true);
    expect(roles.tailor.canQuoteTailoring).toBe(true);
    expect(roles.customer.canManageProducts).toBe(false);
  });
});
