let tasks = []; 

async function fetchTasks(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Le fichier n'a pas pu être trouvé");
        
        const data = await response.json();
        tasks = data.tasks || [];
        console.log("Tasks chargés:", tasks);
        
        return data;
    } catch (error) {
        console.error("Erreur de fetch:", error);
    }
}

function initializeLogo() {
    document.getElementById("iconLancement").addEventListener("click", (e) => {
        document.getElementById("iconLancement").style.display = "none";
        document.getElementById("menuGestionnaire").style.display = "block"; 
        showMenu();
        e.preventDefault();
    });
}

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
        { text: "Calendrier", id: "btn3" }
    ];

    buttons.forEach(buttonInfo => {
        const button = document.createElement("button");
        button.textContent = buttonInfo.text;
        button.id = buttonInfo.id;
        button.style.margin = "10px";
        button.addEventListener("click", () => loadPage(buttonInfo.id));
        menuDiv.appendChild(button);
    });

    menuDiv.style.display = "block";
}

function loadPage(pageId) {
    const formTask = document.getElementById("taskForm");
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; 

    switch (pageId) {
        case "btn1":
            formTask.style.display = "block";
            break;
        case "btn2":
            formTask.style.display = "none";
            listTasks();
            break;
        case "btn3":
            formTask.style.display = "none";
            showCalendar();
            break;
    }
}

document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const task = {
        title: document.getElementById("title").value,
        dueDate: document.getElementById("dueDate").value,
        dueTime: document.getElementById("dueTime").value,
        urgent: document.getElementById("urgent").checked,
        description: document.getElementById("description").value,
        color: document.getElementById("color").value
    };

    if (Object.values(task).every(value => value)) {
        submitTask(task);
    }
});

function submitTask(task) {
    fetch('http://localhost:3001/ajouter-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    })
    .then(response => {
        if (!response.ok) throw new Error("Erreur d'ajout");
        tasks.push(task);
        addTaskToDOM(task);
        alert("Tâche ajoutée avec succès");
        document.getElementById("taskForm").reset();
        document.getElementById("taskForm").style.display = "none";
    })
    .catch(error => {
        console.error(error);
        alert("Erreur lors de l'ajout de la tâche");
    });
}

function addTaskToDOM(task) {
    const taskList = document.getElementById("taskList");
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.style.backgroundColor = task.color;
    taskDiv.innerHTML = `
        <h3>${task.title}</h3>
        <p>Description: ${task.description}</p>
        <p>Date d'échéance: ${task.dueDate} à ${task.dueTime}</p>
        <p style="color: ${task.urgent ? 'red' : 'black'};">Urgent: ${task.urgent ? 'Oui' : 'Non'}</p>
        <button onclick="editTask(this)">Modifier</button>
        <button onclick="deleteTask(this)">Supprimer</button>
    `;
    taskList.appendChild(taskDiv);
}

function listTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = '';
    tasks.forEach(task => addTaskToDOM(task));
}

function editTask(button) {
    alert("Modifier la tâche (fonctionnalité à implémenter)");
}

function deleteTask(button) {
    button.parentElement.remove();
}

function showCalendar() {
    alert("Afficher le calendrier (fonctionnalité à implémenter)");
}


initializeLogo();

fetchTasks('task.json');
