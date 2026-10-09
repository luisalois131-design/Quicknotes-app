const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

let notes = [];

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

    notes.forEach(function (note) {
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

    render();
});
