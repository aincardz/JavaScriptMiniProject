let receipt = JSON.parse(localStorage.getItem('receipt')) || [];
let editIndex = null; // New global variable to track the index of the item being edited

function renderTable() {
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
      <td>${item.price} zł</td>
      <td>${sum} zł</td>
      <td>
        <button onclick="editItem(${index})">Edit</button>
        <button onclick="deleteItem(${index})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  document.getElementById('totalSum').textContent = `${totalSum.toFixed(2)} zł`;
  localStorage.setItem('receipt', JSON.stringify(receipt));
}

document.getElementById('addItemBtn').addEventListener('click', () => {
  const dialog = document.getElementById('itemDialog');
  dialog.showModal();
  editIndex = null; // Reset editIndex when adding a new item
  document.getElementById('name').value = '';
  document.getElementById('quantity').value = '';
  document.getElementById('price').value = '';
});

document.getElementById('cancelBtn').addEventListener('click', () => {
  const dialog = document.getElementById('itemDialog');
  dialog.close();
});

document.getElementById('itemForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    const price = parseFloat(document.getElementById('price').value);
  
    if (quantity > 0 && price > 0) {
      if (editIndex === null) {
        // Adding new item
        receipt.push({ name, quantity, price });
      } else {
        // Editing existing item
        receipt[editIndex] = { name, quantity, price };
        editIndex = null; // Reset after editing
      }
      renderTable();
      document.getElementById('itemDialog').close();
    } else {
      alert('Invalid input!');
    }
  });
  

function editItem(index) {
  const item = receipt[index];
  document.getElementById('name').value = item.name;
  document.getElementById('quantity').value = item.quantity;
  document.getElementById('price').value = item.price;

  const dialog = document.getElementById('itemDialog');
  dialog.showModal();

  editIndex = index; // Set the index of the item being edited
}

function deleteItem(index) {
  if (confirm('Are you sure you want to delete this item?')) {
    receipt.splice(index, 1);
    renderTable();
  }
}

renderTable();
