const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');  // Explicitly require the 'path' module

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

class Block {
  constructor(transactions, previousHash) {
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.timestamp = new Date().toLocaleString();
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256')
      .update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce)
      .digest('hex');
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Block mined:', this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block('Genesis Block', '0');
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
}

const blockchain = new Blockchain();

app.get('/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
  const newBlock = new Block(req.body.transactions || [], blockchain.getLatestBlock().hash);
  blockchain.addBlock(newBlock);
  res.json({ message: 'Block added successfully', block: newBlock });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
