// frontend/app.js
document.addEventListener("DOMContentLoaded", function () {
    loadFormState();
});
function loadFormState() {
    const savedData = JSON.parse(localStorage.getItem("formData")) || {};
    Object.keys(savedData).forEach(key => {
        const elements = document.querySelectorAll(`[name="${key}"]`);

        if (elements.length > 0) {
            elements.forEach((element, index) => {
                console.log(`Setting element name ${key} to ${savedData[key]}`)
                element.value = savedData[`${key}`];
            });
        } else {

            // If the element is not found, it means it's a new row added dynamically
            const [fieldName, rowIndex] = key.split('_');
            const form = document.getElementById('myForm');

            // Add rows dynamically until the rowIndex is satisfied
            for (let i = form.querySelectorAll(`[name^="${fieldName}"]`).length; i <= rowIndex; i++) {
                addRow();
            }

            // Apply the value to the newly added row
            const newElements = document.querySelectorAll(`[name="${key}"]`);
            newElements.forEach(element => {
                element.value = savedData[key];
            });
        }
    });
}

// Function to save progress
function saveProgress() {
    const formData = {};
    const formRows = document.querySelectorAll('.form-row');

    formRows.forEach((row, index) => {
        const nameInput = row.querySelector(`[name^="name"]`);
        const emailInput = row.querySelector(`[name^="email"]`);

        if (nameInput && emailInput) {
            if (index == 0) {
                formData[`name`] = nameInput.value;
                formData[`email`] = emailInput.value;
            } else {
                formData[`name_${index}`] = nameInput.value;
                formData[`email_${index}`] = emailInput.value;
            }
        }
    });

    localStorage.setItem("formData", JSON.stringify(formData));
    console.log("Progress saved!");
}


function edit() {
    const formData = {};
    const formElements = document.getElementById("myForm").elements;

    for (let i = 0; i < formElements.length; i++) {
        formElements[i].readOnly = false; // For example, set the element to read-only
        formElements[i].style.backgroundColor = "#ffffff"; // Change background color
    }
}

function submitForm() {
    const formData = [];
    const formRows = document.querySelectorAll('.form-row');

    formRows.forEach((row, index) => {
        let nameInput = "";
        let emailInput = "";
        if (index == 0) {
            nameInput = row.querySelector('[name="name"]');
            emailInput = row.querySelector('[name="email"]');
        } else {
            nameInput = row.querySelector(`[name="name_${index}"]`);
            emailInput = row.querySelector(`[name="email_${index}"]`);
        }

        if (nameInput && emailInput) {
            formData.push({ name: nameInput.value, email: emailInput.value });
        }

    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/submitForm", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            localStorage.removeItem("formData");
            alert("Form submitted!");
        }
    };

    xhr.send(JSON.stringify(formData));
}

// Function to add a new row
function addRow() {
    const form = document.getElementById('myForm');
    const rowIndex = form.querySelectorAll('.form-row').length;
    const buttonRow = document.querySelector('.button-row'); // Use querySelector to get the first element with the class

    const newRow = document.createElement('div');
    newRow.className = 'form-row';

    newRow.innerHTML = `
        <label for="name">Name:</label>
        <input type="text" name="name_${rowIndex}" required>

        <label for="email">Email:</label>
        <input type="email" name="email_${rowIndex}" required>
        <button type="button" onclick="deleteRow(this)">Delete</button>
    `;

    form.insertBefore(newRow, buttonRow);
}

// Function to delete a row
function deleteRow(button) {
    const form = document.getElementById('myForm');
    const rowToDelete = button.closest('.form-row');

    if (rowToDelete) {
        form.removeChild(rowToDelete);
        saveProgress(); // Save progress after deleting a row
    }
}


function clearForm(){
    const form = document.getElementById('myForm');
    const formInputs = form.querySelectorAll('input[type="text"], input[type="email"]');

    formInputs.forEach(input => {
        input.value = ''; // Reset the input value to an empty string
    });
}

function clearState() {
    localStorage.removeItem("formData");
    clearForm();    
    console.log("Form state cleared!");
}