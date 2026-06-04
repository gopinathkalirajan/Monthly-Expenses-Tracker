let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let budget = Number(localStorage.getItem("budget")) || 15000;

let chart;

function showPage(pageId){

document.querySelectorAll(".page").forEach(page=>{
page.classList.remove("active");
});

document.getElementById(pageId).classList.add("active");

}

function toggleTheme(){

document.body.classList.toggle("light-mode");

}

function setBudget(){

const value = document.getElementById("budgetInput").value;

if(value===""){
alert("Enter Budget");
return;
}

budget = Number(value);

localStorage.setItem("budget",budget);

updateUI();

}

function addExpense(){

const amount = document.getElementById("amount").value;

const category = document.getElementById("category").value;

const note = document.getElementById("note").value;

if(amount===""){
alert("Enter Amount");
return;
}

expenses.push({
amount:Number(amount),
category,
note,
date:new Date().toLocaleString()
});

localStorage.setItem(
"expenses",
JSON.stringify(expenses)
);

document.getElementById("amount").value="";
document.getElementById("note").value="";

updateUI();

}

function deleteExpense(index){

expenses.splice(index,1);

localStorage.setItem(
"expenses",
JSON.stringify(expenses)
);

updateUI();

}

function updateUI(){

let total = 0;

let categoryData = {
Food:0,
Travel:0,
Shopping:0,
Education:0,
Medical:0,
Entertainment:0,
Others:0
};

const historyList =
document.getElementById("historyList");

historyList.innerHTML="";

expenses.forEach((expense,index)=>{

total += expense.amount;

categoryData[expense.category] += expense.amount;

historyList.innerHTML += `

<div class="history-item">

<div>
<b>${expense.category}</b><br>
${expense.note}<br>
<small>${expense.date}</small>
</div>

<div>
₹${expense.amount}
<br><br>

<button
class="delete-btn"
onclick="deleteExpense(${index})">

Delete

</button>

</div>

</div>

`;

});

document.getElementById("totalExpense")
.innerText="₹"+total;

document.getElementById("budgetDisplay")
.innerText="₹"+budget;

document.getElementById("remaining")
.innerText="₹"+(budget-total);

document.getElementById("reportTotal")
.innerText="₹"+total;

let topCategory="-";
let highest=0;

for(let key in categoryData){

if(categoryData[key]>highest){

highest=categoryData[key];
topCategory=key;

}

}

document.getElementById("topCategory")
.innerText=topCategory;

document.getElementById("reportCategory")
.innerText=topCategory;

let percent=(total/budget)*100;

if(percent>100){
percent=100;
}

document.getElementById("progressBar")
.style.width=percent+"%";

updateChart(categoryData);

}

function updateChart(data){

const ctx =
document.getElementById("expenseChart");

if(chart){
chart.destroy();
}

chart = new Chart(ctx,{

type:"doughnut",

data:{

labels:Object.keys(data),

datasets:[{

data:Object.values(data)

}]

},

options:{
responsive:true
}

});

}

document
.getElementById("searchBox")
.addEventListener("keyup",function(){

const value =
this.value.toLowerCase();

const items =
document.querySelectorAll(".history-item");

items.forEach(item=>{

if(
item.innerText
.toLowerCase()
.includes(value)
){

item.style.display="flex";

}else{

item.style.display="none";

}

});

});

function downloadPDF(){

const { jsPDF } = window.jspdf;

const doc = new jsPDF();

doc.text(
"Smart Expense Tracker Report",
20,
20
);

let y=40;

expenses.forEach(expense=>{

doc.text(

`${expense.category}
- ₹${expense.amount}
- ${expense.note}`,

20,
y

);

y+=10;

});

doc.save("Expense_Report.pdf");

}

updateUI();