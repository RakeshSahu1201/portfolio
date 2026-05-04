// Pure function to create ContactMessage table accessor
const getContactMessageTable = (db) => {
  return {
    findAll: () => db('contact_messages').orderBy('created_at', 'desc'),
    findById: (id) => db('contact_messages').where({ id }).first(),
    findByEmail: (email) => db('contact_messages').where({ email }),
    findUnread: () => db('contact_messages').where({ isRead: false }),
    create: (data) => db('contact_messages').insert(data).returning('*'),
    markRead: (id) => db('contact_messages').where({ id }).update({ isRead: true }).returning('*'),
    deleteById: (id) => db('contact_messages').where({ id }).delete(),
    deleteAll: () => db('contact_messages').delete(),
  };
};

module.exports = { getContactMessageTable };
