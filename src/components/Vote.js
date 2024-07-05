import React, { useState } from 'react'; // Eisagogi tis React kai tou hook useState
import { Box, Button, Typography, MenuItem, Select } from '@mui/material'; // Eisagogi stoixeiwn apo to Material-UI

// To component Vote dexetai tria props: contract, candidates, kai hasVoted
const Vote = ({ contract, candidates, hasVoted }) => {
    const [selectedCandidate, setSelectedCandidate] = useState(''); // State gia tin epilegmeni ypopsifiotita

    // Synartisi gia ti diaxeirisi tis psifou
    const handleVote = async () => {
        if (hasVoted) { // An o xristis exei idi psifisei
            alert('Failed to cast vote: You have already voted.');
            return; // Diakopi tis synartisis
        }
        try {
            const tx = await contract.vote(selectedCandidate); // Ektelesi tis psifou
            await tx.wait(); // Anamoni gia tin oloklirosi tis synallagis
            alert('Vote successful!'); // Enimerosi tou xristi gia tin epityxia tis psifou
        } catch (error) {
            console.error('Vote failed:', error); // Ektyposi tou sfalmatos stin konsola
            alert('Vote failed: ' + (error.message || JSON.stringify(error))); // Emfanisi minimatos sfalmatos ston xristi
        }
    };

    return (
        <Box>
            <Typography variant="h6">Vote for a Candidate</Typography> {/* Titlos gia tin enotita psifoforias */}
            <Select
                value={selectedCandidate} // Trexousa epilegmeni ypopsifiotita
                onChange={(e) => setSelectedCandidate(e.target.value)} // Allagi epilegmenis ypopsifiotitas
                displayEmpty
            >
                <MenuItem value="" disabled>Select a candidate</MenuItem> {/* Epilogi gia tin epilogi ypopsifiou */}
                {candidates.map((candidate, index) => (
                    <MenuItem key={index} value={index}>{candidate.name}</MenuItem> // Lista ypopsifiwn
                ))}
            </Select>
            <Button onClick={handleVote} variant="contained" color="primary">Vote</Button> {/* Koubmi gia tin ypovoli tis psifou */}
        </Box>
    );
};

export default Vote; // Exagogi tou component Vote
