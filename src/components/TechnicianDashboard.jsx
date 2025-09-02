// TechnicianDashboard.jsx
import { Component } from 'react';
import axios from 'axios';

class TechnicianDashboard extends Component {
  state = {
    patientName: '',
    patientId: '',
    scanType: '',
    region: '',
    scanFile: null,
    message: '',
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFileChange = (e) => {
    this.setState({ scanFile: e.target.files[0] });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { patientName, patientId, scanType, region, scanFile } = this.state;
    if (!patientName || !patientId || !scanType || !region || !scanFile) {
      this.setState({ message: 'All fields are required.' });
      return;
    }

    const formData = new FormData();
    formData.append('patientName', patientName);
    formData.append('patientId', patientId);
    formData.append('scanType', scanType);
    formData.append('region', region);
    formData.append('scanImage', scanFile); // must match backend field name

    try {
      const token = localStorage.getItem('token'); // JWT stored from login
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      this.setState({
        message: response.data.message,
        patientName: '',
        patientId: '',
        scanType: '',
        region: '',
        scanFile: null,
      });
    } catch (err) {
      console.error(err);
      this.setState({
        message: err.response?.data?.message || 'Upload failed.',
      });
    }
  };

  render() {
    const { patientName, patientId, scanType, region, message } = this.state;

    return (
      <div style={{ padding: '20px' }}>
        <h2>Technician Dashboard - Upload Scan</h2>

        {message && <p>{message}</p>}

        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Patient Name:</label>
            <input
              type="text"
              name="patientName"
              value={patientName}
              onChange={this.handleChange}
            />
          </div>

          <div>
            <label>Patient ID:</label>
            <input
              type="text"
              name="patientId"
              value={patientId}
              onChange={this.handleChange}
            />
          </div>

          <div>
            <label>Scan Type:</label>
            <select name="scanType" value={scanType} onChange={this.handleChange}>
              <option value="">Select Scan Type</option>
              <option value="X-Ray">X-Ray</option>
              <option value="CT Scan">CT Scan</option>
              <option value="MRI">MRI</option>
            </select>
          </div>

          <div>
            <label>Region:</label>
            <select name="region" value={region} onChange={this.handleChange}>
              <option value="">Select Region</option>
              <option value="Upper Jaw">Upper Jaw</option>
              <option value="Lower Jaw">Lower Jaw</option>
              <option value="Full Mouth">Full Mouth</option>
            </select>
          </div>

          <div>
            <label>Scan Image:</label>
            <input type="file" accept="image/*" onChange={this.handleFileChange} />
          </div>

          <button type="submit">Upload Scan</button>
        </form>
      </div>
    );
  }
}

export default TechnicianDashboard;
