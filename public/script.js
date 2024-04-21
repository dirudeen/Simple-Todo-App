document.addEventListener("DOMContentLoaded", function() {
    // Fetch todos from server when the page loads
    fetchTodos();
  
    // Add event listener to input field for Enter key press
    document.getElementById("todoInput").addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        addTodo();
      }
    });
  });
  
  const baseURL = "http://localhost:3000/"
  
// Function to fetch todos from server and display them
function fetchTodos() {
    fetch(`${baseURL}todos`)
      .then(response => response.json())
      .then(todos => {
        const todoList = document.getElementById("todoList");
        todoList.innerHTML = "";
        todos.forEach(todo => {
          const li = document.createElement("li");
          li.textContent = todo.text;
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.classList.add("delete-button")
          deleteButton.addEventListener("click", () => deleteTodo(todo.id));
          li.appendChild(deleteButton);
          todoList.appendChild(li);
        });
      })
      .catch(error => console.error("Error fetching todos:", error));
  }
  
  // Function to add todo
  function addTodo() {
    const input = document.getElementById("todoInput");
    const text = input.value.trim();
    if (text !== "") {
      fetch(baseURL + "todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      })
        .then(response => {
          if (response.ok) {
            input.value = "";
            fetchTodos();
          } else {
            console.error("Failed to add todo:", response.statusText);
          }
        })
        .catch(error => console.error("Error adding todo:", error));
    }
  }
  
  // Function to delete todo
  function deleteTodo(id) {
    fetch(`${baseURL}todos/${id}`, {
      method: "DELETE"
    })
      .then(response => {
        if (response.ok) {
          fetchTodos();
        } else {
          console.error("Failed to delete todo:", response.statusText);
        }
      })
      .catch(error => console.error("Error deleting todo:", error));
  }