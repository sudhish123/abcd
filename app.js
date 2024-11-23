const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 6000; // Fixed port number
const MONGO_URI = 'mongodb://localhost:27017/todos'; // Fixed MongoDB connection string

// Middleware
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Schema and Model
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.post('/tasks', async (req, res, next) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

app.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

app.put('/tasks/:id', async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

app.delete('/tasks/:id', async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await mongoose.connection.close();
  process.exit(0);
});







// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// const port = 5000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // MongoDB Connection
// mongoose.connect("mongodb://localhost:27017/contactsDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on("error", (error) => console.error("Failed to connect to MongoDB:", error));
// db.once("open", () => console.log("Successfully connected to MongoDB"));

// // Contact Schema and Model
// const contactSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   company: { type: String, default: "" },
//   jobTitle: { type: String, default: "" },
// });

// const Contact = mongoose.model("Contact", contactSchema);

// // API Endpoints

// // POST request to create a new contact
// app.post("/contacts", async (req, res) => {
//     const newContact = new Contact(req.body);
//     const savedContact = await newContact.save();
//     res.status(201).json(savedContact);

// });

// // GET request to fetch all contacts
// app.get("/contacts", async (req, res) => {
//     const contacts = await Contact.find();
//     res.json(contacts);
// });

// // PUT request to update a contact by ID
// app.put("/contacts/:id", async (req, res) => {
//     const { id } = req.params;
//     const updatedContact = await Contact.findByIdAndUpdate(id, req.body, { new: true });
//     if (!updatedContact) {
//       return res.status(404).json({ error: "Contact not found" });
//     }
//     res.json({ message: "Contact updated successfully", updatedContact });
// });

// // DELETE request to remove a contact by ID
// app.delete("/contacts/:id", async (req, res) => {

//     const { id } = req.params;
//     const deletedContact = await Contact.findByIdAndDelete(id);
//     if (!deletedContact) {
//       return res.status(404).json({ error: "Contact not found" });
//     }
//     res.json({ message: "Contact deleted successfully", id });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
