// importer les modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// initialiser l'application Express
const app = express();

// utiliser le module bodyParser pour analyser les données des requêtes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connecter à la base de données MongoDB
mongoose.connect('mongodb+srv://ndongodahs:a12345678B@cluster0.uupmbji.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
  console.log("db connected ")
})
.catch(error =>console.log("error",error))

// définir le modèle de tâches
const Task = mongoose.model('Task', {
  name: String,
  description: String,
  dueDate: {
    type:Date,
 },
  done: Boolean
});

// définir les routes pour l'API de todo list
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.get('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.json(task);
});

app.post('/tasks', async (req, res) => {
  const task = new Task({
    name: req.body.name,
    description: req.body.description,
    dueDate: new Date(),
    done: false
  });

  await task.save();

  res.json(task);
});

app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  res.json(task);
});

// lancer l'application sur le port 3000
app.listen( 3001, () => console.log('API de todo list lancée sur le port 3000'));
