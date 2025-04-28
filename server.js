const express = require('express');
const path = require('path');
const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Array para almacenar las tareas
let tasks = [];

// Ruta para obtener todas las tareas
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// Ruta para crear una nueva tarea
app.post('/api/tasks', (req, res) => {
    const task = {
        id: Date.now(),
        text: req.body.text,
        completed: false
    };
    tasks.push(task);
    res.status(201).json(task);
});

// Ruta para actualizar una tarea
app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex > -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ error: 'Tarea no encontrada' });
    }
});

// Ruta para eliminar una tarea
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex > -1) {
        tasks.splice(taskIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Tarea no encontrada' });
    }
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});