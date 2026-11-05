const description = document.getElementById("description");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const category = document.getElementById("category");

const addBtn = document.getElementById("addBtn");
const clearAll = document.getElementById("clearAll");
const darkMode = document.getElementById("darkMode");
const search = document.getElementById("search");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const count = document.getElementById("count");

const highestIncome = document.getElementById("highestIncome");
const highestExpense = document.getElementById("highestExpense");

const transactionList = document.getElementById("transactionList");

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

let pieChart;
let incomeExpenseChart;

// Add Transaction
addBtn.addEventListener("click", () => {

    const text = description.value.trim();
    const value = Number(amount.value);

    if (
        text === "" ||
        amount.value === "" ||
        date.value === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    transactions.push({
        text: text,
        value: value,
        date: date.value,
        category: category.value
    });

    description.value = "";
    amount.value = "";
    date.value = "";

    updateUI();
});

// Update UI
function updateUI() {

    transactionList.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    let maxIncome = 0;
    let maxExpense = 0;

    count.textContent = transactions.length;

    transactions.forEach((transaction, index) => {

        const li = document.createElement("li");

        if (transaction.value > 0) {

            li.classList.add("income-item");

            totalIncome += transaction.value;

            if (transaction.value > maxIncome) {
                maxIncome = transaction.value;
            }

        } else {

            li.classList.add("expense-item");

            totalExpense += Math.abs(transaction.value);

            if (Math.abs(transaction.value) > maxExpense) {
                maxExpense = Math.abs(transaction.value);
            }
        }

        li.innerHTML = `
            <div>
                <strong>${transaction.text}</strong><br>
                Category: ${transaction.category}<br>
                Date: ${transaction.date}<br>
                Amount: ₹${transaction.value}
            </div>

            <div>
                <button class="edit-btn"
                    onclick="editTransaction(${index})">
                    Edit
                </button>

                <button class="delete-btn"
                    onclick="deleteTransaction(${index})">
                    Delete
                </button>
            </div>
        `;

        transactionList.appendChild(li);
    });

    balance.textContent =
        totalIncome - totalExpense;

    income.textContent =
        "₹" + totalIncome;

    expense.textContent =
        "₹" + totalExpense;

    highestIncome.textContent =
        "₹" + maxIncome;

    highestExpense.textContent =
        "₹" + maxExpense;

    drawCharts();

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

// Charts
function drawCharts() {

    const categoryTotals = {};

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {

        if (transaction.value < 0) {

            categoryTotals[transaction.category] =
                (categoryTotals[transaction.category] || 0)
                + Math.abs(transaction.value);

            totalExpense +=
                Math.abs(transaction.value);

        } else {

            totalIncome +=
                transaction.value;
        }
    });

    // PIE CHART

    const pieCanvas =
        document.getElementById("pieChart");

    if (pieChart) {
        pieChart.destroy();
    }

    pieChart = new Chart(pieCanvas, {

        type: "pie",

        data: {
            labels: Object.keys(categoryTotals),

            datasets: [{
                data: Object.values(categoryTotals),

                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40"
                ]
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // BAR CHART

    const barCanvas =
        document.getElementById(
            "incomeExpenseChart"
        );

    if (incomeExpenseChart) {
        incomeExpenseChart.destroy();
    }

    incomeExpenseChart =
        new Chart(barCanvas, {

        type: "bar",

        data: {
            labels: [
                "Income",
                "Expense"
            ],

            datasets: [{
                label: "Amount (₹)",

                data: [
                    totalIncome,
                    totalExpense
                ],

                backgroundColor: [
                    "green",
                    "red"
                ]
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Delete Transaction
function deleteTransaction(index) {

    transactions.splice(index, 1);

    updateUI();
}

// Edit Transaction
function editTransaction(index) {

    description.value =
        transactions[index].text;

    amount.value =
        transactions[index].value;

    date.value =
        transactions[index].date;

    category.value =
        transactions[index].category;

    transactions.splice(index, 1);

    updateUI();
}

// Clear All
clearAll.addEventListener("click", () => {

    transactions = [];

    localStorage.removeItem("transactions");

    updateUI();
});

// Search
search.addEventListener("input", () => {

    const value =
        search.value.toLowerCase();

    document
        .querySelectorAll("#transactionList li")
        .forEach(item => {

            if (
                item.textContent
                    .toLowerCase()
                    .includes(value)
            ) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
});

// Dark Mode
darkMode.addEventListener("click", () => {

    document.body.classList.toggle("dark");
});

// Download PDF
document.getElementById("downloadPDF")
.addEventListener("click", () => {

    window.print();
});

// Load Data
updateUI();