import { Button, CircularProgress, Container, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const SearchJobs = () => {
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query) return alert("Please enter your skills or background.");

    setIsLoading(true);
    setError("");
    setJobs([]);

    try {
      const response = await axios.post("http://localhost:8000/search", {
        query,
      });

      // Log the response data to verify the structure
      console.log("API Response:", response.data);

      // Correctly access the results array from the API response
      if (response.data && response.data.results && Array.isArray(response.data.results)) {
        setJobs(response.data.results); // Use the 'results' field from the response
      } else {
        setError("Failed to parse job results. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching job data. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ padding: "2rem" }}>
      <Paper elevation={3} style={{ padding: "2rem", borderRadius: "10px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Job Search
        </Typography>

        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          <TextField
            fullWidth
            label="Describe your skills or background"
            variant="outlined"
            value={query}
            onChange={handleQueryChange}
            style={{ marginBottom: "1rem" }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={isLoading}
            style={{
              padding: "0.75rem",
              fontWeight: "bold",
              backgroundColor: "#3f51b5",
              "&:hover": { backgroundColor: "#303f9f" },
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Search"}
          </Button>
        </form>

        {error && (
          <Typography variant="body1" color="error" align="center" style={{ marginBottom: "1rem" }}>
            {error}
          </Typography>
        )}

        {jobs.length > 0 && (
          <div>
            <Typography variant="h6" gutterBottom>
              Job Results
            </Typography>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {jobs.map((job, index) => (
                <li
                  key={index}
                  style={{
                    background: "#f5f5f5",
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography variant="h6" component="div" style={{ fontWeight: "bold" }}>
                    {job.position_name}
                  </Typography>
                  <Typography variant="body2" style={{ color: "#888" }}>
                    {job.company_name}
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: "0.5rem" }}>
                    Location: {job.location}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default SearchJobs;
