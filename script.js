const addBtn = document.querySelector("#addBtn");
const input = document.querySelector("#input");
const itemList = document.querySelector("ul");


class Cart {
    constructor(){
        this.basket = [];
    }

    addItem(newItem){
        this.basket.push(newItem);
    }

    removeItem(newItem){
        this.basket = this.basket.filter((item) => newItem !== item);
    }
}

const one = new Cart();

class Item {
    constructor(name, category, quantity){
        this.name = name;
        this.category = category;
        this.quantity = quantity;
    }

    changeQuantity(quantity){
        this.quantity = quantity;
    }
}

const bodyDiv = document.querySelector('.inputs');
const itemsDiv = document.querySelector('.items');
const listForm = document.querySelector('.list-form')

function createElement(name, element ,appendTo, text){
    let nameText = name;
    const listItems = document.querySelectorAll('.list-item');
    // console.log(listItems.length + 1);
    let idText = nameText + listItems.length;
    name = document.createElement(element);
    name.setAttribute('id', idText);
    name.textContent = text
    appendTo.append(name);
}

function createFormElement(name, element, type, appendTo){
    let itemLabel = document.createElement('label');
    itemLabel.setAttribute('for', name);

    name = document.createElement(element);
    name.type = type;

    if(element == 'select'){
        
        let categories = {
            Aisles: 'Aisles',
            Meat: 'Meat',
            Dairy: 'Dairy',
            Fruit: 'Fruit',
            Produce: 'Produce',
            Bakery: 'Bakery',
        };
        
        for(category in categories){
            // console.log(Object.values(categories));
            name.options[name.options.length] = new Option(categories[category], category);
        }
    }
    
    if(element == 'button'){
        name.textContent = 'Add to List';
        itemLabel.textContent = '';
    }

    let labelText = itemLabel.getAttribute('for');
    labelTextCapitalized = labelText.slice(0, 1).toUpperCase() + labelText.slice(1);
    if(type != 'checkbox'){
        itemLabel.textContent = labelTextCapitalized;
    }
    const listItems = document.querySelectorAll('.list-item');
    // console.log(listItems.length + 1);
    let idText = labelText + listItems.length;
    name.setAttribute('name', labelText);
    name.setAttribute('class', `${labelText}-input`);
    name.setAttribute('id', idText);

    itemLabel.append(name);
    appendTo.append(itemLabel);
}

function addToList(i){
    const listOfItems = document.querySelector('ul');
    const newListItem = document.createElement('li');
    let listNumber = document.querySelectorAll('.list-item').length
    newListItem.classList.add('list-item');
    newListItem.setAttribute('id', `li-${listNumber}`)
    // console.log(listNumber); 
    createFormElement('item-check', 'input', 'checkbox', newListItem );
    createElement('name', 'span', newListItem, i.name);
    createElement('quantity', 'span', newListItem, i.quantity);
    createElement('category', 'span', newListItem, i.category);
    
    listOfItems.append(newListItem);
    
    let checkbox = document.querySelector(`#item-check${listNumber}`);
    // console.log(checkbox)
    // console.log(checkbox)

    checkbox.addEventListener('change', (e) => {
        boxChecked(newListItem, e.target.checked)
    })
}

function boxChecked(listItem, isChecked){
    const spans = listItem.querySelectorAll('span');
    spans.forEach((span) => {
        console.log(span)
        span.style.transition = 'color 0.3s';
        span.style.color = isChecked ? 'lightgrey' : 'black';
        span.style.textDecoration = isChecked ? 'line-through' : 'none';
    })
}


createFormElement('name', 'input', 'text' , listForm);
createFormElement('quantity' , 'input', 'number' ,listForm);
createFormElement('category', 'select', 'text' ,listForm);
createFormElement('submit', 'button', 'submit', listForm);

let submitButton = listForm.querySelector('.submit-input');
submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    let formData = new FormData(listForm);
    let formDataObject = {};

    for(let [key, value] of formData.entries()){
        formDataObject[key] = value;
    }

    one.addItem(new Item(formDataObject.name, formDataObject.category, formDataObject.quantity))
    
    listForm.reset();
    addToList(formDataObject);
    // console.log(formDataObject);    
})
