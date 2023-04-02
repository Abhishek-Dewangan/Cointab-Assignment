import axios from 'axios';

function a() {
  const form = document.getElementById('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    console.log(user);
    const response = await axios.post('http://localhost:8080/login', user);
    console.log(response);
  });
}
a();
