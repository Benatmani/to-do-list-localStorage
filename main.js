
let allTasks = window.localStorage.getItem("tasks") ? JSON.parse(window.localStorage.tasks) : [];
let tasksList = document.querySelector(".list-of-tasks");
function displayTasks (listOfTasks) {
  listOfTasks.forEach((task , id) => {
    let status = task.completed ? "completed" : "uncompleted";
    let newTask = buildTaskShape (task.paragraph , id , status);
    tasksList.append(newTask);
  })
}
tasksListEmpty();

let newTaskInput = document.querySelector(".add-task .input input");
let addNewTaskBTN = document.querySelector(".add-task .input button");
addNewTaskBTN.addEventListener("click",() => {
  addTask();
});

newTaskInput.addEventListener("keyup", (e) => {
    if(e.keyCode === 13){
      addTask();
    }
  
})

let searchBTN = document.querySelector(`input[name="input-search"]`);
searchBTN.addEventListener("keyup",() => {
  tasksList.innerHTML = "";
  let inputContent = searchBTN.value;
  let newAllTasks = allTasks.filter(e => e.paragraph.startsWith(inputContent));
  displayTasks(newAllTasks);
});
tasksList.addEventListener("click",(e) => {
  // complete Task functionality 
  if(e.target.classList.contains("complete")){
    let currentTaskID = e.target.parentElement.parentElement.parentElement.dataset.id ;
    e.target.parentElement.parentElement.parentElement.classList.toggle("completed");
    allTasks[currentTaskID].completed = !allTasks[currentTaskID].completed;
    setTimeout(() => {
      tasksListEmpty();
    },500);
  }
  // removing Task functionality 
  if(e.target.classList.contains("delete")){
    let currentTaskID = parseInt(e.target.parentElement.parentElement.parentElement.dataset.id) ;
    allTasks = allTasks.filter((e,i) =>  i !== currentTaskID);
    updateIndex(currentTaskID);
    e.target.parentElement.parentElement.parentElement.style.cssText = "opacity:0;transition:0.3s all ease-in;";
    setTimeout(() => {
      e.target.parentElement.parentElement.parentElement.remove();
    },400);
    setTimeout(() => {
      tasksListEmpty();
    },500);
  }
  // updating task functionality 
  
  if(e.target.classList.contains("update")){
    let currentTaskID = parseInt(e.target.parentElement.parentElement.parentElement.dataset.id) ;
    let currentTask = tasksList.children[currentTaskID];
    let taskHolder = currentTask.firstElementChild;
    if(!taskHolder.lastElementChild.classList.contains("update-form")){
      let form = document.createElement("div");
    form.className = "update-form";
    form.innerHTML = `
    <input type = "text" value = "${taskHolder.firstElementChild.textContent}">
    <button>save</button>
    <button>cancel</button>`;
    let updateInput = form.firstElementChild;
    updateInput.focus();
    let save = form.children[1];
    let cancel = form.lastElementChild;
    taskHolder.append(form);
    updateInput.addEventListener("keyup",(e) => {
      if(e.keyCode === 13){
        saveUpdates(taskHolder , allTasks , updateInput , currentTaskID);
      }
    });
    save.addEventListener("click",() => {
      saveUpdates(taskHolder , allTasks , updateInput , currentTaskID);
    });
    cancel.addEventListener("click",() => {
      taskHolder.lastElementChild.remove();
    });
    }

    
  }
  updateLocalStorage();
})

let clearAllBTN = document.querySelector(".clear-all button");
clearAllBTN.addEventListener("click",() => {
  let tasks = tasksList.children;
  tasks = Array.from(tasks);
  tasks.forEach(e => {
    e.style.cssText = "opacity:0;transition:0.3s all ease-in;";
    setTimeout(() => {
      e.remove();
    },400);
  })
  allTasks = [];
  updateLocalStorage();
  tasksListEmpty();
})

function addTask (){
  if(newTaskInput.value){
    let task  = {
        paragraph : addNewTaskBTN.previousElementSibling.value,
        completed: false,
      }
      let id = allTasks.length;
      allTasks.push(task);
      
      updateLocalStorage();
      tasksListEmpty ();
      addNewTaskBTN.previousElementSibling.value = "";
  }else{
    alert("the input is empty")
  }
}

function saveUpdates (taskHolder , allTasks ,updateInput , currentTaskID){
  taskHolder.firstElementChild.textContent = updateInput.value;
  allTasks[currentTaskID].paragraph = updateInput.value;
  taskHolder.lastElementChild.remove();
}

function updateIndex (index) {
    let tasks = tasksList.children;
    tasks = Array.from(tasks)
    if(index < tasks.length - 1) {
      for(let i = index ; i < tasks.length ; i++){
        tasks[i].dataset.id = parseInt(tasks[i].dataset.id) - 1;
      }
        
    }
  
}

function tasksListEmpty () {
  if(allTasks.length === 0){
    let paragraph = document.createElement("p");
    paragraph.innerHTML = "there is no task remaining";
    setTimeout(() => {
      tasksList.append(paragraph)
    },400) 
  }else{
    tasksList.innerHTML = "";
    displayTasks(allTasks);
  }
}

function buildTaskShape (paragraph , id , status) {
  let task = document.createElement("div");
  task.className = "task";
  task.dataset.id = id;
  if(status === "completed"){
    task.classList.add(status);
  }
  
  task.innerHTML = `
  <div class="task-holder">
    <p class="task-description">${paragraph}</p>
  </div>
  
  <div class="functionality-btns">
    <button >
      <span class="material-icons complete">
        done
        </span>
    </button>
    <button>
      <span class="material-icons update">
        rate_review
        </span>
    </button>
    <button>
      <span class="material-icons delete">
        delete
        </span>
    </button>
  </div>`;
  return task;
}

function updateLocalStorage () {
  window.localStorage.tasks = JSON.stringify(allTasks);
}


