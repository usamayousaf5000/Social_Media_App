document.getElementById('postForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const photo = document.getElementById('photo').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('photo', photo);

    try {
        const token = localStorage.getItem('token'); 
        const response = await fetch('http://localhost:3001/createPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('message').textContent = data.message;
            window.location.replace('profile.html')
        } else {
            throw new Error(data.message || 'Error creating post');
        }
    } catch (error) {
        document.getElementById('message').textContent = `Error: ${error.message}`;
    }
});
