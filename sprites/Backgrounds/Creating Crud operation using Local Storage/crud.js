// Get contacts from local storage or start with an empty array
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
let editIndex = null; // Track which contact we are editing (null means no edit)

// Wait until page is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Attach submit event to the form
  document.getElementById('contact-form').addEventListener('submit', add);
});

// Function to show the form when 'Add' button is clicked
function create() {
  document.getElementById('contact-form').style.display = 'block';
  document.querySelector('.add_div').style.display = 'none';
  resetForm(); // Reset form fields
}

// Function to reset form fields and button text
function resetForm() {
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  editIndex = null; // Clear editing state
  document.getElementById('toggle-btn').innerText = 'Create';
}

// Function to add new contact or update existing one
function add(event) {
  event.preventDefault(); // Stop page from reloading

  const form = document.getElementById('contact-form');

  // Check if form fields are valid
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Get values from input fields
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  if (editIndex === null) {
    // If adding new contact
    contacts.push({ name, email });
    showMessage('Contact added successfully!');
  } else {
    // If updating existing contact
    contacts[editIndex] = { name, email };
    showMessage('Contact updated successfully!');
  }

  saveContacts(); // Save updated list to local storage
  readAll(); // Refresh the table
  resetForm(); // Reset form after submit
  document.getElementById('contact-form').style.display = 'none'; // Hide form
  document.querySelector('.add_div').style.display = 'block'; // Show Add button
}

// Function to display all contacts in table
function readAll() {
  const tableBody = document.querySelector('.data_table');
  tableBody.innerHTML = ''; // Clear previous table content

  contacts.forEach((contact, index) => {
    const row = document.createElement('tr');

    // Insert new row for each contact
    row.innerHTML = `
      <td>${contact.name}</td>
      <td>${contact.email}</td>
      <td>
        <button onclick="edit(${index})" class="crudbtn">Edit</button>
        <button onclick="del(${index})" class="crudbtn">Delete</button>
      </td>
    `;
    tableBody.appendChild(row); // Add row to table
  });
}

// Function to edit a contact
function edit(index) {
  const contact = contacts[index];
  document.getElementById('name').value = contact.name;
  document.getElementById('email').value = contact.email;

  editIndex = index; // Set which contact is being edited
  document.getElementById('contact-form').style.display = 'block'; // Show form
  document.querySelector('.add_div').style.display = 'none'; // Hide Add button
  document.getElementById('toggle-btn').innerText = 'Update'; // Change button text
}

// Function to delete a contact
function del(index) {
  if (confirm('Are you sure you want to delete this contact?')) {
    contacts.splice(index, 1); // Remove from array
    saveContacts(); // Update local storage
    readAll(); // Refresh table
  }
}

// Function to save contacts array to local storage
function saveContacts() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Function to show temporary success message
function showMessage(text) {
  const messageDiv = document.getElementById('message');
  messageDiv.innerText = text;
  messageDiv.style.display = 'block';

  // Hide message after 3 seconds
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 3000);
}
