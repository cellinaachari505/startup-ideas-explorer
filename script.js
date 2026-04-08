const container = document.getElementById("container");
const loading = document.getElementById("loading");
const filterCategory = document.getElementById("filterCategory");
const button = document.getElementById("getIdeaBtn");
const sortSelect = document.getElementById("sortSelect");
const themeToggle = document.getElementById("themeToggle");

let ideas = [];
let isLoaded = false;

async function getIdeas() {
    const selectedCategory = filterCategory.value;
    const selectedSort = sortSelect.value;

    loading.classList.remove("hidden");
    container.innerHTML = "";

    try {
        
        const res = await fetch("data.json");
        if (!res.ok) {
            throw new Error("Failed to load JSON");
        }
        const data = await res.json();
        ideas = data;
        isLoaded = true; 
        applyFilters();
    } catch (err) {
        container.innerHTML = "<p>Failed to load ideas</p>";
        console.log(err);
    } finally {
        loading.classList.add("hidden");
    }
}


function applyFilters() {
    if (!isLoaded) {
        container.innerHTML = "<p>Click 'Load Ideas' to view ideas </p>";
        return;
    }
    let filtered = [...ideas];
    const selectedCategory = filterCategory.value.toLowerCase().trim();
    if (selectedCategory !== "") {
        filtered = filtered.filter(item =>
            item.category.toLowerCase().trim() === selectedCategory
        );
    }
    const sortValue = sortSelect.value;
    if (sortValue === "popularity") { 
        filtered.sort(function(a, b) {
            return b.popularity - a.popularity;
        });
    } else if (sortValue === "difficulty") {
        function getDifficultyValue(level) {
            if (level === "easy") return 1;
            if (level === "medium") return 2;
            if (level === "hard") return 3;
        }
        filtered.sort(function(a, b) {
            return getDifficultyValue(a.difficulty.toLowerCase()) -
                getDifficultyValue(b.difficulty.toLowerCase());
        });
    }
    displayIdeas(filtered);
}


function displayIdeas(data) {
    if (data.length === 0) {
        container.innerHTML = "<p>No ideas found </p>";
        return;
    }
    container.innerHTML = "";
    data.forEach(item => {
        container.innerHTML += `
            <div class="card">
                <h2>${item.title}</h2>
                <p>${item.description}</p>
                <p><span class="label">Category:</span> ${item.category}</p>
                <p><span class="label">Difficulty:</span> ${item.difficulty}</p>
                <p><span class="label">Popularity:</span> ⭐ ${item.popularity}</p>
            </div>
        `;
    });
}

button.addEventListener("click", getIdeas);


themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        themeToggle.innerText = "🌙 Dark Mode";
    } else {
        themeToggle.innerText = "☀️ Light Mode";
    }
});