document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');

    // Cargar tareas existentes
    loadTasks();

    // Evento para agregar tarea
    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    async function loadTasks() {
        try {
            const response = await fetch('/api/tasks');
            const tasks = await response.json();
            tasks.forEach(task => createTaskElement(task));
        } catch (error) {
            console.error('Error al cargar las tareas:', error);
        }
    }

    async function addTask() {
        const text = taskInput.value.trim();
        if (!text) return;

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const task = await response.json();
            if (!task || !task.id) {
                throw new Error('La respuesta del servidor no es válida');
            }

            createTaskElement(task);
            taskInput.value = '';
        } catch (error) {
            console.error('Error al agregar la tarea:', error);
            alert('No se pudo agregar la tarea. Por favor, intenta de nuevo.');
        }
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) li.classList.add('completed');
        li.dataset.id = task.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id, checkbox.checked));

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-task';
        deleteButton.textContent = '×';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    }

    async function toggleTask(id, completed) {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed })
            });

            if (response.ok) {
                const taskElement = document.querySelector(`[data-id="${id}"]`);
                if (completed) {
                    taskElement.classList.add('completed');
                } else {
                    taskElement.classList.remove('completed');
                }
            }
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
        }
    }

    async function deleteTask(id) {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const taskElement = document.querySelector(`[data-id="${id}"]`);
                taskElement.remove();
            }
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
        }
    }
});