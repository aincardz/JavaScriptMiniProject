const apiUrl = 'http://localhost:3000/api/receipt';
let editIndex = null; // Zmienna globalna do śledzenia indeksu edytowanej pozycji

// Funkcja do pobierania danych z backendu i renderowania tabeli
async function fetchAndRender() {
  const response = await fetch(apiUrl);
  const receipt = await response.json();
  renderTable(receipt);
}

// Funkcja renderująca tabelę paragonu
function renderTable(receipt) {
  const tableBody = document.querySelector('#receiptTable tbody');
  tableBody.innerHTML = '';
  let totalSum = 0;

  receipt.forEach((item, index) => {
    const row = document.createElement('tr');
    const sum = (item.quantity * item.price).toFixed(2);
    totalSum += parseFloat(sum);

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toFixed(2)} zł</td>
      <td>${sum} zł</td>
      <td>
        <button onclick="editItem(${index})">Edytuj</button>
        <button onclick="deleteItem(${index})">Usuń</button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  document.getElementById('totalSum').textContent = `${totalSum.toFixed(2)} zł`;
}

// Dodawanie nowego elementu
document.getElementById('addItemBtn').addEventListener('click', () => {
  const dialog = document.getElementById('itemDialog');
  dialog.showModal();
  editIndex = null;
  document.getElementById('name').value = '';
  document.getElementById('quantity').value = '';
  document.getElementById('price').value = '';
});

// Anulowanie dodawania/edycji
document.getElementById('cancelBtn').addEventListener('click', () => {
  const dialog = document.getElementById('itemDialog');
  dialog.close();
});

// Dodawanie/edycja pozycji
document.getElementById('itemForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const quantity = parseInt(document.getElementById('quantity').value, 10);
  const price = parseFloat(document.getElementById('price').value);

  const item = { name, quantity, price };

  if (name && quantity > 0 && price > 0) {
    if (editIndex === null) {
      // Dodanie nowego elementu
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    } else {
      // Edycja istniejącego elementu
      await fetch(`${apiUrl}/${editIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      editIndex = null;
    }

    fetchAndRender();
    document.getElementById('itemDialog').close();
  } else {
    alert('Proszę podać poprawne wartości!');
  }
});

// Funkcja edycji
async function editItem(index) {
  const response = await fetch(apiUrl);
  const receipt = await response.json();
  const item = receipt[index];

  document.getElementById('name').value = item.name;
  document.getElementById('quantity').value = item.quantity;
  document.getElementById('price').value = item.price;

  const dialog = document.getElementById('itemDialog');
  dialog.showModal();
  editIndex = index;
}

// Funkcja usuwania pozycji
async function deleteItem(index) {
  if (confirm('Czy na pewno chcesz usunąć ten element?')) {
    await fetch(`${apiUrl}/${index}`, { method: 'DELETE' });
    fetchAndRender();
  }
}

// Inicjalizacja tabeli przy załadowaniu strony
fetchAndRender();
