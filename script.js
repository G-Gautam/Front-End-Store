/*
    Parse is used to perform arithmetic with string values
    Table.rows access the information
    Some hard coded elements
    Not the most efficient but performs well and can be improved if given further time
*/


//All items have a 13% tax rate
var taxRate = document.getElementById("tax");

//Empty List for shopping cart
var cart = new Object();
var password = "pass";

//Determine State of Store
var isManager = new Boolean(false);
var langNew = new Boolean(false);

//Get Attributes (function name) of Item from ID
//Attributes are attained from query Selector
function getItemName(itemID) {
    var itemName;
    itemName = document.querySelector("#" + itemID + " #name");
    return itemName.innerHTML;
}
function getItemPrice(itemID) {
    var itemPrice;
    itemPrice = document.querySelector("#" + itemID + " #price");
    return itemPrice.innerHTML;
}
function getItemQuantity(itemID) {
    var itemQuantity = document.querySelector("#" + itemID + " #quantity").value;
    return itemQuantity
}
function getItemStock(itemID) {
    var itemStock = document.querySelector("#" + itemID + " #stock");
    return itemStock.innerHTML;
}

//Does Item Already Exist in the Cart?
//If it does, only the quantity is updated
function checkCartForItem(itemID) {
    var cart = document.getElementById("table");
    var searchItem = getItemName(itemID);

    //Search the cart by iterating the table's row's 1st cell wher erthe name is
    //If found, return the row index
    for (var i = 0; i < cart.rows.length - 1; i++) {
        if (searchItem == cart.rows[i].cells[0].innerHTML) {
            return cart.rows[i];
        }
    }
    //If not, return null
    return 0;
}

//Adds all prices in cell[2]
function subTotal() {
    var table = document.getElementById("table");
    var subTotal = 0;

    for (var i = 1; i < table.rows.length - 3; i++) {
        var price;
        price = table.rows[i].cells[2].innerHTML.slice(1);
        subTotal = subTotal + parseInt(price);
    }

    return subTotal;
}

//Takes the subtotal and multiplies it by the tax (13%)
function total() {
    var table = document.getElementById("table");
    var total = 0;

    var subTotal = table.rows[table.rows.length - 3].cells[2].innerHTML.slice(1);   //subtotal without the dollar sign
    var tax = table.rows[table.rows.length - 2].cells[2].innerHTML.slice(0, 2);     //tax without the percent sign

    subTotal = parseInt(subTotal);
    tax = parseFloat(tax);

    total = subTotal * (1 + (tax / 100.00));
    return total.toFixed(2);                                                        //Limits decimal to 2 places
}

//Most complex function of the program
//Could be split into several functions but is limited through time constraint of the project
//Adds the item to cart while handling all exceptions
function addItem(buttonClicked) {
    var itemID = buttonClicked.slice(1);                                            //Button ID is simply the ItemID but it starts with a 'b' 
    var itemName = getItemName(itemID);
    var itemPrice = getItemPrice(itemID);
    var itemQuantity = getItemQuantity(itemID);
    var itemStock = getItemStock(itemID);

    itemPrice = itemPrice.slice(14);                                                //Rids of the string Price:
    itemStock = itemStock.slice(17);                                                //Same principle as above

    var priceMath = itemPrice.slice(1);                                             //Remove dollar sign
    priceMath = parseInt(priceMath);
    itemStock = parseInt(itemStock);

    var table = document.getElementById("table");

    itemStock = itemStock - itemQuantity;                                           //Stock decreases if user adds object to cart

    //Checks item for cart
    if (checkCartForItem(itemID) == 0) {
        //Must have inventory to proceed
        if (itemStock >= 0) {
            
            //Builds the cart for each object dynamically 
            var row = table.insertRow(1);                               
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);

            //Sets price, name, quantity
            cell1.innerHTML = itemName;
            cell2.innerHTML = itemQuantity;
            //Price depends on quantity
            cell3.innerHTML = "$" + priceMath * parseInt(cell2.innerHTML);

            //Add Button
            //Calls the addItem function as it handles the quantity update exception already
            var btnPlus = document.createElement("BUTTON");        
            var t = document.createTextNode("+");       
            btnPlus.onclick = function () {
                addItem(buttonClicked);
            }
            btnPlus.appendChild(t);                                
            cell4.appendChild(btnPlus);
            
            //Minus Button
            var btnMinus = document.createElement("BUTTON");        
            var t = document.createTextNode("--");       
            btnMinus.onclick = function () {
                //Decrease quantity by 1
                cell2.innerHTML = parseInt(cell2.innerHTML) - 1;
                //Updates price based on quantity
                cell3.innerHTML = "$" + priceMath * parseInt(cell2.innerHTML);
                //Updates sub and total
                table.rows[table.rows.length - 3].cells[2].innerHTML = "$" + subTotal();
                table.rows[table.rows.length - 1].cells[2].innerHTML = "$" + total();
                //Updates stock by first getting it and then adding one
                itemStock = document.querySelector("#" + itemID + " #stock").innerHTML;
                itemStock = itemStock.slice(17);
                itemStock++;
                document.querySelector("#" + itemID + " #stock").innerHTML = "<b>Quantity</b>" + ": " + itemStock;
                
                //Deletes item if its decremented to 0
                if (parseInt(cell2.innerHTML) == 0) {
                    row.parentNode.removeChild(row);
                }

            }
            btnMinus.appendChild(t);                               
            cell4.appendChild(btnMinus);

            //Delete Button
            var btnDel = document.createElement("BUTTON");        
            var t = document.createTextNode("Delete");       

            //Deletes the entire row
            btnDel.onclick = function () {
                row.parentNode.removeChild(row);
                //Update sub and total
                table.rows[table.rows.length - 3].cells[2].innerHTML = "$" + subTotal();
                table.rows[table.rows.length - 1].cells[2].innerHTML = "$" + total();
                //Update stock by adding the quantity of the deleted item
                itemStock = itemStock + parseInt(cell2.innerHTML);
                document.querySelector("#" + itemID + " #stock").innerHTML = "<b>Quantity</b>" + ": " + itemStock;

            }
            btnDel.appendChild(t);                              
            cell5.appendChild(btnDel);


            document.querySelector("#" + itemID + " #stock").innerHTML = "<b>Quantity</b>" + ": " + itemStock;
        }
        //If no more inventory for the item
        else {
            alert("Item Stock Not Sufficient");
        }
    }
    //If found in the cart already
    else {
        //Must have in stock condition
        if (itemStock >= 0) {
            //Create a list to store the row returned by the checkCartForITem function
            var rowOfItem = new Object();
            rowOfItem[0] = checkCartForItem(itemID);
            //Takes the row which the item is in and increases the value by whatever quantity specified (if none is specified, default it 1)
            rowOfItem[0].cells[1].innerHTML = parseInt(rowOfItem[0].cells[1].innerHTML) + parseInt(itemQuantity);
            //Update Stock
            document.querySelector("#" + itemID + " #stock").innerHTML = "<b>Quantity</b>" + ": " + itemStock;
            //Update Price
            rowOfItem[0].cells[2].innerHTML = "$" + priceMath * parseInt(rowOfItem[0].cells[1].innerHTML);
        }
        //Not in stock
        else {
            alert("Item Stock Not Sufficient");
        }
    }
    //update sub and total
    table.rows[table.rows.length - 3].cells[2].innerHTML = "$" + subTotal();
    table.rows[table.rows.length - 1].cells[2].innerHTML = "$" + total();

}
//Enter password to change any p element
//Not the most efficient as the manager can change the Price: string
//Manager given the benefit of the doubt :P
function enterManagerMode() {
    var x = document.querySelectorAll("p");
    for (var i = 0; i < x.length; i++) {
        x[i].contentEditable = true;
    }
}
//Exit by entering the password again
function exitManagerMode() {
    var x = document.querySelectorAll("p");
    for (var i = 0; i < x.length; i++) {
        x[i].contentEditable = false;
    }
}
//Determines if password is to enter the mode or exit it
//Dependent on current state
function switchMode() {
    if (document.getElementById("password").value == password) {
        if (isManager == false) {
            enterManagerMode();
            isManager = true;
        }
        else {
            exitManagerMode();
            isManager = false;
        }
    }
    //Wrong Password
    else {
        document.getElementById("error").innerHTML = "ERROR";
    }
}

//Hard coded language change dependent on current language
function changeLang() {
    if (langNew == false) {
        document.getElementById("changeLang").innerHTML = "English";
        document.querySelector("#OVOSoph h2").innerHTML = "Esta es la chaqueta Sophmore";
        document.querySelector("#OVOHood h2").innerHTML = "Sweat à capuche de tournoi OVO";
        document.querySelector("#YeezyBoost h2").innerHTML = "Yeezy Renforcer 350 V2";
        document.querySelector("#YeezyTract h2").innerHTML = "Pantalon de survêtement Calabasas";
        document.querySelector("#RecoTee h2").innerHTML = "T-shirt de récupération";
        document.querySelector("#SlimHood h2").innerHTML = "T-shirt long et mince";
        document.querySelector("#LilTee h2").innerHTML = "T-shirt promotionnel de Tha Carter V";
        document.querySelector("#LilHood h2").innerHTML = "Lil Wayne X T-shirt Wikipédia Crystals X du conseil consultatif";
        document.querySelector("#XOLongTee h2").innerHTML = "XO Classic Logo Manches Longues";
        document.querySelector("#KissTee h2").innerHTML = "Tee shirt fantastique pour Kiss Land";
        langNew = true;
    }
    else {
        document.getElementById("changeLang").innerHTML = "French";
        document.querySelector("#OVOSoph h2").innerHTML = "OVO Sophmore Jacket"
        document.querySelector("#OVOHood h2").innerHTML = "OVO Tournament Hoodie"
        document.querySelector("#YeezyBoost h2").innerHTML = "Yeezy Boost 350 V2"
        document.querySelector("#YeezyTract h2").innerHTML = "Calabasas Track Pants"
        document.querySelector("#RecoTee h2").innerHTML = "Recovery T-shirt"
        document.querySelector("#SlimHood h2").innerHTML = "Slim Shady Long Tee"
        document.querySelector("#LilTee h2").innerHTML = "Tha Carter V Promo T-Shirt"
        document.querySelector("#LilHood h2").innerHTML = "Lil Wayne X Advisory Board Crystals X Wikipedia T-shirt"
        document.querySelector("#XOLongTee h2").innerHTML = "XO Classic Logo Longsleeve"
        document.querySelector("#KissTee h2").innerHTML = "Kiss Land Super Fantastic Tee"

        langNew = false;
    }

}

//To buy, open a window confirm tab
function buy() {
    var table = document.getElementById("table");
    var total = table.rows[table.rows.length - 1].cells[2].innerHTML;
    if (confirm("Proceed with your shopping cart?")) {
        alert("Your total is: " + total);
        reset(); //resets the store
    }
    else {
        //do nothing
    }

}
//resets sub and total
//All quantity is also set back
//Cart is empty
function reset() {
    var table = document.getElementById("table");

    table.rows[table.rows.length - 3].cells[2].innerHTML = "$" + 0;
    table.rows[table.rows.length - 1].cells[2].innerHTML = "$" + 0;
    var x = document.querySelectorAll("#stock");
    for (var i = 0; i < 10; i++) {
        x[i].innerHTML = "<b>Quantity</b>" + ": 5";
    }

    var i = 0;
    while (i != table.rows.length - 4) {
        table.rows[1].parentNode.removeChild(table.rows[1]);

    }
}