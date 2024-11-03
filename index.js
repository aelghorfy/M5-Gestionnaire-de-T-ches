let tasks = [];

// Fonction pour récupérer les tâches existantes
async function fetchTasks(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Le fichier n'a pas pu être trouvé");

        const data = await response.json();
        tasks = data.tasks.map(task => ({
            ...task,
            completed: task.completed || false // Assurez-vous que completed est toujours initialisé
        })) || [];
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
        { text: "Ajouter", id: "btnAjouter" },
        { text: "Afficher", id: "btnAfficher" },
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
        case "btnAjouter":
            displayTaskForm();
            break;
        case "btnAfficher":
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
        { label: "À", id: "dueTime", type: "time" },
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
        return response.json();
    })
    .then(data => {
        alert(data.message);
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
        fetch('http://localhost:3001/supprimer-task', {
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

// Fonction pour lister les tâches
function listTasks() {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = ""; // Vider le contenu précédent

    fetch('task.json') 
        .then(response => response.json())
        .then(data => {
            data.tasks.forEach(task => {
                const taskDiv = document.createElement("div");
                taskDiv.className = "task";
                taskDiv.style.backgroundColor = task.color;

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = task.completed; // Vérifier si la tâche est terminée
                checkbox.className = "taskCheckbox";
                checkbox.addEventListener("change", () => {
                    task.completed = checkbox.checked; // Mettre à jour l'état de la tâche
                    toggleTaskCompletion(task); // Appeler la fonction pour mettre à jour l'état au serveur
                });

                const label = document.createElement("label");
                label.textContent = "Tâche terminée";

                taskDiv.appendChild(checkbox);
                taskDiv.appendChild(label); 

                const taskTitle = document.createElement("h3");
                taskTitle.textContent = task.title;

                const taskDetails = document.createElement("p");
                taskDetails.textContent = `Échéance: ${task.dueDate} ${task.dueTime} | Urgent: ${task.urgent ? 'Oui' : 'Non'}`;

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Supprimer";
                deleteButton.addEventListener("click", () => deleteTask(task));

                const editButton = document.createElement("button");
                editButton.textContent = "Modifier";
                editButton.addEventListener("click", () => displayEditTaskForm(task));

                taskDiv.appendChild(checkbox);
                taskDiv.appendChild(taskTitle);
                taskDiv.appendChild(taskDetails);
                taskDiv.appendChild(deleteButton);
                taskDiv.appendChild(editButton);
                contentDiv.appendChild(taskDiv);
            });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des tâches :", error);
        });
}



// Fonction pour afficher le formulaire de modification d'une tâche
function displayEditTaskForm(task) {
    const contentDiv = document.getElementById("content");
    const form = document.createElement("form");
    form.id = "editTaskForm";

    const fields = [
        { label: "Titre", id: "editTitle", type: "text", value: task.title },
        { label: "Date d'échéance", id: "editDueDate", type: "date", value: task.dueDate },
        { label: "À", id: "editDueTime", type: "time", value: task.dueTime },
        { label: "Urgent", id: "editUrgent", type: "checkbox", checked: task.urgent },
        { label: "Description", id: "editDescription", type: "text", value: task.description },
        { label: "Couleur", id: "editColor", type: "color", value: task.color }
    ];

    fields.forEach(field => {
        const label = document.createElement("label");
        label.htmlFor = field.id;
        label.textContent = field.label;

        const input = document.createElement("input");
        input.id = field.id;
        input.type = field.type;
        input.value = field.value || "";

        if (field.type === "checkbox") {
            input.checked = field.checked;
        }

        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(document.createElement("br"));
    });

    const submitButton = document.createElement("button");
    submitButton.textContent = "Modifier";
    submitButton.type = "submit";
    form.appendChild(submitButton);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const updatedTask = {
            title: document.getElementById("editTitle").value,
            dueDate: document.getElementById("editDueDate").value,
            dueTime: document.getElementById("editDueTime").value,
            urgent: document.getElementById("editUrgent").checked,
            description: document.getElementById("editDescription").value,
            color: document.getElementById("editColor").value,
        };
        updateTask(task.title, updatedTask);
    });

    contentDiv.innerHTML = ""; 
    contentDiv.appendChild(form);
}

// Fonction pour mettre à jour une tâche
function updateTask(oldTitle, updatedTask) {
    fetch('http://localhost:3001/modifier-task', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldTitle, updatedTask })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur : ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        listTasks(); 
    })
    .catch(error => {
        console.error("Erreur lors de la mise à jour :", error);
    });
}

function toggleTaskCompletion(task) {
    fetch('http://localhost:3001/update-task', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, completed: task.completed })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur lors de la mise à jour de la tâche");
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message); // Message de succès
    })
    .catch(error => {
        console.error("Erreur lors de la mise à jour :", error);
    });
}

function listTasks() {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = ""; // Vider le contenu précédent

    // Créer un sélecteur pour le filtrage
    const filterSelect = document.createElement("select");
    filterSelect.id = "filterSelect";

    const options = [
        { value: "", text: "Tout afficher" },
        { value: "completed", text: "Tâches terminées" },
        { value: "incomplete", text: "Tâches non terminées" }
    ];

    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.textContent = option.text;
        filterSelect.appendChild(opt);
    });

    // Ajouter un événement pour filtrer les tâches
    filterSelect.addEventListener("change", () => {
        const filterValue = filterSelect.value;
        const taskDivs = contentDiv.querySelectorAll(".task");
        taskDivs.forEach(taskDiv => {
            const checkbox = taskDiv.querySelector(".taskCheckbox");
            if (filterValue === "" || (filterValue === "completed" && checkbox.checked) || (filterValue === "incomplete" && !checkbox.checked)) {
                taskDiv.style.display = "block";
            } else {
                taskDiv.style.display = "none";
            }
        });
    });

    // Ajouter le sélecteur de filtre au contenu
    contentDiv.appendChild(filterSelect);

    fetch('task.json') 
        .then(response => response.json())
        .then(data => {
            data.tasks.forEach(task => {
                const taskDiv = document.createElement("div");
                taskDiv.className = "task";
                taskDiv.style.backgroundColor = task.color;

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = task.completed; // Vérifier si la tâche est terminée
                checkbox.className = "taskCheckbox";
                checkbox.addEventListener("change", () => {
                    task.completed = checkbox.checked; // Mettre à jour l'état de la tâche
                    toggleTaskCompletion(task); // Appeler la fonction pour mettre à jour l'état au serveur
                });

                const label = document.createElement("label");
                label.textContent = "Tâche terminée";

                taskDiv.appendChild(checkbox);
                taskDiv.appendChild(label); 

                const taskTitle = document.createElement("h3");
                taskTitle.textContent = task.title;

                const taskDetails = document.createElement("p");
                taskDetails.textContent = `Échéance: ${task.dueDate} ${task.dueTime} | Urgent: ${task.urgent ? 'Oui' : 'Non'}`;

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Supprimer";
                deleteButton.addEventListener("click", () => deleteTask(task));

                const editButton = document.createElement("button");
                editButton.textContent = "Modifier";
                editButton.addEventListener("click", () => displayEditTaskForm(task));

                taskDiv.appendChild(checkbox);
                taskDiv.appendChild(taskTitle);
                taskDiv.appendChild(taskDetails);
                taskDiv.appendChild(deleteButton);
                taskDiv.appendChild(editButton);
                contentDiv.appendChild(taskDiv);
            });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des tâches :", error);
        });
}


// Appel de la fonction pour initialiser
initializeLogo();
fetchTasks('task.json'); 
