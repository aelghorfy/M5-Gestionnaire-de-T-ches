const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

// Route pour ajouter une tâche
app.post('/ajouter-task', (req, res) => {
    const newTask = req.body;
    fs.readFile('task.json', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erreur de lecture du fichier" });
        }

        let tasks = [];
        try {
            tasks = JSON.parse(data).tasks;
        } catch (error) {
            return res.status(500).json({ error: 'Erreur lors de la lecture des tasks' });
        }

        tasks.push(newTask);

        fs.writeFile('task.json', JSON.stringify({ tasks }, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur d\'écriture dans le fichier' });
            }
            res.status(200).json({ message: 'Tâche ajoutée avec succès' });
        });
    });
});

// Route pour supprimer une tâche
app.delete('/supprimer-task', (req, res) => {
    const { title } = req.body; // Supposons que chaque tâche a un titre unique
    fs.readFile('task.json', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erreur de lecture du fichier" });
        }

        let tasks = [];
        try {
            tasks = JSON.parse(data).tasks;
        } catch (error) {
            return res.status(500).json({ error: 'Erreur lors de la lecture des tasks' });
        }

        // Filtrer la tâche à supprimer
        tasks = tasks.filter(task => task.title !== title);

        // Écrire les tâches mises à jour dans le fichier
        fs.writeFile('task.json', JSON.stringify({ tasks }, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur d\'écriture dans le fichier' });
            }
            res.status(200).json({ message: 'Tâche supprimée avec succès' });
        });
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
