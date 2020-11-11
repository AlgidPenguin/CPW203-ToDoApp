const picker = datepicker("#date");
picker.setMin(new Date());

class ToDoItem{
    task:string;
    dueDate:Date;
    isCompleted:boolean;

    constructor(task:string, dueDate:Date, isCompleted:boolean) {
        this.task = task;
        this.dueDate = dueDate;
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
    let completed = (<HTMLInputElement>document.getElementById("completed")).checked;

    let listItem = new ToDoItem(task, date, completed);
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

    let itemDiv = document.createElement("div");
    itemDiv.onclick = completeOrIncomplete;
    itemDiv.appendChild(taskText);
    itemDiv.appendChild(dueDate);

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
    let divClick = <HTMLElement>this;

    if(divClick.classList.contains("completed")) {
        divClick.classList.add("incomplete");
        divClick.classList.remove("completed");
    }

    else if(divClick.classList.contains("incomplete")) {
        divClick.classList.add("completed");
        divClick.classList.remove("incomplete");
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