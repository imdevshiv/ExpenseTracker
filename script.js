const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

let transactions = JSON.parse(localStorage.getItem('transaction')) || [];

// Generate a random ID
const generateID = () => Math.floor(Math.random() * 1000000);

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    const transactionAmount = +amount.value;

    // Check for empty fields or zero transaction amount
    if (!text.value.trim() || !amount.value.trim() || transactionAmount === 0) {
        alert('Please enter a valid text and a non-zero amount.');
        return;
    }

    // Check if adding this transaction would make the balance go below zero
    const currentBalance = transactions.reduce((acc, trans) => acc + trans.amount, 0);
    if (currentBalance + transactionAmount < 0) {
        alert('Transaction denied: Balance cannot go below zero.');
        return;
    }

    const transaction = {
        id: generateID(),
        text: text.value,
        amount: transactionAmount,
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
}

// Add transaction to DOM
function addTransactionDOM({ id, text, amount }) {
    const item = document.createElement('li');
    item.classList.add(amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `${text} <span>${amount < 0 ? '-' : '+'}₹${Math.abs(amount)}</span>
                      <button class="delete-btn" onclick="removeTransaction(${id})">X</button>`;
    list.appendChild(item);
}

// Update balance, income, and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const expense = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0).toFixed(2) * -1;

    balance.innerHTML = `&#8377; ${total}`;
    money_plus.innerHTML = `&#8377; ${income}`;
    money_minus.innerHTML = `&#8377; ${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

// Update local storage
function updateLocalStorage() {
    localStorage.setItem('transaction', JSON.stringify(transactions));
}

// Initialize app
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Event listener
form.addEventListener('submit', addTransaction);

init();
