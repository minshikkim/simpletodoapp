//Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todolist = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');


//Event Listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', ajaxAddTodo);
todolist.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);





//Functions
function addTodo(result){
    
    console.log(`result:${JSON.parse(result)._id}`)

    //Todo DIV
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");
    todoDiv.id = JSON.parse(result)._id
    
    // CREATE Li
    const newTodo = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);

    

    // //ADD TODO TO LOCALSTORAGE
    // saveLocalTodos(todoInput.value);

    // CREATE MARK BUTTON
    const completeButton = document.createElement('button');
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.classList.add("complete-btn");
    todoDiv.appendChild(completeButton);


    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    //APPEND TO LIST
    todolist.appendChild(todoDiv);


    //Clear Todo INPUT VALUE;
    todoInput.value = "";
}

function deleteCheck(e){
    const item = e.target;
    console.log(e.target);
    //DELETE
    if(item.classList[0] === 'trash-btn'){
        const todo = item.parentElement;
        const content = todo.childNodes[0].innerText;

        //Animation
        todo.classList.add('fall');
        todo.addEventListener('transitionend', () => {
            todo.remove();
        });

        // DELETE TODOITEM FROM DATABASE
        ajaxDeleteTodo(todo)

        // todo.remove();
        // removeLocalTodos(content);
    }
    
    //CHECK MARK // 배우자!! 
    if(item.classList[0] === 'complete-btn'){
        const todo = item.parentElement;
        todo.classList.toggle("completed");
        console.log(`todo`, todo.className);
        console.log('todo', todo.id);

        // 상태만을 담당하는 함수를 만들자.
        // => 파라미터 ; todo.className , 
        // 체크시 로컬저장소에서 해당 부분의 status 값을 true 로 바꾸고 다시 저장한다.
        // updateTodo(todo);
        // 체크를 취소한다면 status 값을 false 로 다시 만들고 저장한다.
        ajaxUpdateTodo(todo)
    }
}


function filterTodo(e){

    console.log('filter')
    const todos = todolist.childNodes;
    todos.forEach(function(todo){
        switch(e.target.value){
            case "all":
                console.log(e.target.value)
                todo.style.display = 'flex';
                break;
            case "completed":
                // if(todo.classList.contains('completed')){
                //     todo.style.display = 'flex';
                // }else{
                //     todo.style.display = "none";
                // }
                console.log(e.target.value)
                break;
            case "uncompleted":
                console.log(e.target.value)
                // if(!todo.classList.contains('completed')){
                //     todo.style.display = 'flex';
                // }else{
                //     todo.style.display = "none";
                // }
        }    
    })
    

}


function saveLocalTodos(todo){
    //CHECK -- Hey Do I already have thing in there?
    let todos = [];
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    
    let jsonObj = {
        'content' : todo,
        'status' : 'uncompleted',
    }

    todos.push(jsonObj);
    localStorage.setItem("todos", JSON.stringify(todos));
}


function getTodos(){

    let todos = [];
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.forEach((todo) => {

        //Todo DIV
        const todoDiv = document.createElement('div');

        // 체크 되어있는 지 안되어있는 지 확인한다.
        if(todo.status === "uncompleted"){
            todoDiv.classList.add('todo');
        }else{
            todoDiv.classList.add('todo', 'completed');
        }

        
        // CREATE Li
        const newTodo = document.createElement('li');
        newTodo.innerText = todo.content;
        newTodo.classList.add('todo-item');
        todoDiv.appendChild(newTodo);

        // CREATE MARK BUTTON
        const completeButton = document.createElement('button');
        completeButton.innerHTML = '<i class="fas fa-check"></i>';
        completeButton.classList.add("complete-btn");
        todoDiv.appendChild(completeButton);


        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);

        //APPEND TO LIST
        todolist.appendChild(todoDiv);
    })
}


function removeLocalTodos(todo){

    console.log(`removeLocalTodos (${todo}) `);
    //CHECK -- Hey Do I already have thing in there?
    let todos = [];
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else {
        todos = JSON.parse(localStorage.getItem('todos'))
        console.log(typeof(todos));

        //FIND INDEX WHICH WAS DELETED
        const index = todos.findIndex(td => {
            console.log(`todo.content : ${td.content}`);
            return td.content === todo;
        });


        //DELECT ELEMENT IN LOCALSTOARAGE AND RESTORE DATA
        todos.splice(index, 1);
        localStorage.setItem("todos", JSON.stringify(todos));
    }
    
}

function updateTodo(todo){

    let todos = [];
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else {
        // 교체할 대상인 로컬저장소로 부터 데이터를 가져옵니다.
        const todos = JSON.parse(localStorage.getItem('todos'));

        // 다만 찾기 위해서는 컨텐트의 내용으로 찾을 예정이기 떄문에 li 태그의 텍스트 내용도 가져와야 합니다.
        const content = todo.childNodes[0].innerText; 

        // 교체할 부분을 찾고 해당 부분의 status 의 value 값을 조정합니다.
        // 교체할 부분을 찾기 위해서 index 를 이용해 찾습니다.
        const index = todos.findIndex((td,index) => {
            console.log(`todo.content : ${td.content}`);
            return content === td.content;
        });

        if(todo.className === "todo completed"){
            console.log('실행? todo completed');
            //UPDATE ELEMENT IN LOCALSTOARAGE AND RESTORE DATA
            todos.splice(index, 1, 
                    {
                        "content" : todos[index].content,
                        "status" : "completed"
                    }
                );
            localStorage.setItem("todos", JSON.stringify(todos));
            
        }else{
            console.log('실행? todo uncompleted');
             //UPDATE ELEMENT IN LOCALSTOARAGE AND RESTORE DATA
            todos.splice(index, 1, 
                {
                    "content" : todos[index].content,
                    "status" : "uncompleted"
                }
            );
            localStorage.setItem("todos", JSON.stringify(todos));
        }        
    }

}


function ajaxUpdateTodo(todo){
    const httpRequest = new XMLHttpRequest();

    if(!httpRequest) {
      alert('XMLHTTP 인스턴스를 만들 수가 없어요 ㅠㅠ');
      return false;
    }
    httpRequest.onreadystatechange = updateStatus;
    httpRequest.open('PATCH', 'http://127.0.0.1:3000/api/v1/item');
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    httpRequest.send(`id=${todo.id}`);

    function updateStatus() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            httpRequest.status === 200 ? console.log(httpRequest.response): alert('error')
        }
    }

}

function ajaxDeleteTodo(todo){
    const url = "http://127.0.0.1:3000/api/v1/item";
    const xhr = new XMLHttpRequest();
    console.log(`todo.id : ${todo.id}`)

    xhr.open("DELETE", url+'/' + todo.id, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-from-urlencoded')
    xhr.onload = function () {
        var result = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.log(result);
        } else {
            console.error('error');
        }
    }
    xhr.send(null);



    // const httpRequest = new XMLHttpRequest();

    // if(!httpRequest) {
    //   alert('XMLHTTP 인스턴스를 만들 수가 없어요 ㅠㅠ');
    //   return false;
    // }
    // httpRequest.onreadystatechange = updateStatus;
    // httpRequest.open('DELTE', 'http://localhost:3000/api/v1/item', true);
    // httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    

    // function updateStatus() {
    //     if (httpRequest.readyState === XMLHttpRequest.DONE) {
    //         httpRequest.status === 200 ? console.log(httpRequest.response): alert('error')
    //     }
    // }127.0.0.1
}

function ajaxAddTodo(e){
    const httpRequest = new XMLHttpRequest();
    let result
    if(!httpRequest) {
      alert('XMLHTTP 인스턴스를 만들 수가 없어요 ㅠㅠ');
      return false;
    }
    httpRequest.onreadystatechange = updateStatus;
    httpRequest.open('POST', 'http://127.0.0.1:3000/api/v1/item');
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    httpRequest.send(`content=${todoInput.value}`);

    function updateStatus() {
        let result
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            httpRequest.status === 200 ? result = httpRequest.responseText : alert('error')
            addTodo(result)
        }
    }
}







