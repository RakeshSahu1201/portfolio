const ensureColumn = async (db, tableName, columnName, applyColumn) => {
  const hasColumn = await db.schema.hasColumn(tableName, columnName);
  if (!hasColumn) {
    await db.schema.alterTable(tableName, (table) => {
      applyColumn(table);
    });
    console.log(`✅ ${tableName}.${columnName} column added`);
  }
};

// Pure function to initialize database schema
const initializeDatabase = async (db) => {
  try {
    const projectsExists = await db.schema.hasTable('projects');
    if (!projectsExists) {
      await db.schema.createTable('projects', (table) => {
        table.increments('id').primary();
        table.string('title', 200).notNullable().index();
        table.text('description').notNullable();
        table.json('technologies').notNullable();
        table.string('link');
        table.string('github');
        table.string('image');
        table.json('images');
        table.integer('order').defaultTo(0).index();
        table.timestamps(true, true);
      });
      console.log('✅ projects table created');
    }

    await ensureColumn(db, 'projects', 'image', (table) => table.string('image'));
    await ensureColumn(db, 'projects', 'images', (table) => table.json('images'));
    await ensureColumn(db, 'projects', 'created_at', (table) => table.timestamps(true, true));

    const experienceExists = await db.schema.hasTable('experience');
    if (!experienceExists) {
      await db.schema.createTable('experience', (table) => {
        table.increments('id').primary();
        table.string('title', 100).notNullable();
        table.string('company', 100).notNullable().index();
        table.string('location', 150);
        table.date('startDate').notNullable().index();
        table.date('endDate');
        table.text('description');
        table.integer('order').defaultTo(0).index();
        table.timestamps(true, true);
      });
      console.log('✅ experience table created');
    }

    await ensureColumn(db, 'experience', 'location', (table) => table.string('location', 150));
    await ensureColumn(db, 'experience', 'created_at', (table) => table.timestamps(true, true));


    const aboutExists = await db.schema.hasTable('about');
    if (!aboutExists) {
      await db.schema.createTable('about', (table) => {
        table.increments('id').primary();
        table.string('name', 200);
        table.string('title', 200).notNullable();
        table.text('bio').notNullable();
        table.string('avatar');
        table.string('email').index();
        table.string('phone');
        table.string('location');
        table.json('social');
        table.json('skills');
        table.json('education');
        table.timestamps(true, true);
      });
      console.log('✅ about table created');
    }

    await ensureColumn(db, 'about', 'name', (table) => table.string('name', 200));
    await ensureColumn(db, 'about', 'social', (table) => table.json('social'));
    await ensureColumn(db, 'about', 'skills', (table) => table.json('skills'));
    await ensureColumn(db, 'about', 'education', (table) => table.json('education'));
    await ensureColumn(db, 'about', 'created_at', (table) => table.timestamps(true, true));

    const contactExists = await db.schema.hasTable('contact_messages');
    if (!contactExists) {
      await db.schema.createTable('contact_messages', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable().index();
        table.string('subject').notNullable();
        table.text('message').notNullable();
        table.boolean('isRead').defaultTo(false);
        table.timestamps(true, true);
      });
      console.log('✅ contact_messages table created');
    }

    await ensureColumn(db, 'contact_messages', 'created_at', (table) => table.timestamps(true, true));

    console.log('✅ Database schema initialized');
  } catch (error) {
    console.error('❌ Schema initialization failed:', error.message);
    throw error;
  }
};

module.exports = { initializeDatabase };
