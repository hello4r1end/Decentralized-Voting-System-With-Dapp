import React, { useState, useEffect } from 'react'; // Eisagogi tis React kai ton hooks useState kai useEffect
import { Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material'; // Eisagogi stoixeiwn apo to Material-UI
import * as XLSX from 'xlsx'; // Eisagogi tis vivliothikis XLSX gia export se Excel

function VoterList({ contract }) {
    const [voters, setVoters] = useState([]); // State gia tin lista ton psifoforon
    const [totalVoters, setTotalVoters] = useState(0); // State gia to sinolo ton psifoforon

    // useEffect gia fortwsi ton psifoforon otan to component fortwnei
    useEffect(() => {
        const loadVoters = async () => {
            try {
                const voterAddresses = await contract.getVoters(); // Lavi ti lista ton psifoforon apo to symvolaio
                setVoters(voterAddresses.slice(0, 5)); // Thetei ta prwta 5 psifofora stin state
                setTotalVoters(voterAddresses.length); // Thetei to sinolo ton psifoforon stin state
            } catch (error) {
                console.error("Error loading voters:", error); // Ektypwnei sfalma an yparxei provlima
            }
        };

        loadVoters(); // Klisi tis loadVoters sinartisis
    }, [contract]);

    // Synartisi gia katevasma tis listas ton psifoforon
    const downloadVoters = async () => {
        try {
            const voterAddresses = await contract.getVoters(); // Lavi ti lista ton psifoforon apo to symvolaio
            const ws = XLSX.utils.json_to_sheet(voterAddresses.map(address => ({ Address: address }))); // Dimiourgia sheet apo ti list
            const wb = XLSX.utils.book_new(); // Dimiourgia neou workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Voters'); // Prosthesi tou sheet sto workbook
            XLSX.writeFile(wb, 'voters.xlsx'); // Apothikeusi tou workbook ws arxeio Excel
        } catch (error) {
            console.error("Error downloading voters:", error); // Ektypwnei sfalma an yparxei provlima
        }
    };

    return (
        <Box my={4}>
            <Typography variant="h6">List of Voters</Typography> {/* Titlos tis listas */}
            <List>
                {voters.map((address, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={address} /> {/* Emfanisi dieuthinseis */}
                    </ListItem>
                ))}
            </List>
            {totalVoters > 5 && (
                <Typography variant="body1">
                    ...and {totalVoters - 5} more have voted. {/* Emfanisi tou arithmou twn ipolipon psifoforon */}
                </Typography>
            )}
            <Button variant="contained" color="primary" onClick={downloadVoters} sx={{ mt: 2 }}>
                Download Complete Voter List {/* Koumpi gia katevasma olokliris tis listas */}
            </Button>
        </Box>
    );
}

export default VoterList; // Exagogi tou component VoterList
