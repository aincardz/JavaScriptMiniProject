const express = require('express');
const cors = require('cors'); // Dodajemy CORS dla połączenia z frontendu
const app = express();
const port = 3000;

// Środkowa warstwa pozwalająca na parsowanie JSON i obsługę CORS
app.use(express.json());
app.use(cors());

// Przechowywanie danych w pamięci
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

// Serwowanie plików statycznych z folderu 'public'
app.use(express.static('public'));

// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
