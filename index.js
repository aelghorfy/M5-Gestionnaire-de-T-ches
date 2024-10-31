let tasks = []; 

async function myJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Le fichier n'a pas pu être trouvé");
    }
    const data = await response.json();
    console.log("Données fetchées:", data);

    if (data.tasks) {
        tasks = data.tasks; 
    }
    console.log("tasks chargés:", tasks);
    return data;
}

function myLogo() {
    document.getElementById("iconLancement").addEventListener("click", function(e) {
        document.getElementById("iconLancement").style.display = "none";
        document.getElementById("menuGestionnaire").style.display = "block"; 
        AfficherMenu();
        e.preventDefault();
    });
}

myLogo();

function AfficherMenu() {
    const menuDiv = document.getElementById("menuGestionnaire");
    menuDiv.innerHTML = "";
    
    const titre = document.createElement("h1");
    titre.textContent = "DynaTask";
    menuDiv.style.textAlign = "center";
    menuDiv.appendChild(titre);

    const buttonDetails = [
        { text: "Ajouter", id: "btn1" },
        { text: "Afficher", id: "btn2" },
        { text: "Calendrier", id: "btn3" }
    ];

    buttonDetails.forEach(detail => {
        const button = document.createElement('button');
        button.textContent = detail.text;
        button.id = detail.id;
        button.style.margin = "10px";
        button.addEventListener("click", () => loadPage(detail.id));
        menuDiv.appendChild(button);
    });

    menuDiv.style.display = "block";
}

function loadPage(pageId) {
    const formTask = document.getElementById("taskForm");
    const taskList = document.getElementById("taskList");
    const contentDiv = document.getElementById("menuGestionnaire");
    taskList.innerHTML = ""; // Réinitialiser la liste des tâches

    switch (pageId) {
        case "btn1":
            formTask.style.display = "block";
            break;
        case "btn2":
            formTask.style.display = "none";
            showAllTasks();
            break;
        case "btn3":
            formTask.style.display = "none";
            showCalendar();
            break;
    }
}

document.getElementById('taskForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Empêche la soumission du formulaire

    const title = document.getElementById('title').value;
    const dueDate = document.getElementById('dueDate').value;
    const dueTime = document.getElementById('dueTime').value;
    const urgent = document.getElementById('urgent').checked;
    const description = document.getElementById('description').value;
    const color = document.getElementById('color').value;

    if (title && dueDate && dueTime && description) {
        const task = {
            title,
            dueDate,
            dueTime,
            urgent,
            description,
            color
        };
        addTaskToDOM(task);
        tasks.push(task); // Ajouter la tâche à la liste
        document.getElementById('taskForm').reset();
        document.getElementById('taskForm').style.display = 'none'; // Masquer le formulaire
    }
});

