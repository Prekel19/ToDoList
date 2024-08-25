const taskInput = document.querySelector("#tresc-zadania");
const addTaskButton = document.querySelector("#dodaj-zadanie");
const deleteTasksButton = document.querySelector("#usun-zadania");
let delay = 50;

const savedTasks = JSON.parse(localStorage.getItem("zadania") ?? "[]");

function addTask(task) {
  if (task !== "") {
    savedTasks.push(task);

    try {
      localStorage.setItem("zadania", JSON.stringify(savedTasks));
    } catch (error) {
      console.error(error);
    }

    taskList(task, true);
  }
}

addTaskButton.addEventListener("click", function () {
  addTask(taskInput.value);
  taskInput.value = "";
});

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask(taskInput.value);
    taskInput.value = "";
  }
});

deleteTasksButton.addEventListener("click", function () {
  const zadaniaListy = document.querySelectorAll(".zadania");

  zadaniaListy.forEach((task) => task.remove());
  localStorage.removeItem("zadania");
  savedTasks.splice(0, savedTasks.length);
});

function deleteTask(text) {
  const itemIndex = savedTasks.indexOf(text);
  const tasks = document.querySelectorAll(".zadania");

  savedTasks.splice(itemIndex, 1);

  localStorage.setItem("zadania", JSON.stringify(savedTasks));

  tasks.forEach((task) => task.remove());
  savedTasks.forEach((task) => taskList(task, false));
}

function taskList(text, animation) {
  const taskListZadan = document.querySelector(".zadania-lista");
  const newDiv = document.createElement("div");
  newDiv.classList.add("zadania");

  if (animation == true) {
    newDiv.classList.add("lista-animacja");

    newDiv.addEventListener("animationend", () => {
      newDiv.classList.remove("lista-animacja");
    });
  }

  newDiv.innerHTML = `
    <p onClick="openTaskView('${text}')" title="Zobacz szczegóły">${text}</p>
    <button onClick="deleteTask('${text}')"class="przycisk" style="margin-top: unset; margin-right: 1.5rem">Usuń</button>
    `;

  try {
    if (text) {
      taskListZadan.appendChild(newDiv);
    }
  } catch (error) {
    console.error(error);
  }
}

function openTaskView(text) {
  const taskViewContainer = document.querySelector(".task-view-container");
  const taskText = document.querySelector(".tv-text");

  if (text) {
    taskText.textContent = text;
    try {
      sessionStorage.setItem("taskViewText", JSON.stringify(text));
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      const taskTextSessionStorage = JSON.parse(
        sessionStorage.getItem("taskViewText")
      );
      taskText.textContent = taskTextSessionStorage;
    } catch (error) {
      console.error(error);
    }
  }

  taskViewContainer.classList.add("active");
  taskViewState.isActive = true;
}

function closeTaskView() {
  const taskViewContainer = document.querySelector(".task-view-container");

  taskViewContainer.classList.remove("active");
  sessionStorage.setItem("taskViewText", "");

  taskViewState.isActive = false;
}

const taskViewState = {
  get isActive() {
    return JSON.parse(sessionStorage.getItem("isTaskViewActive") ?? false);
  },
  set isActive(value) {
    sessionStorage.setItem("isTaskViewActive", JSON.stringify(value));
  },
};

function checkTaskViewActivity() {
  if (taskViewState.isActive) {
    openTaskView();
  }
}

try {
  savedTasks.forEach((task) => {
    setTimeout(() => {
      taskList(task, true);
    }, delay);

    delay += 200;
  });

  checkTaskViewActivity();
} catch (error) {
  console.error(error);
}
