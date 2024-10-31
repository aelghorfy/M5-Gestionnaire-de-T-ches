//recureration des modules indispensables
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

//variable qui executera les modules, et crée un port pour communiquer

const app = express();
const PORT = 3001;
app.use(cors());
app.use(bodyParser.json());

//fonction qui; récupère json et ajoute nouveau contenue
app.post('/ajouter-task', (req, res) => {

    //récupérer le contenu de la requete sur le fichier js
    const newTask = req.body;

    //lis le fichier existant
    fs.readFile('task.json', (err, data) => {
        if (err) {
            return res.status(500).send('Erreur de lecture du fichier');
        }

        //stock localement les données dans un tableau
        let tasks = [];
        try {
            tasks = JSON.parse(data).contacts;//convert json en js
        } catch (error) {
            return res.status(500).send('Erreur lors de la lecture des tâches');
        }

        //ajoute la nouvelle tâche
        tasks.push(newTasks);


        //ecrit un tableau de tâches dans json et 'stringify' convertit le js en json
        fs.writeFile('task.json', JSON.stringify({ tasks },null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erreur d"ecriture dans le ficher');
             
            }
            res.status(200).send('Task ajouté');
        });
    });
});


// Function to delete a task
app.delete('/supprimer-task/:title', (req, res) => {
    const taskTitle = req.params.title;

    // Read the existing tasks from the JSON file
    fs.readFile('task.json', (err, data) => {
        if (err) {
            return res.status(500).send('Erreur de lecture du fichier');
        }

        let tasks;
        try {
            tasks = JSON.parse(data).tasks; // Use 'tasks' instead of 'contacts'
        } catch (error) {
            return res.status(500).send('Erreur lors de la lecture des tâches');
        }

        // Filter out the task with the specified title
        tasks = tasks.filter(task => task.title !== taskTitle);

        // Write the updated tasks back to the JSON file
        fs.writeFile('task.json', JSON.stringify({ tasks }, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erreur d\'écriture dans le fichier');
            }
            res.status(200).send('Tâche supprimée');
        });
    });
});


//fonction pour assurer l'écoute des requêtes par le serveur
app.listen(PORT, () => {
    console.log('Serveur en cours d"exécution sut http://localhost:${PORT}')
})