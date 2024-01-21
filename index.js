document.addEventListener('DOMContentLoaded', () => {
    // Fetch existing data when the page loads
    axios.get("https://crudcrud.com/api/4b6cc0a08b63440bb53d3df7166130e1/appointmentdata")
        .then((res) => {
            const existingData = res.data;
            existingData.forEach(userData => showUserOnScreen(userData));
        })
        .catch((err) => console.log(err));
});

document.getElementById('userForm').addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
    event.preventDefault();
    const name = event.target.username.value;
    const email = event.target.email.value;
    const phonenumber = event.target.phone.value;

    if (name && email && phonenumber) {
        const userData = {
            name,
            email,
            phonenumber,
        };

        const editingUserId = event.target.getAttribute('data-edit-id');
        if (editingUserId) {
            // Perform the update operation
            axios.put(`https://crudcrud.com/api/4b6cc0a08b63440bb53d3df7166130e1/appointmentdata/${editingUserId}`, userData)
                .then((res) => {
                    const editedUserData = { ...userData, id: editingUserId };
                    showUserOnScreen(editedUserData);
                })
                .catch((err) => console.log(err));

            // Clear the editing state
            event.target.removeAttribute('data-edit-id');
        } else {
            // Perform the create operation
            axios.post("https://crudcrud.com/api/4b6cc0a08b63440bb53d3df7166130e1/appointmentdata", userData)
                .then((res) => {
                    const userDataWithId = { ...userData, id: res.data._id };
                    showUserOnScreen(userDataWithId);
                })
                .catch((err) => console.log(err));
        }

        // Clear form fields
        event.target.username.value = '';
        event.target.email.value = '';
        event.target.phone.value = '';
    }
}

function showUserOnScreen(userData) {
    const parentElem = document.getElementById('listofitems');
    const existingListItem = document.querySelector(`#listofitems li[data-user-id="${userData.id}"]`);

    // Create a new list item or update an existing one
    const childElem = existingListItem || document.createElement('li');
    childElem.textContent = `${userData.name} - ${userData.email} - ${userData.phonenumber}`;
    childElem.setAttribute('data-user-id', userData.id);

    // Delete button
    const deleteButton = document.createElement('input');
    deleteButton.type = 'button';
    deleteButton.value = 'Delete';
    deleteButton.onclick = () => {
        axios.delete(`https://crudcrud.com/api/4b6cc0a08b63440bb53d3df7166130e1/appointmentdata/${userData.id}`)
            .then((res) => {
                console.log(res);
                parentElem.removeChild(childElem);
            })
            .catch((err) => console.log(err));
    };

    // Edit button
    const editButton = document.createElement('input');
    editButton.type = 'button';
    editButton.value = 'Edit';
    editButton.onclick = () => {
        // Set the editing state and populate the form fields
        document.getElementById('username').value = userData.name;
        document.getElementById('email').value = userData.email;
        document.getElementById('phone').value = userData.phonenumber;
        document.getElementById('userForm').setAttribute('data-edit-id', userData.id);
    };

    // Append buttons to the list item
    childElem.appendChild(deleteButton);
    childElem.appendChild(editButton);

    // Append or update list item in the parent element
    if (!existingListItem) {
        parentElem.appendChild(childElem);
    }
}
