class TransactionList {
  constructor() {
    this.incomeList = [];
    this.expenseList = [];
    this.id = 0;
    this.incomeTotal = 0;
    this.expenseTotal = 0;
  }

  addNewTransaction(amount, description) {
    const newTransaction = new Transaction(amount, description, this.id);

    if (amount > 0) {
      this.incomeList.push(newTransaction);
    } else if (amount < 0) {
      newTransaction.percentage =
        this.incomeTotal > 0
          ? ((Math.abs(amount) / this.incomeTotal) * 100).toFixed(2) + '%'
          : '∞%';

      this.expenseList.push(newTransaction);
    }

    this.id++;

    this.render();
  }

  removeTransaction(id) {
    this.incomeList = this.incomeList.filter(transaction => transaction.id !== id);
    this.expenseList = this.expenseList.filter(transaction => transaction.id !== id);

    this.render();
  }

  render() {
    incomeList.innerHTML = '';
    expenseList.innerHTML = '';

    this.incomeTotal = 0;
    for (let item of this.incomeList) {
      this.incomeTotal += item.amount;
    }

    this.expenseTotal = 0;
    for (let item of this.expenseList) {
      this.expenseTotal += Math.abs(item.amount);
    }

    expensesPercentage.innerHTML = `${this.calcTotalExpensePercentage()}`;
    this.calcSingleExpensePercentage();

    for (let item of this.incomeList) {
      incomeList.innerHTML += item.createIncomeHTML();
    }

    for (let item of this.expenseList) {
      expenseList.innerHTML += item.createExpenseHTML();
    }

    budgetValue.innerHTML = `${this.calcTotalBudget()}`;
    console.log(budgetValue.innerHTML);

    incomeValue.innerHTML = `+ $${this.incomeTotal.toFixed(2)}`;
    expensesValue.innerHTML = `- $${this.expenseTotal.toFixed(2)}`;

    inputValue.value = '';
    inputDescription.value = '';
  }

  calcTotalExpensePercentage() {
    return this.incomeTotal > 0
      ? `${((this.expenseTotal / this.incomeTotal) * 100).toFixed(0)}%`
      : '∞%';
  }

  calcSingleExpensePercentage() {
    for (let item of this.expenseList) {
      item.percentage =
        this.incomeTotal > 0
          ? `${((Math.abs(item.amount) / this.incomeTotal) * 100).toFixed(0)}%`
          : '∞%';
    }
  }

  calcTotalBudget() {
    return this.incomeTotal > this.expenseTotal
      ? `+ $${(this.incomeTotal - this.expenseTotal).toFixed(2)}`
      : `- $${Math.abs(this.incomeTotal - this.expenseTotal).toFixed(2)}`;
  }
}

class Transaction {
  constructor(amount, description, id) {
    this.amount = amount;
    this.description = description;
    this.id = id;
    this.date = moment().format('MMM. Do, YYYY');
  }

  createIncomeHTML() {
    return `
    <div class="item" data-transaction-id="${this.id}">
      <div class="item__description">${this.description}</div>
      <div class="right">
        <div class="item__value">+ $${this.amount.toFixed(2)}</div>
        <div class="item__delete">
          <button class="item__delete--btn">
            <i class="ion-ios-close-outline"></i>
          </button>
        </div>
      </div>
      <div class="item__date">${this.date}</div>
    </div>`;
  }

  createExpenseHTML() {
    return `
    <div class="item" data-transaction-id="${this.id}">
      <div class="item__description">${this.description}</div>
      <div class="right">
        <div class="item__value">- $${Math.abs(this.amount).toFixed(2)}</div>
        <div class="item__percentage">${this.percentage}</div>
        <div class="item__delete">
          <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
        </div>
      </div>
      <div class="item__date">${this.date}</div>
    </div>`;
  }
}

const list = new TransactionList();

const date = document.querySelector('.budget__title--month');
const budgetValue = document.querySelector('.budget__value');
const incomeValue = document.querySelector('.budget__income--value');
const expensesValue = document.querySelector('.budget__expenses--value');
const expensesPercentage = document.querySelector('.budget__expenses--percentage');
const incomeList = document.querySelector('.income__list');
const expenseList = document.querySelector('.expenses__list');
const inputDescription = document.querySelector('.add__description');
const inputValue = document.querySelector('.add__value');
const button = document.querySelector('.add__btn');
const allList = document.querySelector('.container');

date.innerHTML = moment().format('MMMM YYYY');
budgetValue.innerHTML = '$0.00';
incomeValue.innerHTML = '$0.00';
expensesValue.innerHTML = '$0.00';
expensesPercentage.innerHTML = '0%';
incomeList.innerHTML = '';
expenseList.innerHTML = '';

button.addEventListener('click', () => {
  let addValue = parseInt(inputValue.value);
  let addDescription = inputDescription.value;

  if (!(addValue === '' || addDescription === '')) {
    list.addNewTransaction(addValue, addDescription);
  }
});

allList.addEventListener('click', e => {
  const elem = e.target;
  const id = parseInt(elem.closest('.item').getAttribute('data-transaction-id'));

  if (e.target.className === 'ion-ios-close-outline') {
    list.removeTransaction(id);
  }
});