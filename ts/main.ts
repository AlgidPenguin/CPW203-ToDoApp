const picker = datepicker("#date");
picker.setMin(new Date());

class ToDoItem{
    task:string;
    dueDate:Date;
    description:string;
    isCompleted:boolean;

    constructor(task:string, dueDate:Date, description:string, isCompleted:boolean) {
        this.task = task;
        this.dueDate = dueDate;
        this.description = description;
        this.isCompleted = isCompleted;
    }
}

window.onload = function() {
    let addToList = document.getElementById("add-item");
    addToList.onclick = AddToList;

    loadSavedItems();
}

function loadSavedItems() {
    let itemList = getAllToDo(); // reads from storage

    for(let i = 0; i < itemList.length; i++) {
        displayToDoItem(itemList[i]); 
    }
}


/**
 * See if data is valid
 */
function isValid():boolean {
    let dataValid = true;

    let userTask = <HTMLInputElement>document.getElementById("task");
    if(userTask.value.trim() == "") {
        userTask.nextElementSibling.innerHTML = "Please enter a task to do.";
        dataValid = false;
    }

    let dueDate = (<HTMLInputElement>document.getElementById("date"));
    if(!Date.parse(dueDate.value)) {
        dueDate.nextElementSibling.innerHTML = "Please enter a valid date.";
        dataValid = false;
    }

    return dataValid;
}

/**
 * Get the toDoItem from the form
 */
function getToDoItem():ToDoItem {
    let task = (<HTMLInputElement>document.getElementById("task")).value;
    let date = new Date((<HTMLInputElement>document.getElementById("date")).value);
    let description = (<HTMLInputElement>document.getElementById("description")).value;
    let completed = (<HTMLInputElement>document.getElementById("completed")).checked;

    let listItem = new ToDoItem(task, date, description, completed);
    return listItem;
}

/**
 * Display to do item on the page
 */
function displayToDoItem(item:ToDoItem):void{
    let taskText = document.createElement("h2");
    taskText.innerText = item.task;

    let dueDate = document.createElement("p");
    // dueDate.innerText = item.dueDate.toDateString();
    let dateTodo = new Date(item.dueDate.toString());
    dueDate.innerText = dateTodo.toDateString();

    let descPopup = document.createElement("p");
    descPopup.className = "description-click";
    descPopup.innerText = "Click here to see description";

    let markCompleteSpan = document.createElement("span");
    markCompleteSpan.className = "mark-complete";
    markCompleteSpan.innerHTML = "&#9745;";

    let descPopupText = document.getElementById("info-paragraph");

    let itemDiv = document.createElement("div");
    
    itemDiv.appendChild(markCompleteSpan);
    itemDiv.appendChild(taskText);
    itemDiv.appendChild(dueDate);
    itemDiv.appendChild(descPopup);
    

    markCompleteSpan.onclick = completeOrIncomplete;
    descPopup.onclick = displayDescription;

    descPopup.onclick = function() {
        descPopupText.innerText = item.description;
        displayDescription();
    }

    if(item.isCompleted) {
        itemDiv.classList.add("completed");
    }

    else{
        itemDiv.classList.add("incomplete");
    }

    let todoDiv = document.getElementById("todo");
    todoDiv.appendChild(itemDiv);
}

function completeOrIncomplete():void {
    let span = <HTMLElement>this;
    let spanClick = span.parentElement;

    if(spanClick.classList.contains("completed")) {
        spanClick.classList.add("incomplete");
        spanClick.classList.remove("completed");
    }

    else if(spanClick.classList.contains("incomplete")) {
        spanClick.classList.add("completed");
        spanClick.classList.remove("incomplete");
    }
}

function displayDescription():void {
    let descClick = document.getElementById("info-popup");
    let closeButton = <HTMLElement>document.querySelector(".close-button");

    descClick.style.display = "block";

    closeButton.onclick = function() {
        descClick.style.display = "none";
    }
}

function AddToList():void {
    if(isValid()) {
        let itemToAdd = getToDoItem();
        displayToDoItem(itemToAdd);
        saveToDo(itemToAdd);
    }
}

function saveToDo(item:ToDoItem):void {
    let currItems = getAllToDo();
    if(currItems == null) { // No items, null
        currItems = new Array();
    }


    currItems.push(item); // Add item to array of current item list

    let currItemsString = JSON.stringify(currItems);
    localStorage.setItem(todokey, currItemsString);
}

const todokey = "todo";

/**
 * Get stored ToDo items or return null if
 * none are found
 */
function getAllToDo():ToDoItem[] {
    let itemString = localStorage.getItem(todokey);
    let item:ToDoItem[] = JSON.parse(itemString);
    return item;
}