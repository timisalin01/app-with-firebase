import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-b4a64-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    const errorMessageEl = document.getElementById('error-message');
        errorMessageEl.textContent = 'Te rugăm să adaugi un produs.';

    if (inputValue.trim() === '') {
        return; 
      }
    push(shoppingListInDB, inputValue)

    errorMessageEl.textContent = '';
    inputFieldEl.value = '';

    clearInputFieldEl()
    

})

onValue(shoppingListInDB, function(snapshot){

    if (snapshot.exists()){
        let shoppingArray = Object.entries(snapshot.val())

    clearShoppingListEl()

        for(let i = 0; i < shoppingArray.length; i++){
            let currentItem = shoppingArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            

            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "<span style='color: red; font-weight: bold; margin: 0 auto; font-size: 20px;'>Nu sunt produse in LISTA TA</span>";
    }

    
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl(){
    inputFieldEl.value = '';
}

function appendItemToShoppingListEl(item){
    
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    newEl.addEventListener("click", function(){
        let exactLocationShopList = ref(database, `shoppingList/${itemID}`)

        remove(exactLocationShopList)
    })

    shoppingListEl.append(newEl)


}