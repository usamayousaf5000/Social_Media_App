
//update user 
document.getElementById('updateUserForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const token = localStorage.getItem('token');
    const messageDiv = document.getElementById('message');
    let userId;
    try {
        const decoded = jwt_decode(token);
        userId = decoded.id;
        console.log("Decoded user ID:", userId);
    } catch (error) {
        console.error("Error decoding token:", error);
        messageDiv.textContent = 'Invalid token. Please log in again.';
        messageDiv.style.color = 'red';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/updateUser/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            const errorText = await response.text();
            messageDiv.textContent = errorText || 'Error updating user';
            messageDiv.style.color = 'red';
            return;
        }
        const result = await response.json();
        messageDiv.textContent = result.message;
        messageDiv.style.color = 'White';
        alert('Please login again')
        window.location.replace('login.html')


    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'Internal Server Error';
        messageDiv.style.color = 'white';
    }
});

// Delete user
document.getElementById('deleteUserButton').addEventListener('click', async function () {
    const token = localStorage.getItem('token'); 
    console.log(token)
    const messageDiv = document.getElementById('message');
    let userId;
    try {
        const decoded = jwt_decode(token);
        userId = decoded.id; // Ensure `id` is the correct field name in your JWT payload
        console.log("Decoded user ID:", userId);
    } catch (error) {
        console.error("Error decoding token:", error);
        messageDiv.textContent = 'Invalid token. Please log in again.';
        messageDiv.style.color = 'red';
        return;
    }
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        try {
            const response = await fetch(`http://localhost:3001/deleteUser/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (response.ok) {
                messageDiv.textContent = result.message;
                messageDiv.style.color = 'white';
                window.location.replace('login.html');
            } else {
                messageDiv.textContent = result.message || 'Error deleting user';
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'Internal Server Error';
            messageDiv.style.color = 'red';
        }
    }
});
