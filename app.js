let totalExpense = document.getElementById("totalExpense");
let totalIncome = document.getElementById("totalIncome");
let difference = document.getElementById("difference");
let list = document.getElementById("list");
let save1 = document.getElementById("save1");
let save = document.getElementById("save");

let totalAmount = 0;
let appData = {};

function getData() {
    let data = localStorage.getItem("appData");
    appData = JSON.parse(data) || {};
}

showData();

function showData() {

    getData();
    totalAmount = 0;

    for (let key in appData) {
        createDiv(appData[key]);
    }
}


function updateHeadValues(prop, amount) {
    let expense = +totalExpense.innerHTML.substring(2);
    let income = +totalIncome.innerHTML.substring(2);

    if (prop === "+") {
        income -= amount;
        totalIncome.innerHTML = "+&#8377;" + income.toFixed(2);
    } else {
        expense -= amount;
        totalExpense.innerHTML = "-&#8377;" + expense.toFixed(2);
    }
    console.log(totalAmount)
    if (totalAmount >= 0) {
        let total = totalAmount;
        difference.setAttribute("class", "amount incomeColor");
        difference.innerHTML = "+&#8377;" + total.toFixed(2);
    } else {
        let total = totalAmount;
        total = +(String(total).substring(1));
        difference.setAttribute("class", "amount expenseColor");
        difference.innerHTML = "-&#8377;" + total.toFixed(2);
    }

}


function deleteData(event) {
    let total = +difference.innerHTML.substring(2);
    var container = event.target.parentNode;
    let amountOfDeleteValue = event.target.parentNode.getElementsByTagName('p')[1].innerHTML;
    let value = +amountOfDeleteValue.substring(2);
    var divId = +event.target.parentNode.id;

    totalAmount += amountOfDeleteValue[0] === "+" ? -value : value;

    updateHeadValues(amountOfDeleteValue[0], value);

    getData();

    delete appData[divId];
    localStorage.setItem("appData", JSON.stringify(appData));
    list.removeChild(container.nextSibling);
    list.removeChild(container);
}

function createDiv(data) {
    let expense = +totalExpense.innerHTML.substring(2);
    let income = +totalIncome.innerHTML.substring(2);
    let total = +difference.innerHTML.substring(2);

    let valueData;
    if (data.prop === "incomeColor") {
        valueData = "+&#8377;" + data.amount;
        income += +data.amount;
        totalAmount += +data.amount;
    }
    else {
        expense += +data.amount;
        totalAmount -= +data.amount;
        valueData = "-&#8377;" + data.amount;
    }

    let div = `<div class="container" id="${data.id}"> <p class="para">${data.category}</p><p class="${data.prop} expenseIncome">${valueData}</p><i class="fa fa-pencil font" data-bs-toggle="modal" data-bs-target="#staticBackdrop1" onclick="editValue(event)"></i><i class="fa fa-trash-o font" onclick="deleteData(event)"></i></div><hr class="hr">`;
    list.innerHTML += div;

    totalExpense.innerHTML = "-&#8377;" + expense.toFixed(2);
    totalIncome.innerHTML = "+&#8377;" + income.toFixed(2);

    if (totalAmount >= 0) {
        total = totalAmount;
        difference.setAttribute("class", "amount incomeColor");
        difference.innerHTML = "+&#8377;" + total.toFixed(2);
    } else {
        total = totalAmount;
        total = +(String(total).substring(1));
        difference.setAttribute("class", "amount expenseColor");
        difference.innerHTML = "-&#8377;" + total.toFixed(2);
    }
}


function addNewData(event) {
    let prop;
    let lessAmount = document.getElementById("lessAmount");
    let category = document.getElementById("category").value;
    let amount = document.getElementById("amount").value;
    if (!(document.getElementById("in").checked || document.getElementById("ex").checked) || category === "" || amount === "") return;
    amount = +amount;

    if (amount < 0) {
        event.preventDefault();
        lessAmount.innerHTML = "Please write amount 0 or greater than 0";
        return;
    }


    if (document.getElementById("in").checked) prop = "incomeColor";
    else prop = "expenseColor";

    getData();

    let id = Date.now();
    let data = {
        id, category, amount, prop
    };

    appData[id] = data;

    localStorage.setItem("appData", JSON.stringify(appData));

    createDiv(data);
}


function saveEditValue(event) {

    let prop;
    let lessAmount = document.getElementById("lessAmount1");
    let category = document.getElementById("category1").value;
    let amount = document.getElementById("amount1").value;

    if (category === "" || amount === "") return;

    amount = +amount;

    if (amount < 0) {
        event.preventDefault();
        lessAmount.innerHTML = "Please write amount 0 or greater than 0";
        return;
    }

    getData();

    let divId = event.target.value;
    appData[divId].amount = amount;
    appData[divId].category = category;
    localStorage.setItem("appData", JSON.stringify(appData));

    let valueData = appData[divId].prop === "expenseColor" ? "-&#8377;" + amount : "+&#8377;" + amount;

    for (let it = 0; it < list.childNodes.length; it += 2) {
        if (list.childNodes[it].id === divId) {
            console.log(list.childNodes[it]);
            list.childNodes[it].childNodes[1].innerHTML = category;
            list.childNodes[it].childNodes[2].innerHTML = valueData;
            break;
        }
    }

}


function editValue(event) {

    let categoryOfEditValue = event.target.parentNode.getElementsByTagName('p')[0].innerHTML;
    let amountOfEditValue = event.target.parentNode.getElementsByTagName('p')[1].innerHTML;
    let divId = +event.target.parentNode.id;

    save1.setAttribute("value", divId);
    if (amountOfEditValue[0] === '-') {
        document.getElementById("commonRadio").setAttribute("value", "Expense");
        document.getElementById("commonType").innerHTML = "Expense";
    } else {
        document.getElementById("commonRadio").setAttribute("value", "Income");
        document.getElementById("commonType").innerHTML = "Income";
    }

    document.getElementById("category1").setAttribute("value", categoryOfEditValue);
    document.getElementById("amount1").setAttribute("value", +amountOfEditValue.substring(2));

}