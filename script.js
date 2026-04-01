const container = document.getElementById("container");
const loading = document.getElementById("loading");
const filterCategory = document.getElementById("filterCategory");
const button = document.getElementById("getIdeaBtn");


let ideas = [];


async function getIdeas() {
    loading.classList.remove("hidden");
    container.innerHTML = "";

    try {
        const res = await fetch("data.json");

        if (!res.ok) {
            throw new Error("Failed to load JSON");
        }

        const data = await res.json();

        ideas = data;

  
        const selectedCategory = filterCategory.value.toLowerCase();

        const filtered = ideas.filter(item => {
            return (
                selectedCategory === "" ||
                item.category.toLowerCase() === selectedCategory
            );
        });

        displayIdeas(filtered);

    } catch (err) {
        container.innerHTML = "<p>Failed to load ideas</p>";
        console.log(err);
    } finally {
        loading.classList.add("hidden");
    }
}


function displayIdeas(data) {
    if (data.length === 0) {
        container.innerHTML = "<p>No ideas found</p>";
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