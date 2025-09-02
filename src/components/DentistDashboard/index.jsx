import React, { Component } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import './index.css';

class DentistDashboard extends Component {
  state = {
    scans: [],
    message: "",
  };

  componentDidMount() {
    this.fetchScans();
  }

  fetchScans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://oralvis-backened-6.onrender.com/scans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.setState({ scans: res.data });
    } catch (err) {
      console.error(err);
      this.setState({ message: "Error fetching scans." });
    }
  };

  generatePDF = (scan) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("OralVis Patient Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Patient Name: ${scan.patientName}`, 20, 40);
    doc.text(`Patient ID: ${scan.patientId}`, 20, 50);
    doc.text(`Scan Type: ${scan.scanType}`, 20, 60);
    doc.text(`Region: ${scan.region}`, 20, 70);
    doc.text(
      `Upload Date: ${new Date(scan.uploadDate).toLocaleString()}`,
      20,
      80
    );

    if (scan.imageUrl) {
      doc.addImage(scan.imageUrl, "JPEG", 20, 100, 160, 120);
    }

    doc.save(`${scan.patientName}_report.pdf`);
  };

  render() {
    const { scans, message } = this.state;

    return (
      <div className="dentist-container">
        <div className="dentist-wrapper">
          <h2>Dentist Dashboard</h2>

          {message && <p className="message">{message}</p>}

          <table className="scan-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Patient ID</th>
                <th>Scan Type</th>
                <th>Region</th>
                <th>Upload Date</th>
                <th>Thumbnail</th>
                <th>Full Image</th>
                <th>Download Report</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr key={scan.id}>
                  <td>{scan.patientName}</td>
                  <td>{scan.patientId}</td>
                  <td>{scan.scanType}</td>
                  <td>{scan.region}</td>
                  <td>{new Date(scan.uploadDate).toLocaleString()}</td>
                  <td>
                    <img src={scan.imageUrl} alt="scan" className="thumbnail" />
                  </td>
                  <td>
                    <a href={scan.imageUrl} target="_blank" rel="noreferrer">
                      View Full Image
                    </a>
                  </td>
                  <td>
                    <button onClick={() => this.generatePDF(scan)}>Download PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default DentistDashboard;
