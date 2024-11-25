document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');
    const loginButton = document.getElementById('login-button');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const pass = document.getElementById('password').value;
  
      const inputs = { name, email, pass };
      const url = 'http://localhost/api/register.php';
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inputs),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          errorMessage.textContent = "Registration successful! Redirecting...";
          errorMessage.style.color = "green";
  
          setTimeout(() => {
            window.location.href = 'Login.html';
          }, 1000);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        errorMessage.textContent = error.message || "An error occurred. Please try again.";
        setTimeout(() => {
          errorMessage.textContent = "";
        }, 1500);
      }
    });
  
    loginButton.addEventListener('click', () => {
      window.location.href = 'Login.html';
    });
  });
  