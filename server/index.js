const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const resultsRouter = require('./routes/results');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your MongoDB connection string
const mongoURI = 'mongodb+srv://mbandaderrick309:Quicksilver20088@cluster0.q0tykxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // For local
// const mongoURI = 'mongodb+srv://<user>:<password>@cluster0.mongodb.net/examresults?retryWrites=true&w=majority'; // For Atlas

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/results', resultsRouter);

app.listen(5000, () => console.log('Server running on port 5000'));