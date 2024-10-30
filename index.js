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

