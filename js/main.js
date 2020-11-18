var picker = datepicker("#date");
picker.setMin(new Date());
var ToDoItem = (function () {
    function ToDoItem(task, dueDate, description, isCompleted) {
        this.task = task;
        this.dueDate = dueDate;
        this.description = description;
        this.isCompleted = isCompleted;
    }
    return ToDoItem;
}());
window.onload = function () {
    var addToList = document.getElementById("add-item");
    addToList.onclick = AddToList;
    loadSavedItems();
};
function loadSavedItems() {
    var itemList = getAllToDo();
    for (var i = 0; i < itemList.length; i++) {
        displayToDoItem(itemList[i]);
    }
}
function isValid() {
    var dataValid = true;
    var userTask = document.getElementById("task");
    if (userTask.value.trim() == "") {
        userTask.nextElementSibling.innerHTML = "Please enter a task to do.";
        dataValid = false;
    }
    var dueDate = document.getElementById("date");
    if (!Date.parse(dueDate.value)) {
        dueDate.nextElementSibling.innerHTML = "Please enter a valid date.";
        dataValid = false;
    }
    return dataValid;
}
function getToDoItem() {
    var task = document.getElementById("task").value;
    var date = new Date(document.getElementById("date").value);
    var description = document.getElementById("description").value;
    var completed = document.getElementById("completed").checked;
    var listItem = new ToDoItem(task, date, description, completed);
    return listItem;
}
function displayToDoItem(item) {
    var taskText = document.createElement("h2");
    taskText.innerText = item.task;
    var dueDate = document.createElement("p");
    var dateTodo = new Date(item.dueDate.toString());
    dueDate.innerText = dateTodo.toDateString();
    var descPopup = document.createElement("p");
    descPopup.className = "description-click";
    descPopup.innerText = "Click here to see description";
    var markCompleteSpan = document.createElement("span");
    markCompleteSpan.className = "mark-complete";
    markCompleteSpan.innerHTML = "&#9745;";
    var descPopupText = document.getElementById("info-paragraph");
    var itemDiv = document.createElement("div");
    itemDiv.appendChild(markCompleteSpan);
    itemDiv.appendChild(taskText);
    itemDiv.appendChild(dueDate);
    itemDiv.appendChild(descPopup);
    markCompleteSpan.onclick = completeOrIncomplete;
    descPopup.onclick = displayDescription;
    descPopup.onclick = function () {
        descPopupText.innerText = item.description;
        displayDescription();
    };
    if (item.isCompleted) {
        itemDiv.classList.add("completed");
    }
    else {
        itemDiv.classList.add("incomplete");
    }
    var todoDiv = document.getElementById("todo");
    todoDiv.appendChild(itemDiv);
}
function completeOrIncomplete() {
    var span = this;
    var spanClick = span.parentElement;
    if (spanClick.classList.contains("completed")) {
        spanClick.classList.add("incomplete");
        spanClick.classList.remove("completed");
    }
    else if (spanClick.classList.contains("incomplete")) {
        spanClick.classList.add("completed");
        spanClick.classList.remove("incomplete");
    }
}
function displayDescription() {
    var descClick = document.getElementById("info-popup");
    var closeButton = document.querySelector(".close-button");
    descClick.style.display = "block";
    closeButton.onclick = function () {
        descClick.style.display = "none";
    };
}
function AddToList() {
    if (isValid()) {
        var itemToAdd = getToDoItem();
        displayToDoItem(itemToAdd);
        saveToDo(itemToAdd);
    }
}
function saveToDo(item) {
    var currItems = getAllToDo();
    if (currItems == null) {
        currItems = new Array();
    }
    currItems.push(item);
    var currItemsString = JSON.stringify(currItems);
    localStorage.setItem(todokey, currItemsString);
}
var todokey = "todo";
function getAllToDo() {
    var itemString = localStorage.getItem(todokey);
    var item = JSON.parse(itemString);
    return item;
}
