// Initialize Web3 connection
window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error('User denied account access');
        }
    } else {
        console.log('Non-Ethereum browser detected. Please install MetaMask!');
    }

    // Load ABI from JSON file
    let contractABI;
    let contractAddress = "0x2722d54C90cFe67463B5B82E02D939F227fC269f";  // Replace with your deployed contract address
    let contract;
    
    try {
        // Fetch ABI from the local JSON file
        const response = await fetch('./build/contracts/AIMarketPlace.json');
        const data = await response.json();
        contractABI = data.abi;
        contract = new web3.eth.Contract(contractABI, contractAddress);
        console.log('Contract initialized successfully');
    } catch (error) {
        console.error('Error loading contract ABI:', error);
    }

    // Get the current account
    let currentAccount;
    ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        currentAccount = accounts[0];
        console.log('Connected account:', currentAccount);
    });

    // List a new AI model
    document.getElementById('listModelForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('modelName').value;
        const description = document.getElementById('modelDescription').value;
        const price = document.getElementById('modelPrice').value;

        try {
            await contract.methods.listModel(name, description, price).send({ from: currentAccount });
            alert('Model listed successfully!');
        } catch (error) {
            console.error('Error listing model:', error);
        }
    });

    // Load available models
    document.getElementById('loadModels').addEventListener('click', async () => {
        const modelList = document.getElementById('modelList');
        modelList.innerHTML = '';  // Clear the list

        try {
            const modelIds = await contract.methods.getAvailableModels().call();
            for (let modelId of modelIds) {
                const modelDetails = await contract.methods.getModelDetails(modelId).call();
                const li = document.createElement('li');
                li.textContent = `ID: ${modelId}, Name: ${modelDetails[0]}, Price: ${modelDetails[2]} Wei, Rating: ${modelDetails[4]}/5`;
                modelList.appendChild(li);
            }
        } catch (error) {
            console.error('Error loading models:', error);
        }
    });

    // Purchase a model
    document.getElementById('purchaseButton').addEventListener('click', async () => {
        const modelId = document.getElementById('purchaseModelId').value;
        const price = document.getElementById('purchasePrice').value;

        try {
            await contract.methods.purchaseModel(modelId).send({
                from: currentAccount, 
                value: price, 
                gas: 2000000  // Set a reasonable gas limit
            });
            alert('Model purchased successfully!');
        } catch (error) {
            console.error('Error purchasing model:', error);
        }
    });

    // Rate a model
    document.getElementById('rateButton').addEventListener('click', async () => {
        const modelId = document.getElementById('rateModelId').value;
        const rating = document.getElementById('modelRating').value;
    
        // Validate input
        if (rating < 1 || rating > 5) {
            alert('Rating must be between 1 and 5.');
            return;
        }
    
        try {
            const gasEstimate = await contract.methods.rateModel(modelId, rating).estimateGas({ from: currentAccount });
            await contract.methods.rateModel(modelId, rating).send({ from: currentAccount, gas: gasEstimate });
            alert('Model rated successfully!');
        } catch (error) {
            console.error('Error rating model:', error);
            alert('Error rating model: ' + error.message + ' (Code: ' + error.code + ')');
        }
    });
    
    


    // Get model details
    document.getElementById('getModelDetailsButton').addEventListener('click', async () => {
        const modelId = document.getElementById('detailModelId').value;
        const modelDetailOutput = document.getElementById('modelDetailOutput');

        try {
            const details = await contract.methods.getModelDetails(modelId).call();
            modelDetailOutput.innerHTML = `
                <p>Name: ${details[0]}</p>
                <p>Description: ${details[1]}</p>
                <p>Price: ${details[2]} Wei</p>
                <p>Creator: ${details[3]}</p>
                <p>Average Rating: ${details[4]}/5</p>
                <p>Is Purchased: ${details[5]}</p>
            `;
        } catch (error) {
            console.error('Error getting model details:', error);
        }
    });
});
