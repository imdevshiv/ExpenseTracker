const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');


/*const dummyTransanction =[{id:1,text:'flower',amount:-20},
{id:2,text:'salary',amount:300},
{id:3,text:'book',amount:-20},
{id:4,text:'camera',amount:150}]*/


const localStorageTransaction = JSON.parse(localStorage.getItem('transaction'));

let transactions = 
                   localStorage.getItem('transaction')!=null?
                   localStorageTransaction:[];
//add transaction
function addTransation(e){
    e.preventDefault();

    if(text.value.trim()=== '' || amount.value.trim()===''){
        alert('Please add a text and amount');
    }else{
        const transaction={
            id:generateID(),
            text:text.value,
            amount:+amount.value
            

        };
        transactions.push(transaction);
        addTransationDOM(transaction);
        updateValues();

        updateLocalStorage();
        text.value='';
        amount.value='';
       
    }
    

}
//generate random id
function generateID(){
    return Math.floor(Math.random()*1000000)
}
//Add transaction to dom list 

function addTransationDOM(transaction){
    //get sign
    const sign = transaction.amount<0?'-':'+';

    const item =document.createElement('li');

    //add class based on value
    item.classList.add(transaction.amount<0?'minus':'plus')
    item.innerHTML=`${transaction.text}<span>${sign}${Math.abs(transaction.amount)}
                    </span><button class="delete-btn" onclick="removeTransation
                    (${transaction.id})">X</button>`;
    list.appendChild(item);
}
//Update the balence income and expense
function updateValues(){
    const amounts = transactions.map(transanction=>transanction.amount)
    const total =amounts.reduce((acc,item)=>(acc+=item),0).toFixed(2);
    const income=amounts
               .filter(item=>item>0)
               .reduce((acc,item)=>(acc+=item),0)
               .toFixed(2);
               

    const expense = (amounts
        .filter(item=>item<0)
        .reduce((acc,item)=>(acc+=item),0)*-1)
        .toFixed(2);

    balance.innerHTML=`&#8377 ${total}`;
    money_plus.innerHTML=`&#8377 ${income}`;
    money_minus.innerHTML=`&#8377 ${expense}`;
    
}
//Remove transacton by ID
function removeTransation(id){
    transactions = transactions.filter(transanction=>transanction.id!==id);
    updateLocalStorage();
    init();
}
//uPDATE LOCAL STROGE TRANSACTION
function updateLocalStorage(){
    localStorage.setItem('transaction',JSON.stringify(transactions))
    
}
//Init app
function init(){
    list.innerHTML= '';
    transactions.forEach(addTransationDOM)
    updateValues();
}
init();

form.addEventListener('submit',addTransation) 