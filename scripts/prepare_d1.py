import re

content = open('d1_clean.sql', 'r', encoding='utf-8').read()

statements = [s.strip() for s in content.split(';\n') if s.strip()]

create_tables = {}
create_indexes = []
inserts = []

for stmt in statements:
    if stmt.startswith('CREATE TABLE'):
        m = re.search(r'CREATE TABLE "?(\w+)"?', stmt)
        if m:
            tname = m.group(1)
            create_tables[tname] = stmt
    elif stmt.startswith('CREATE UNIQUE INDEX') or stmt.startswith('CREATE INDEX'):
        create_indexes.append(stmt)
    elif stmt.startswith('INSERT INTO'):
        inserts.append(stmt)

ordered_table_names = [
    'User',
    'Category',
    'Wilaya',
    'DiscountCode',
    'Address',
    'Product',
    'ProductVariant',
    'Order',
    'OrderItem',
    'OrderStatusHistory',
    'TailoringRequest'
]

out = ['PRAGMA foreign_keys = OFF;\n']
for name in ordered_table_names:
    if name in create_tables:
        out.append(f'DROP TABLE IF EXISTS "{name}";')
        out.append(create_tables[name] + ';\n')

for idx in create_indexes:
    out.append(idx + ';\n')

for ins in inserts:
    out.append(ins + ';\n')

out.append('PRAGMA foreign_keys = ON;\n')

open('d1_ordered.sql', 'w', encoding='utf-8').write('\n'.join(out))
print(f'Successfully generated d1_ordered.sql: {len(create_tables)} tables, {len(create_indexes)} indexes, {len(inserts)} rows')
