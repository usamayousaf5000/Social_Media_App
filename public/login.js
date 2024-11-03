const Login = document.getElementById('Login');
Login.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    loginUser(email, password);
});
async function loginUser(email, password) {

    try {
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        console.log(response)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        console.log('Login successful:', data);

        localStorage.setItem('token', data.token);
        window.location.href = 'dashboard.html'
    } catch (error) {
        console.error('Error during login:', error.message);
    }
}