const Message = require("../models/Message");
const sendEmail = require("../utils/sendEmail");

const getMessages = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Message.countDocuments(),
    ]);

    res.json({
      data: messages,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

const createMessage = async (req, res, next) => {
  try {
    const message = await Message.create(req.body);

    await sendEmail({
      subject: "New contact message",
      text: `From: ${message.name} <${message.email}>\n\n${message.message}`,
    });

    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

const updateMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!message) return res.status(404).json({ message: "Not found" });
    res.json(message);
  } catch (err) {
    next(err);
  }
};

const updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) return res.status(404).json({ message: "Not found" });
    res.json(message);
  } catch (err) {
    next(err);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMessages,
  createMessage,
  updateMessage,
  updateMessageStatus,
  deleteMessage,
};
