document.getElementById('update-user').addEventListener('click', () => {
    window.location.href = 'http://127.0.0.1:5500/public/updateUser.html';
});
async function fetchActiveUserPosts() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            document.getElementById('error-message').textContent = 'No token found';
            return;
        }

        const response = await fetch('http://localhost:3001/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('Response status:', response.status, 'Response body:', errorDetails);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Active User Posts:', data);
        displayActiveUserPosts(data.activeUserPosts);
    } catch (error) {
        console.error('Error fetching active user posts:', error);
        document.getElementById('error-message').textContent = 'Failed to load active user posts.';
    }
}

function displayActiveUserPosts(posts) {
    const activeUserPostsContainer = document.getElementById('active-user-posts-container');
    activeUserPostsContainer.innerHTML = ''; 

    if (!posts || posts.length === 0) {
        activeUserPostsContainer.innerHTML = '<p>No posts available.</p>';
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        const userName = post.userId && post.userId.name ? post.userId.name : 'Unknown User';

        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${userName}</p>
            <p>${post.content}</p>
            <img src="${post.photo}" alt="Post Image" class="post-image">
            <p>Likes: ${post.likes}</p>
            <p>Comments: ${post.commentedBy.length}</p>
            <div class="post-buttons">
                <button class="update" onclick="updatePost('${post._id}')">Update</button>
                <button class="delete" onclick="deletePost('${post._id}')">Delete</button>
            </div>
        `;

        activeUserPostsContainer.appendChild(postElement);
    });
}
fetchActiveUserPosts();
displayActiveUserPosts(posts);
async function deletePost(postId) {
    const token = localStorage.getItem('token');
    if (!token) {
        document.getElementById('error-message').textContent = 'No token found';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/timeline/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('Response status:', response.status, 'Response body:', errorDetails);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data.message);

        fetchPosts(); 
    } catch (error) {
        console.error('Error deleting post:', error);
        document.getElementById('error-message').textContent = 'Failed to delete the post.';
    }
}