const axios = require('axios');

const mineBlock = async () => {
  try {
    // Send a mine request
    const mineResponse = await axios.post('http://nauryzbay:3000/mine', {
      transactions: [{ sender: 'Miner', recipient: 'You', amount: 1, gas: 0.1 }],
    });

    console.log(mineResponse.data); // Display mine response

    // Fetch and display the updated blockchain
    const blocksResponse = await axios.get('http://nauryzbay:3000/blocks');
    console.log('Current Blockchain:', blocksResponse.data);
  } catch (error) {
    console.error('Error mining block:', error.message);
  }
};

mineBlock();
