import React, { useState } from 'react'; // Eisagogi tis React kai tou hook useState
import { TextField, Button, Box, Typography } from '@mui/material'; // Eisagogi stoixeiwn apo to Material-UI

function AddCandidates({ contract }) {
    // Dimiourgia state gia apothikeusi ton onomaton ton ypopshfiwn
    const [candidateNames, setCandidateNames] = useState("");

    // Synartisi gia prosthiki ypopshfiwn
    const addCandidates = async () => {
        const names = candidateNames.split(",").map(name => name.trim()); // Diaxwrismos ton onomaton kai afairesi kenwn
        try {
            // Klisi tis symvasis gia prosthiki ypopshfiwn
            const tx = await contract.addCandidates(names);
            await tx.wait(); // Anamoni gia tin epivevaiosi tis synallagis
            alert("Candidates added successfully"); // Emfanisi minimatos epityxias
        } catch (error) {
            console.error("Error adding candidates:", error); // Ektypwsi tou sfalmatos stin konsola
            alert("Failed to add candidates"); // Emfanisi minimatos apotyxias
        }
    };

    return (
        <Box my={4}>
            <Typography variant="h6">Add Candidates (Admin Only)</Typography> {/* Titlos tis enotitas */}
            <TextField
                fullWidth
                label="Candidate Names (comma separated)"
                value={candidateNames}
                onChange={(e) => setCandidateNames(e.target.value)} // Enimerosi tou state otan allazei to periexomeno tou pediou keimenou
            />
            <Button variant="contained" color="primary" onClick={addCandidates} sx={{ mt: 2 }}>
                Add Candidates {/* Koumpi gia tin ypovoli ton ypopshfiwn */}
            </Button>
        </Box>
    );
}

export default AddCandidates; // Exagogi tou component AddCandidates
