const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../db.json');

const db = {
  read: () => {
    try {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      return { users: [], rides: [], messages: [] };
    }
  },

  write: (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  },

  addUser: (user) => {
    const data = db.read();
    user.id = Date.now().toString();
    data.users.push(user);
    db.write(data);
    return user;
  },

  findUserByEmail: (email) => {
    const data = db.read();
    return data.users.find(u => u.email === email);
  },

  findUserById: (id) => {
    const data = db.read();
    return data.users.find(u => u.id === id);
  },

  addRide: (ride) => {
    const data = db.read();
    ride.id = Date.now().toString();
    ride.createdAt = new Date();
    data.rides.push(ride);
    db.write(data);
    return ride;
  },

  getRides: () => {
    const data = db.read();
    return data.rides || [];
  },

  getRideById: (id) => {
    const data = db.read();
    return data.rides?.find(r => r.id === id);
  },

  addMessage: (message) => {
    const data = db.read();
    message.id = Date.now().toString();
    message.createdAt = new Date();
    data.messages.push(message);
    db.write(data);
    return message;
  },

  getMessages: (userId1, userId2) => {
    const data = db.read();
    return (data.messages || []).filter(m => 
      (m.sender === userId1 && m.receiver === userId2) || 
      (m.sender === userId2 && m.receiver === userId1)
    );
  }
};

module.exports = db;
