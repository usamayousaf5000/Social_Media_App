document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();
});

document.getElementById('profile-button').addEventListener('click', () => {
    window.location.href = 'http://127.0.0.1:5500/public/profile.html';
});


async function fetchPosts() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("No token found");
        }
        
        const response = await fetch('http://localhost:3001/timeline', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayPosts(data.otherPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        document.getElementById('error-message').textContent = 'Failed to load posts.';
    }
}

function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

    if (!posts || posts.length === 0) {
        postsContainer.innerHTML = '<p>No posts available.</p>';
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        const userName = post.userId && post.userId.name ? post.userId.name : 'Unknown User';

        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${userName}</p>
            <img src="${post.photo}" alt="Post Image" class="post-image">
            <p>Likes: ${post.likes}</p>
            <p>Comments: ${post.commentedBy.length}</p>
        `;

        postsContainer.appendChild(postElement);
    });
}

