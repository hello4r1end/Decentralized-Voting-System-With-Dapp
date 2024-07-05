import React, { useState, useEffect } from 'react'; // Eisagogi tis React kai ton hooks useState kai useEffect
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material'; // Eisagogi stoixeiwn apo to Material-UI

function Results({ contract }) {
    // Dimiourgia state gia apothikeusi tis listas ton ypopshfiwn
    const [candidates, setCandidates] = useState([]);

    // useEffect gia fortwsi ton apotelesmatwn apo ti symvasi
    useEffect(() => {
        const loadResults = async () => {
            try {
                // Lipsi tou arithmou ton ypopshfiwn apo ti symvasi
                const numCandidates = await contract.getNumCandidates();
                const candidateList = [];
                // Epanalipsi gia lipsi ton pliroforiwn kathe ypopshfiou
                for (let i = 0; i < numCandidates; i++) {
                    const candidate = await contract.getCandidate(i);
                    candidateList.push(candidate);
                }
                // Enimerwsi tou state me ti lista ton ypopshfiwn
                setCandidates(candidateList);
            } catch (error) {
                console.error("Error loading results:", error); // Ektypwsi tou sfalmatos stin konsola
            }
        };

        // Klisi tis synartisis loadResults gia arxikopoiisi
        loadResults();
        // Dimiourgia interval gia ananewsi ton apotelesmatwn kathe 10 deuterolepta
        const interval = setInterval(loadResults, 10000);
        // Katharismos tou interval otan to component unmount
        return () => clearInterval(interval);
    }, [contract]);

    return (
        <Box my={4}>
            <Typography variant="h6">Election Results</Typography> {/* Titlos tis enotitas */}
            <List>
                {candidates.map((candidate, index) => (
                    // Emfanisi tis listas ton ypopshfiwn me ton arithmo psifwn tous
                    <ListItem key={index}>
                        <ListItemText primary={`${candidate.name}: ${candidate.voteCount} votes`} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

export default Results; // Exagogi tou component Results
