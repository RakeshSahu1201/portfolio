const { createContactRepository } = require('../repositories/ContactRepository');
const { sendEmail } = require('../config/email');

// Pure function factory to create Contact service
const createContactService = (db, cacheOps) => {
  const repo = createContactRepository(db);

  const getAll = async () => await repo.findAll();

  const getById = async (id) => await repo.findById(id);

  const create = async (data) => {
    const message = await repo.create(data);
    
    // Pure function to send email notification
    const adminEmailData = {
      to: process.env.EMAIL_TO,
      subject: `Portfolio - New Contact: ${data.subject}`,
      replyTo: data.email,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong> ${data.message}</p>
      `,
    };

    await sendEmail(adminEmailData);
    return message;
  };

  const markAsRead = async (id) => await repo.markRead(id);

  const remove = async (id) => await repo.deleteById(id);

  return { getAll, getById, create, markAsRead, remove };
};

module.exports = { createContactService };
