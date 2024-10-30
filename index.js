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
        { text: "JSP", id: "btn3" }
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
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";
    let content;
    switch (pageId) {
        case "btn1":
            content = "<h2>Ajouter une tâche</h2><p>form d'ajout.</p>";
            break;
        case "btn2":
            content = "<h2>Afficher mes tâches</h2><p>calendrier avec les taches et un select pour les diff options de tri.</p>";
            break;
        case "btn3":
            content = "<h2>Aucune idée</h2><p>à voir.</p>";
            break;
        default:
            content = "<h2>Welcome</h2><p>Select a page to view its content.</p>";
    }

    contentDiv.innerHTML = content;
    contentDiv.style.display = "block";
}
