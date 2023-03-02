import React, { useState } from "react";
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Typography } from "@mui/material";

function App() {
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async (city, setDataFunc) => {
    try {
      const response = await fetch(`https://api.openaq.org/v2/latest?city=${(city)}`);
      const data = await response.json();
      if (data.results.length === 0) {
        setError(`No data available for ${city}`);
        setDataFunc(null);
      } else {
        setError("");
        setDataFunc(data.results[0].measurements);
      }
    } catch (err) {
      setError(`Error fetching data for ${city}`);
      console.log(err);
      setDataFunc(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData(city1, setData1);
    fetchData(city2, setData2);
  };

  return (
    <Card sx={{ maxWidth: 900, margin: 'auto', marginTop: 5 }}>
      <CardContent>
    <Typography align='center' variant="h5" component="h1" marginBottom={4} gutterBottom>
          Air Quality Assessment Tool
        </Typography>
      <form onSubmit={handleSubmit}>
      <div >
      
        <TextField label="City 1" value={city1} onChange={(e) => setCity1(e.target.value)} variant="outlined" margin="normal" fullWidth required />
        <TextField
          label="City 2"
          value={city2}
          onChange={(e) => setCity2(e.target.value)}
          variant="outlined"
          margin="normal"
          fullWidth required/>
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2, mb:6, display: "flex", margin:'auto'}}>
          Compare
        </Button>
        </div>
        
      </form>
      <div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {data1 && data2 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Parameter</TableCell>
                  <TableCell>{city1}</TableCell>
                  <TableCell>{city2}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data1.map((item) => {
                  const item2 = data2.find((i) => i.parameter === item.parameter);
                  return (
                    <TableRow key={item.parameter}>
                      <TableCell>{item.parameter}</TableCell>
                      <TableCell>{item.value}</TableCell>
                      <TableCell>{item2 ? item2.value : "-"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </CardContent> 
    </Card>  
  );
}

export default App;
