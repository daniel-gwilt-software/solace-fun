"use client";

import { useEffect, useState, ChangeEvent } from "react";
import type { Advocate } from "./advocate";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    const searchTermDocElement = document.getElementById("search-term");

    if(searchTermDocElement){ 
      searchTermDocElement.innerHTML = searchTerm;
    }
    

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.specialties.includes(searchTerm) ||
        advocate.yearsOfExperience === Number(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    //remove any characters that aren't numbers
    const cleanNumber = String(phoneNumber ?? "").replace(/\D/g, "");

    if(cleanNumber.length === 10) {
      return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`;
    }
    // If the number has a weird amount of digits just return it
    return phoneNumber;
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Solace Advocates
      </Typography>

      <Paper sx={{ padding: 2, marginBottom: 3 }}>
        <TextField
          label="Search Advocates"
          variant="outlined"
          fullWidth
          onChange={onChange}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" onClick={onClick} startIcon={<SearchIcon />}>
          Search
        </Button>
      </Paper>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Degree</TableCell>
              <TableCell>Specialties</TableCell>
              <TableCell>Years of Experience</TableCell>
              <TableCell>Phone Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdvocates.map((advocate, index) => (
              <TableRow key={index}>
                <TableCell>{advocate.firstName}</TableCell>
                <TableCell>{advocate.lastName}</TableCell>
                <TableCell>{advocate.city}</TableCell>
                <TableCell>{advocate.degree}</TableCell>
                <TableCell>
                  {advocate.specialties.map((s, i) => (
                    <div key={i}>{s}</div>
                  ))}
                </TableCell>
                <TableCell>{advocate.yearsOfExperience}</TableCell>
                <TableCell>{formatPhoneNumber(advocate.phoneNumber)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
