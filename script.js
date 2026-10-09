
/* ========================================
   1. SELECT HTML ELEMENTS
   ======================================== */

const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");


/* ========================================
   2. STORE NOTES IN AN ARRAY
   ======================================== */

let notes = [];


/* ========================================
   3. RENDER NOTES ON THE PAGE
   ======================================== */

function render() {
    // Remove the old list items before rebuilding the list.
    notesList.replaceChildren();

    // Create a card for every note in the array.
    notes.forEach(function (note) {
        const listItem = document.createElement("li");
        listItem.classList.add("note-card");

        // Convert the category to a CSS class.
        const categoryClass =
            "category-" + note.category.toLowerCase();

        listItem.classList.add(categoryClass);

        // Create the note text.
        const noteText = document.createElement("p");
        noteText.classList.add("note-text");
        noteText.textContent = note.text;

        // Create the category label.
        const categoryLabel = document.createElement("span");
        categoryLabel.classList.add("note-category");
        categoryLabel.textContent = note.category;

        // Create the creation date.
        const noteDate = document.createElement("small");
        noteDate.classList.add("note-date");
        noteDate.textContent = note.createdAt;

        // Create a Delete button.
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = "Delete";

        // Add all the elements to the note card.
        listItem.append(
            noteText,
            categoryLabel,
            noteDate,
            deleteButton
        );

        // Add the completed card to the notes list.
        notesList.appendChild(listItem);
    });
}


/* ========================================
   4. HANDLE FORM SUBMISSION
   ======================================== */

noteForm.addEventListener("submit", function (event) {
    // Prevent the browser from refreshing the page.
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    // Basic validation; Task 4 will refine the error messages.
    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    // Create a note object.
    const note = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    // Store the note in the array.
    notes.push(note);

    // Clear the input and error message.
    noteInput.value = "";
    errorMessage.textContent = "";

    // Refresh the displayed notes.
    render();
});
