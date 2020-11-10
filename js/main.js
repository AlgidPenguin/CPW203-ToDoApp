var picker = datepicker("#date");
picker.setMin(new Date());
var ToDoItem = (function () {
    function ToDoItem(task, dueDate, isCompleted) {
        this.task = task;
        this.dueDate = dueDate;
        this.isCompleted = isCompleted;
    }
    return ToDoItem;
}());
window.onload = function () {
    var addToList = document.getElementById("add-item");
    addToList.onclick = AddToList;
    loadSavedItem();
};
function loadSavedItem() {
    var item = getToDo();
    displayToDoItem(item);
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
    var completed = document.getElementById("completed").checked;
    var listItem = new ToDoItem(task, date, completed);
    return listItem;
}
function displayToDoItem(item) {
    var taskText = document.createElement("h2");
    taskText.innerText = item.task;
    var dueDate = document.createElement("p");
    var dateTodo = new Date(item.dueDate.toString());
    dueDate.innerText = dateTodo.toDateString();
    var itemDiv = document.createElement("div");
    itemDiv.onclick = completeOrIncomplete;
    itemDiv.appendChild(taskText);
    itemDiv.appendChild(dueDate);
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
    var divClick = this;
    if (divClick.classList.contains("completed")) {
        divClick.classList.add("incomplete");
        divClick.classList.remove("completed");
    }
    else if (divClick.classList.contains("incomplete")) {
        divClick.classList.add("completed");
        divClick.classList.remove("incomplete");
    }
}
function AddToList() {
    if (isValid()) {
        var itemToAdd = getToDoItem();
        displayToDoItem(itemToAdd);
        saveToDo(itemToAdd);
    }
}
function saveToDo(item) {
    var itemString = JSON.stringify(item);
    localStorage.setItem(todokey, itemString);
}
var todokey = "todo";
function getToDo() {
    var itemString = localStorage.getItem(todokey);
    var item = JSON.parse(itemString);
    return item;
}
