import React, { Component } from 'react';
import axios from 'axios';
import './index.css'; // Import CSS file

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
      const res = await axios.post(
        'https://oralvis-backened-6.onrender.com/login',
        { email, password }
      );

      localStorage.setItem('token', res.data.token);

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
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <button onClick={this.handleLogin}>Login</button>
        </div>
      </div>
    );
  }
}

export default LoginPage;
