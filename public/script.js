document.getElementById('Sign-up').addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log("Sign-up initiated");

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3001/SignUp', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error registering user');
        }

        const data = await response.json();
        alert('Sign-up successful: ' + data.message);
        console.log(data);

        document.getElementById('otpSection').style.display = 'block';
        document.getElementById('otpEmail').value = email;

    } catch (error) {
        console.error('Error:', error);
        alert('Sign-up failed: ' + error.message);
    }
});

document.getElementById('sendOtpBtn').addEventListener('click', async function(event) {
    const email = document.getElementById('otpEmail').value;
    try {
        const response = await fetch('http://localhost:3000/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error sending OTP');
        }

        alert('OTP sent to your email.');
        document.getElementById('otpForm').style.display = 'block';

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to send OTP: ' + error.message);
    }
});

document.getElementById('otpForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log("OTP verification initiated");

    const email = document.getElementById('otpEmail').value;
    const otp = document.getElementById('otp').value;

    try {
        const response = await fetch('http://localhost:3000/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error verifying OTP');
        }

        const data = await response.json();
        alert('OTP verified successfully: ' + data.message);
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
        alert('OTP verification failed: ' + error.message);
    }
});
