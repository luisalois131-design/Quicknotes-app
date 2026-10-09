const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");


const STORAGE_KEY = "quicknotes-notes";

let notes = [];

function loadNotes() {
    try {
        const savedNotes = localStorage.getItem(STORAGE_KEY);

        if (savedNotes !== null) {
            const parsedNotes = JSON.parse(savedNotes);

            
            if (Array.isArray(parsedNotes)) {
                notes = parsedNotes.filter(function (note) {
                    return (
                        note !== null &&
                        typeof note === "object" &&
                        ["string", "number"].includes(typeof note.id) &&
                        typeof note.text === "string" &&
                        ["Personal", "Work", "Study"].includes(note.category) &&
                        typeof note.createdAt === "string"
                    );
                });
            }
        }
    } catch (error) {
        console.error("Could not load saved notes:", error);
        notes = [];
    }
}

function saveNotes() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(notes)
        );
    } catch (error) {
        console.error("Could not save notes:", error);
        errorMessage.textContent =
            "Unable to save notes in this browser.";
    }
}

function updateNoteCount() {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

function render() {
    notesList.replaceChildren();

    const searchTerm = searchInput.value.trim().toLowerCase();

    
    const visibleNotes = notes.filter(function (note) {
        return note.text.toLowerCase().includes(searchTerm);
    });

    
    if (visibleNotes.length === 0 && searchTerm !== "") {
        const message = document.createElement("li");
        message.textContent = "No notes match your search.";
        notesList.appendChild(message);
    }

    visibleNotes.forEach(function (note) {
        const listItem = document.createElement("li");
        listItem.classList.add("note-card");

        const categoryClass =
            "category-" + note.category.toLowerCase();

        listItem.classList.add(categoryClass);

        const noteText = document.createElement("p");
        noteText.classList.add("note-text");
        noteText.textContent = note.text;

        const categoryLabel = document.createElement("span");
        categoryLabel.classList.add("note-category");
        categoryLabel.textContent = note.category;

        const noteDate = document.createElement("small");
        noteDate.classList.add("note-date");
        noteDate.textContent = note.createdAt;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = "Delete";
        deleteButton.dataset.id = note.id;

        listItem.append(
            noteText,
            categoryLabel,
            noteDate,
            deleteButton
        );

        notesList.appendChild(listItem);
    });

    updateNoteCount();
}

noteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        noteInput.focus();
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        noteInput.focus();
        return;
    }

    const note = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(note);

    saveNotes();

    noteInput.value = "";
    errorMessage.textContent = "";

    render();
});


notesList.addEventListener("click", function (event) {
    if (!event.target.classList.contains("delete-button")) {
        return;
    }

    const noteId = Number(event.target.dataset.id);

    notes = notes.filter(function (note) {
        return note.id !== noteId;
    });

    saveNotes();
    render();
});

searchInput.addEventListener("input", function () {
    render();
});

loadNotes();
render();
