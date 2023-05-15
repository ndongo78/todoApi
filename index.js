// importer les modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// initialiser l'application Express
const app = express();

// utiliser le module bodyParser pour analyser les données des requêtes
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// connecter à la base de données MongoDB
mongoose.connect('mongodb+srv://ndongodahs:a12345678B@cluster0.uupmbji.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
  console.log("db connected ")
})
.catch(error =>console.log("error",error))

// définir le modèle de tâches
const Task = mongoose.model('Task', {
  name: {
   type: String,
   required:[true,"le title est required"]
  },
  description: {
    type: String,
    required:[true,"la description est required"]
   },
  dueDate: {
    type:Date,
 },
  done: Boolean
});

const User=mongoose.model('User', {
  name: {
    type:String,
    required:[true,"username est required"]
  },
  email: {
    type:String,
    required:[true,"Email est required"]
  },
  password:{
    type:String,
    required: [true,"Password est required"]
  }
});

//regist
app.get('/user', async (req, res) => {
  const user = await User.find();
  res.json(user);
});

app.post('/user/login', async (req, res) => {
  const user =  User.findOne({email: req.body.email});

 if(!user){
 return res.json({message:"Aucun compte n'est associé a cet email"})
 }else if(user.password != req.body.password){
  return res.json({message:"Mot de passe incorrect"})
 }

  res.json(user);
});
app.post('/user', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password:req.body.password,
  });

  await user.save();

  res.json(user);
});
app.put('/user/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

app.delete('/user/:id', async (req, res) => {
  const user = await Task.findByIdAndDelete(req.params.id);
  res.json({message:"L'utilisateur est sumprimer"});
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
