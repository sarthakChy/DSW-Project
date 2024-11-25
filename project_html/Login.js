document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const signupButton = document.getElementById('signup-button');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const user = document.getElementById('user-input').value;
      const pass = document.getElementById('pass-input').value;
  
      const inputs = { user, pass };
      const url = 'http://localhost:80/api/login.php';
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inputs),
        });
  
        const data = await response.text();
  
        if (response.ok) {
          localStorage.setItem('user', user);
          errorMessage.textContent = "Login successful! Redirecting...";
          errorMessage.style.color = "green";
  
          setTimeout(() => {
            window.location.href = `Dashboard.html?user=${user}`;
          }, 1000);
        } else {
          errorMessage.textContent = data;
          setTimeout(() => {
            errorMessage.textContent = "";
          }, 1500);
        }
      } catch (error) {
        console.error("Error:", error);
        errorMessage.textContent = "An error occurred. Please try again.";
        setTimeout(() => {
          errorMessage.textContent = "";
        }, 1500);
      }
    });
  
    signupButton.addEventListener('click', () => {
      window.location.href = 'Register.html';
    });
  });
  