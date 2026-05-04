// Pure function factory to create Contact controller
const createContactController = (contactService) => {
  const getAllMessages = async (req, res, next) => {
    try {
      const messages = await contactService.getAll();
      res.json(messages);
    } catch (error) {
      next(error);
    }
  };

  const getMessageById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const message = await contactService.getById(id);
      if (!message) return res.status(404).json({ error: 'Message not found' });
      res.json(message);
    } catch (error) {
      next(error);
    }
  };

  const createMessage = async (req, res, next) => {
    try {
      const message = await contactService.create(req.body);
      res.status(201).json({ message: 'Message sent successfully', data: message });
    } catch (error) {
      next(error);
    }
  };

  const markMessageAsRead = async (req, res, next) => {
    try {
      const { id } = req.params;
      await contactService.markAsRead(id);
      res.json({ message: 'Message marked as read' });
    } catch (error) {
      next(error);
    }
  };

  const deleteMessage = async (req, res, next) => {
    try {
      const { id } = req.params;
      await contactService.remove(id);
      res.json({ message: 'Message deleted' });
    } catch (error) {
      next(error);
    }
  };

  return {
    getAllMessages,
    getMessageById,
    createMessage,
    markMessageAsRead,
    deleteMessage,
  };
};

module.exports = { createContactController };
