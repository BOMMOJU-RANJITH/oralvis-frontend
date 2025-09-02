import React, { Component } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

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
      const res = await axios.get("http://localhost:5000/scans", {
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

  // 🔽 Generate PDF report for each scan
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

    // Add image from Cloudinary (JPEG/PNG works)
    if (scan.imageUrl) {
      doc.addImage(scan.imageUrl, "JPEG", 20, 100, 160, 120);
    }

    doc.save(`${scan.patientName}_report.pdf`);
  };

  render() {
    const { scans, message } = this.state;

    return (
      <div style={{ padding: "20px" }}>
        <h2>Dentist Dashboard</h2>
        <p>Here, the dentist can view all uploaded scans and download reports.</p>

        {message && <p>{message}</p>}

        <table border="1" cellPadding="10">
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
                  <img
                    src={scan.imageUrl}
                    alt="scan"
                    style={{ width: "100px" }}
                  />
                </td>
                <td>
                  <a href={scan.imageUrl} target="_blank" rel="noreferrer">
                    View Full Image
                  </a>
                </td>
                <td>
                  <button onClick={() => this.generatePDF(scan)}>
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DentistDashboard;
