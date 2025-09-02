import React, { Component } from 'react';
import axios from 'axios';

class LoginPage extends Component {
  state = {
    email: '',
    password: '',
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLogin = async () => {
    const { email, password } = this.state;

    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });

      // Save token in localStorage
      localStorage.setItem('token', res.data.token);

      // Redirect user based on role
      if (res.data.role === 'Technician') {
        this.props.history.push('/technician');
      } else if (res.data.role === 'Dentist') {
        this.props.history.push('/dentist');
      }
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  render() {
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={this.state.email}
          onChange={this.handleChange}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={this.state.password}
          onChange={this.handleChange}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <button onClick={this.handleLogin} style={{ padding: '8px 16px' }}>
          Login
        </button>
      </div>
    );
  }
}

export default LoginPage;
