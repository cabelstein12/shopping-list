const addBtn = document.querySelector("#addBtn");
const input = document.querySelector("#input");
const itemList = document.querySelector("ul");
const bodyDiv = document.querySelector('.inputs');
const itemsDiv = document.querySelector('.items');
const listForm = document.querySelector('.list-form');
let listItem;

class Cart {
    constructor(id){
        this.basket = [];
        this.id = id;
    }
    
    addItem(newItem){
        this.basket.push(newItem);
    }
    
    removeItem(selectedItem){
        this.basket = this.basket.filter((item) => selectedItem !== item);
    }
}

const one = new Cart('cartOne');
const two = new Cart('cartTwo');
const three = new Cart('cartThree');
let selectedCart = one;


class Item {
    constructor(name, category, quantity){
        this.name = name;
        this.quantity = quantity;
        this.category = category;
    }

    changeQuantity(quantity){
        this.quantity = quantity;
    }
}

let cartOne = document.getElementById('cart-one');
let cartTwo = document.getElementById('cart-two');
let cartThree = document.getElementById('cart-three');
const cartElements = [cartOne, cartTwo, cartThree];

function createElement(name, element ,appendTo, text){
    let nameText = name;
    const listItems = document.querySelectorAll('.list-item');
    
    let idText = nameText + listItems.length;
    name = document.createElement(element);
    name.setAttribute('id', idText);
    name.setAttribute('index', listItems.length);
    name.textContent = text;
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
    listItem = listItems.length;
    let idText = labelText + listItems.length;
    name.setAttribute('name', labelText);
    name.setAttribute('class', `${labelText}-input`);
    name.setAttribute('id', idText);

    itemLabel.append(name);
    appendTo.append(itemLabel);
}


function modifyDom(i){
    let listNumber = document.querySelectorAll('.list-item').length
    const listOfItems = document.querySelector('ul');
    const newListItem = document.createElement('li');
    newListItem.classList.add('list-item');
    newListItem.setAttribute('id', `li-${listNumber}`)

    createFormElement('item-check', 'input', 'checkbox', newListItem );
    createElement('name', 'span', newListItem, i.name);
    createElement('quantity', 'span', newListItem, i.quantity);
    createElement('category', 'span', newListItem, i.category);
    createElement('deleteBtn', 'button', newListItem, i.delete);

    
    listOfItems.append(newListItem);
    newListItem.setAttribute('index', listNumber);

    const deleteBtn = newListItem.querySelector('button');
    deleteBtn.classList.add('delete-button');
    deleteBtn.addEventListener('click', () => {
        // newListItem.remove();
        removeFromCart(selectedCart, listNumber);
        clearDom()
        loadBasket(selectedCart)
    })
    newListItem.querySelector('button').textContent = 'x';
    let checkbox = document.querySelector(`#item-check${listNumber}`);

    checkbox.addEventListener('change', (e) => {
        boxChecked(newListItem, e.target.checked, selectedCart)
    })
}

function addToCart(selectedCart, formDataObject){
   return selectedCart.addItem(new Item(formDataObject.name, formDataObject.category, formDataObject.quantity));

}

function removeFromCart(selectedCart, index){
    selectedCart.removeItem(selectedCart.basket[index])
    saveBasket(selectedCart)
}


function boxChecked(listItem, isChecked, selectedCart){
    const spans = listItem.querySelectorAll('span');
    spans.forEach((span) => {
        span.style.transition = 'color 0.3s';
        span.style.color = isChecked ? 'lightgrey' : 'black';
        span.style.textDecoration = isChecked ? 'line-through' : 'none';
    })
    listItem.querySelector('button').style.transition = 'opacity 0.3s';
    listItem.querySelector('button').style.opacity = isChecked ? 0.3 : 1.0;

    const listNumber = listItem.getAttribute('index');
    const checkboxKey = `${selectedCart.id}-checkbox-${listNumber}`;
    localStorage.setItem(checkboxKey, isChecked)
}


createFormElement('name', 'input', 'text' , listForm);
createFormElement('quantity' , 'input', 'number' ,listForm);
createFormElement('category', 'select', 'text' ,listForm);
createFormElement('submit', 'button', 'submit', listForm);
document.querySelector("#name0").focus();

let submitButton = listForm.querySelector('.submit-input');
submitButton.addEventListener('click', (e) => {
    e.preventDefault();

    let formDataObject = getItemInfo();
    addToCart(selectedCart ,formDataObject);
    modifyDom(formDataObject);
    saveBasket(selectedCart)

    document.querySelector("#name0").focus();
    listForm.reset();
})

function loadCheckboxStates(selectedCart){
    document.querySelectorAll('.list-item').forEach((listItem) => {
        const listNumber = listItem.getAttribute('index');
        const checkboxKey = `${selectedCart.id}-checkbox-${listNumber}`;
        const isChecked = localStorage.getItem(checkboxKey) === 'true';

        const checkbox = listItem.querySelector('input[type="checkbox"]');
        if(checkbox){
            checkbox.checked  = isChecked;
            boxChecked(listItem, isChecked, selectedCart)
        }
    })
}

function getItemInfo(){
    let formData = new FormData(listForm);
    let formDataObject = {};
    for(let [key, value] of formData.entries()){
        formDataObject[key] = value;
    }
    return formDataObject
}

function saveBasket(selectedCart){
   localStorage.setItem(selectedCart.id, JSON.stringify(selectedCart.basket));
}

function clearDom(){
    document.querySelectorAll('.list-item').forEach(e => e.remove())
}
function loadBasket(selectedCart){
    let getList = JSON.parse(localStorage.getItem(selectedCart.id));

    if(getList && localStorage.length > 0){
        let item ;
        clearDom()
        for(let i = 0 ; i < getList.length; i++){
            item = new Item(getList[i].name, getList[i].category, getList[i].quantity);

            modifyDom(item);
            if(selectedCart.basket.length != getList.length){
                selectedCart.addItem(item);
            }
        }
        loadCheckboxStates(selectedCart);
    }
}


cartElements.forEach((cart) => {
    cart.addEventListener('click', (e) => {
        e.target.style.color = 'blue';
        if(e.target == cartOne){
            cartTwo.style.color = 'black';
            cartThree.style.color = 'black';
            selectedCart = one;
        } else if(e.target == cartTwo){
            cartOne.style.color = 'black';
            cartThree.style.color = 'black';
            selectedCart = two
        } else if(e.target == cartThree){
            cartOne.style.color = 'black';
            cartTwo.style.color = 'black';
            selectedCart = three
        }
        loadBasket(selectedCart);
        saveBasket(selectedCart);
    })
})
loadBasket(selectedCart);
cartOne.style.color = 'blue';