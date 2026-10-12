const form = document.querySelector("#task-form");
const taskInput = document.querySelector("#task");
const subjectInput = document.querySelector("#subject");
const dateInput = document.querySelector("#date");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const taskCount = document.querySelector("#task-count");
const clearCompletedButton = document.querySelector("#clear-completed");

let tasks = [];
try {
  tasks = JSON.parse(localStorage.getItem("studentStudyPlannerTasks")) || [];
} catch {
  tasks = [];
}

function saveTasks() {
  localStorage.setItem("studentStudyPlannerTasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  emptyState.hidden = tasks.length > 0;

  const remaining = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${remaining} remaining • ${tasks.length} total`;

  tasks.forEach(task => {
    const item = document.createElement("li");
    item.className = `task${task.completed ? " done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.title} completed`);
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "task-meta";
    const details = [];
    if (task.subject) details.push(task.subject);
    if (task.date) details.push(`Due ${task.date}`);
    meta.textContent = details.join(" • ") || "Study task";

    content.append(title, meta);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(entry => entry.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, content, deleteButton);
    taskList.append(item);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  tasks.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    subject: subjectInput.value.trim(),
    date: dateInput.value,
    completed: false
  });

  saveTasks();
  renderTasks();
  form.reset();
  taskInput.focus();
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
