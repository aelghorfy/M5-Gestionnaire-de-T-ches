let tasks = [];

// Fonction pour récupérer les tâches existantes
async function fetchTasks(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Le fichier n'a pas pu être trouvé");

        const data = await response.json();
        tasks = data.tasks || [];
        console.log("Tâches chargées :", tasks);
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
    }
}

// Fonction pour initialiser l'événement de clic sur le logo
function initializeLogo() {
    document.getElementById("iconLancement").addEventListener("click", (e) => {
        document.getElementById("iconLancement").style.display = "none";
        document.getElementById("menuGestionnaire").style.display = "block";
        showMenu();
        e.preventDefault();
    });
}

// Fonction pour afficher le menu avec les boutons
function showMenu() {
    const menuDiv = document.getElementById("menuGestionnaire");
    menuDiv.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = "DynaTask";
    menuDiv.style.textAlign = "center";
    menuDiv.appendChild(title);

    const buttons = [
        { text: "Ajouter", id: "btn1" },
        { text: "Afficher", id: "btn2" },
    ];

    buttons.forEach(buttonInfo => {
        const button = document.createElement("button");
        button.textContent = buttonInfo.text;
        button.id = buttonInfo.id;
        button.style.margin = "10px";
        button.addEventListener("click", () => loadPage(buttonInfo.id));
        menuDiv.appendChild(button);
    });
}

// Fonction pour charger dynamiquement le formulaire et les tâches
function loadPage(pageId) {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = ""; 

    switch (pageId) {
        case "btn1":
            displayTaskForm();
            break;
        case "btn2":
            listTasks();
            break;
    }
}

// Fonction pour créer et afficher le formulaire de tâche
function displayTaskForm() {
    const contentDiv = document.getElementById("content");
    const form = document.createElement("form");
    form.id = "taskForm";

    const fields = [
        { label: "Titre", id: "title", type: "text" },
        { label: "Date d'échéance", id: "dueDate", type: "date" },
        { label: "à", id: "dueTime", type: "time" },
        { label: "Urgent", id: "urgent", type: "checkbox" },
        { label: "Description", id: "description", type: "text" },
        { label: "Couleur", id: "color", type: "color" }
    ];

    fields.forEach(field => {
        const label = document.createElement("label");
        label.htmlFor = field.id;
        label.textContent = field.label;

        const input = document.createElement("input");
        input.id = field.id;
        input.type = field.type;

        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(document.createElement("br"));
    });

    const submitButton = document.createElement("button");
    submitButton.textContent = "Ajouter";
    submitButton.type = "submit";
    form.appendChild(submitButton);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        submitTask({
            title: document.getElementById("title").value,
            dueDate: document.getElementById("dueDate").value,
            dueTime: document.getElementById("dueTime").value,
            urgent: document.getElementById("urgent").checked,
            description: document.getElementById("description").value,
            color: document.getElementById("color").value,
            completed: false 
        });
    });

    contentDiv.appendChild(form);
}

// Fonction pour soumettre une nouvelle tâche au serveur
function submitTask(task) {
    fetch('http://localhost:3001/ajouter-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur : ${response.statusText}`);
        }
        return response.text();
    })
    .then(data => {
        alert(data);
        document.getElementById("taskForm").reset();
        tasks.push(task); 
        addTaskToDOM(task); 
    })
    .catch(error => {
        console.error("Erreur lors de la soumission de la tâche :", error);
    });
}

// Fonction pour ajouter la tâche à l'interface avec le bouton "Supprimer"
function addTaskToDOM(task) {
    const contentDiv = document.getElementById("content");
    let taskList = document.getElementById("taskList");

    if (!taskList) {
        taskList = document.createElement("div");
        taskList.id = "taskList";
        contentDiv.appendChild(taskList);
    }

    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.style.backgroundColor = task.color;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer";
    deleteButton.addEventListener("click", () => deleteTask(task));

    taskDiv.innerHTML = `
        <input type="checkbox" class="taskCheckbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion(${tasks.indexOf(task)})">
        <label>Tâche terminée</label>
        <h3>${task.title}</h3>
        <p>Description : ${task.description}</p>
        <p>Date d'échéance : ${task.dueDate} à ${task.dueTime}</p>
        <p style="color: ${task.urgent ? 'red' : 'black'};">Urgent : ${task.urgent ? 'Oui' : 'Non'}</p>
    `;

    taskDiv.appendChild(deleteButton);
    taskList.appendChild(taskDiv);
}

// Fonction pour supprimer une tâche
function deleteTask(task) {
    const taskIndex = tasks.indexOf(task);
    if (taskIndex > -1) {
        tasks.splice(taskIndex, 1); 
        fetch(`http://localhost:3001/supprimer-task`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: task.title })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la suppression de la tâche");
            }
            listTasks(); 
        })
        .catch(error => {
            console.error("Erreur lors de la suppression :", error);
        });
    }
}

// Fonction pour afficher toutes les tâches
function listTasks() {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = ""; // Vider le contenu précédent

    const taskList = document.createElement("div");
    taskList.id = "taskList";

    // Afficher toutes les tâches
    tasks.forEach(task => addTaskToDOM(task));

    contentDiv.appendChild(taskList);
}

// Initialisation
initializeLogo();
fetchTasks('task.json'); 
