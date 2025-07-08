const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    addTodoItem();
});

function addTodoItem() {
    const todoText = input.value.trim();
    if (todoText === '') return;
    
    const todoItem = createTodoItem(todoText);
    todoList.appendChild(todoItem);
    
    input.value = '';
}

function createTodoItem(todoText) {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = 'download.jpeg'; 
    const text = document.createTextNode(todoText);

    li.addEventListener('click', function() {
        li.classList.toggle('completed');
    });
    
    li.appendChild(img);
    li.appendChild(text);
    
    return li;
}

document.getElementById('reset-button').addEventListener('click', function() {
    todoList.innerHTML = ''; 
});

input.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTodoItem();
    }
});
