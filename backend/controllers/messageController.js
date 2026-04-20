const Message = require('../models/Message');

// @POST /api/messages - Send message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: 'receiverId and text are required' });
    }

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      text
    });

    const populated = await Message.findById(message._id)
      .populate('senderId', 'name')
      .populate('receiverId', 'name')
      .lean();

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @GET /api/messages/:userId - Get conversation between two users
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user._id.toString();

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId }
      ]
    })
      .sort({ timestamp: 1 })
      .limit(100)
      .lean();

    // Mark messages as read
    await Message.updateMany(
      { senderId: userId, receiverId: myId, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @GET /api/messages/conversations - Get all conversations
const getConversations = async (req, res) => {
  try {
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: myId }, { receiverId: myId }]
    })
      .sort({ timestamp: -1 })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .lean();

    // Build unique conversations
    const conversationMap = new Map();
    for (const msg of messages) {
      const otherId =
        msg.senderId._id.toString() === myId.toString()
          ? msg.receiverId._id.toString()
          : msg.senderId._id.toString();

      if (!conversationMap.has(otherId)) {
        const other =
          msg.senderId._id.toString() === myId.toString() ? msg.receiverId : msg.senderId;
        conversationMap.set(otherId, {
          userId: otherId,
          name: other.name,
          email: other.email,
          lastMessage: msg.text,
          timestamp: msg.timestamp,
          unread: msg.receiverId._id.toString() === myId.toString() && !msg.read ? 1 : 0
        });
      } else {
        const conv = conversationMap.get(otherId);
        if (msg.receiverId._id.toString() === myId.toString() && !msg.read) {
          conv.unread += 1;
        }
      }
    }

    res.json(Array.from(conversationMap.values()));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { sendMessage, getMessages, getConversations };
