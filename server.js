const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

const PORT = 3001;
const filePath = path.join(__dirname, 'task.json');

// Helper function to load tasks
function loadTasks() {
    if (!fs.existsSync(filePath)) {
        // Create the file with an empty tasks array if it doesn’t exist
        fs.writeFileSync(filePath, JSON.stringify({ tasks: [] }, null, 2));
    }
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

// Route to handle adding a new task
app.post('/ajouter-task', (req, res) => {
    const newTask = req.body;
    const tasks = loadTasks().tasks;

    tasks.push(newTask);

    fs.writeFileSync(filePath, JSON.stringify({ tasks }, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Erreur d\'écriture dans le fichier');
        }
        console.log("Tâche ajoutée:", newTask);
        res.status(201).json({ message: 'Task added successfully' });
    });
});

// Start the server
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`));
