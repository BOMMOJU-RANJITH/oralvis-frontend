import { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import TechnicianDashboard from './components/TechnicianDashboard';
import DentistDashboard from './components/DentistDashboard';
import ProtectedRoute from './components/ProtectedRoute';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <ProtectedRoute path="/technician" component={TechnicianDashboard} role="Technician" />
          <ProtectedRoute path="/dentist" component={DentistDashboard} role="Dentist" />
        </Switch>
      </Router>
    );
  }
}

export default App;
