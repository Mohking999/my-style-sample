import sqlite3

conn = sqlite3.connect('prisma/mystyle.db')
cursor = conn.cursor()

users = cursor.execute('SELECT * FROM User').fetchall()
print(f"Total users in SQLite: {len(users)}")

statements = []
for u in users:
    id, email, passwordHash, name, phone, role, createdAt, updatedAt = u
    phone_val = f"'{phone}'" if phone else "NULL"
    stmt = f"INSERT INTO \"User\" (id, email, passwordHash, name, phone, role, createdAt, updatedAt) VALUES ('{id}', '{email}', '{passwordHash}', '{name}', {phone_val}, '{role}', {createdAt}, {updatedAt});"
    statements.append(stmt)

open('users_insert.sql', 'w', encoding='utf-8').write('\n'.join(statements))
print("Wrote users_insert.sql successfully")
