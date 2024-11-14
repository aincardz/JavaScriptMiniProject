const express = require('express');
const cors = require('cors'); 
const app = express();
const port = 3000;


app.use(express.json());
app.use(cors());


let receipt = [];

// Endpoint GET - Pobranie wszystkich pozycji
app.get('/api/receipt', (req, res) => {
  res.json(receipt);
});

// Endpoint POST - Dodanie nowej pozycji
app.post('/api/receipt', (req, res) => {
  const item = req.body;
  receipt.push(item);
  res.status(201).json(item); // Zwrócenie dodanej pozycji
});

// Endpoint PUT - Edytowanie istniejącej pozycji
app.put('/api/receipt/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const item = req.body;

  if (index >= 0 && index < receipt.length) {
    receipt[index] = item;
    res.json(item); // Zwrócenie zaktualizowanej pozycji
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Endpoint DELETE - Usunięcie pozycji
app.delete('/api/receipt/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);

  if (index >= 0 && index < receipt.length) {
    receipt.splice(index, 1);
    res.status(204).send(); // Brak zawartości
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});


app.use(express.static('public'));


app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
