import React, { useState, useEffect } from 'react'; // Eisagogi ton hooks useState kai useEffect apo ti React
import { ethers } from 'ethers'; // Eisagogi tis vivliothikis ethers gia allilepidrasi me to Ethereum blockchain
import { Container, Typography, Box } from '@mui/material'; // Eisagogi stoixeiwn apo to Material-UI gia morfopoiisi
import AddCandidates from './components/AddCandidates'; // Eisagogi tou component AddCandidates
import Vote from './components/Vote'; // Eisagogi tou component Vote
import Results from './components/Results'; // Eisagogi tou component Results
import VoterList from './components/VoterList'; // Eisagogi tou component VoterList
import SimpleVotingABI from './SimpleVotingABI.json'; // Eisagogi tou ABI tou eksypnou symvolaiou
import './App.css'; // Eisagogi tou arxeiou CSS

// Dieuthinsi tou eksypnou symvolaiou kai tou diaxeiristi
const contractAddress = ''; //your wallet for admin priv
const adminAddress = '0x6E7E258727A178A744F854390BDd37cBC1eF8aeF'; // your contract 

function App() {
    // Dimiourgia state metavlitwn
    const [provider, setProvider] = useState(null); // eslint-disable-line no-unused-vars
    const [signer, setSigner] = useState(null); // eslint-disable-line no-unused-vars
    const [contract, setContract] = useState(null); // Antikeimeno symvolaiou
    const [userAddress, setUserAddress] = useState(null); // Dieuthinsi xristi
    const [isAdmin, setIsAdmin] = useState(false); // An einai diaxeiristis o xristis
    const [candidates, setCandidates] = useState([]); // Lista ypopshfiwn
    const [hasVoted, setHasVoted] = useState(false); // An exei psifisei o xristis
    const [votingEndTime, setVotingEndTime] = useState(null); // Xronos liksis psifoforias
    const [timeLeft, setTimeLeft] = useState(''); // Xronos pou apomenei
    const [error, setError] = useState(null); // Minimata lathous
    const [requestPending, setRequestPending] = useState(false); // Ekkremotita aitimatos

    // Synartisi gia diaxeirisi sfalmatwn
    const handleError = (error) => {
        let errorMessage;
        if (typeof error === 'string') {
            errorMessage = error;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else if (error.code && error.message) {
            errorMessage = `${error.code}: ${error.message}`;
        } else {
            errorMessage = JSON.stringify(error);
        }
        console.error('Error:', errorMessage);
        setError(new Error(errorMessage));
        alert('Initialization failed: ' + errorMessage);
    };

    // Synartisi gia ananewsi tis selidas dyo fores an xreiastei
    const refreshPageTwice = () => {
        const refreshCount = localStorage.getItem('refreshCount');
        if (!refreshCount) {
            localStorage.setItem('refreshCount', '1');
            window.location.reload();
        } else if (refreshCount === '1') {
            localStorage.setItem('refreshCount', '2');
            window.location.reload();
        } else {
            localStorage.removeItem('refreshCount');
        }
    };

    // useEffect gia arxikopoiisi tis efarmogis
    useEffect(() => {
        const init = async () => {
            try {
                if (window.ethereum) {
                    if (!requestPending) {
                        setRequestPending(true);

                        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                        if (accounts.length === 0) {
                            await window.ethereum.request({ method: 'eth_requestAccounts' });
                            refreshPageTwice(); // Klisi mono an zitisame logariasmous
                        }

                        const web3Provider = new ethers.BrowserProvider(window.ethereum);
                        setProvider(web3Provider);

                        const web3Signer = await web3Provider.getSigner();
                        setSigner(web3Signer);

                        const address = await web3Signer.getAddress();
                        setUserAddress(address);
                        setIsAdmin(address.toLowerCase() === adminAddress.toLowerCase());

                        const contractInstance = new ethers.Contract(contractAddress, SimpleVotingABI, web3Signer);
                        setContract(contractInstance);

                        const endTime = await contractInstance.votingEndTime();
                        setVotingEndTime(parseInt(endTime.toString()) * 1000); // Metatropi se milliseconds

                        const numCandidates = await contractInstance.getNumCandidates();
                        const candidatesArray = [];
                        for (let i = 0; i < numCandidates; i++) {
                            const candidate = await contractInstance.getCandidate(i);
                            candidatesArray.push({
                                name: candidate.name,
                                voteCount: candidate.voteCount.toNumber ? candidate.voteCount.toNumber() : candidate.voteCount,
                            });
                        }
                        setCandidates(candidatesArray);

                        const hasVoted = await contractInstance.hasVoted(address);
                        setHasVoted(hasVoted);

                        setRequestPending(false);
                    }
                } else {
                    throw new Error('MetaMask is not installed');
                }
            } catch (error) {
                setRequestPending(false);
                handleError(error);
            }
        };

        init();
    }, [requestPending]);

    // useEffect gia enimerosi tou xronou pou apomenei
    useEffect(() => {
        const updateTimer = () => {
            if (votingEndTime) {
                const now = new Date().getTime();
                const distance = votingEndTime - now;

                if (distance < 0) {
                    setTimeLeft('Voting has ended');
                } else {
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
                }
            }
        };

        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [votingEndTime]);

    return (
        <Container className="App">
            <Box my={4}>
                <Typography variant="h4" align="center">Simple Voting DApp</Typography>
                <Typography variant="h6" align="center">Your address: {userAddress}</Typography>
                {isAdmin ? (
                    <Typography variant="h6" align="center" color="primary">You are an Admin</Typography>
                ) : (
                    <Typography variant="h6" align="center" color="secondary">You are a User</Typography>
                )}
            </Box>
            {error && (
                <Box my={4}>
                    <Typography variant="h6" align="center" color="error">
                        Error: {error.message}
                    </Typography>
                </Box>
            )}
            {contract && (
                <>
                    <Box my={4} textAlign="center">
                        <Typography variant="h6">Time Left for Voting: {timeLeft}</Typography>
                    </Box>
                    {isAdmin && <AddCandidates contract={contract} />}
                    <Vote contract={contract} candidates={candidates} hasVoted={hasVoted} />
                    <Results contract={contract} />
                    {isAdmin && <VoterList contract={contract} />}
                </>
            )}
        </Container>
    );
}

export default App;
