document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskCategory = document.getElementById('task-category');
    const taskPriority = document.getElementById('task-priority');
    const taskDueDate = document.getElementById('task-due-date');
    const addTaskButton = document.getElementById('add-task');
    const taskListContainer = document.querySelector('.task-list');
    const clearCompletedButton = document.getElementById('clear-completed');

    // Function to change background color automatically
    const changeBackgroundColor = () => {
        const colors = ['#FFEB3B', '#E91E63', '#673AB7', '#FF5722', '#8BC34A', '#03A9F4', '#00BCD4'];
        let index = 0;
        setInterval(() => {
            document.body.style.backgroundColor = colors[index];
            index = (index + 1) % colors.length; // Loop through colors
        }, 5000); // Change color every 5 seconds
    };

    // Load tasks from localStorage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskListContainer.innerHTML = '';
        tasks.forEach(task => createTaskElement(task));
    };

    // Save tasks to localStorage
    const saveTasks = () => {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(item => {
            const task = {
                text: item.querySelector('.task-text').textContent,
                category: item.getAttribute('data-category'),
                priority: item.getAttribute('data-priority'),
                dueDate: item.getAttribute('data-due-date'),
                completed: item.classList.contains('completed')
            };
            tasks.push(task);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Create a new task element
    const createTaskElement = (task) => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.setAttribute('data-category', task.category);
        taskItem.setAttribute('data-priority', task.priority);
        taskItem.setAttribute('data-due-date', task.dueDate);

        // Add priority color class
        taskItem.classList.add(`${task.priority}-priority`);

        const taskText = document.createElement('span');
        taskText.classList.add('task-text');
        taskText.textContent = task.text;
        taskItem.appendChild(taskText);

        // Due Date Alert
        if (task.dueDate) {
            const dueDateAlert = document.createElement('div');
            dueDateAlert.classList.add('due-date-alert');
            const taskDate = new Date(task.dueDate);
            const currentDate = new Date();
            const diffTime = taskDate - currentDate;

            // Show warning for deadline
            if (diffTime <= 86400000 && diffTime > 0) {
                dueDateAlert.textContent = 'Due Tomorrow!';
                dueDateAlert.classList.add('due-tomorrow');
                dueDateAlert.style.display = 'block';
            }
            else if (diffTime <= 0) {
                dueDateAlert.textContent = 'Overdue!';
                dueDateAlert.classList.add('overdue');
                dueDateAlert.style.display = 'block';
            }
            taskItem.appendChild(dueDateAlert);
        }

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            taskItem.remove();
            saveTasks();
        });
        taskItem.appendChild(deleteBtn);

        // Toggle completed state
        taskItem.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            saveTasks();
        });

        taskListContainer.appendChild(taskItem);
    };

    // Add task
    addTaskButton.addEventListener('click', () => {
        const text = taskInput.value.trim();
        const category = taskCategory.value;
        const priority = taskPriority.value;
        const dueDate = taskDueDate.value;

        if (text) {
            createTaskElement({ text, category, priority, dueDate, completed: false });
            taskInput.value = ''; // Clear input
            taskDueDate.value = ''; // Clear date
            saveTasks();
        }
    });

    // Clear completed tasks
    clearCompletedButton.addEventListener('click', () => {
        document.querySelectorAll('.task-item.completed').forEach(task => task.remove());
        saveTasks();
    });

    // Load saved tasks on page load
    loadTasks();

    // Start background color change
    changeBackgroundColor();

    // Check for deadlines every minute
    setInterval(() => {
        document.querySelectorAll('.task-item').forEach(item => {
            const dueDate = item.getAttribute('data-due-date');
            const dueDateAlert = item.querySelector('.due-date-alert');
            const taskDate = new Date(dueDate);
            const currentDate = new Date();
            const diffTime = taskDate - currentDate;

            if (dueDateAlert) {
                // Check if task is due tomorrow
                if (diffTime <= 86400000 && diffTime > 0) {
                    dueDateAlert.textContent = 'Due Tomorrow!';
                    dueDateAlert.classList.add('due-tomorrow');
                    dueDateAlert.style.display = 'block';
                }
                // Check if task is overdue
                else if (diffTime <= 0) {
                    dueDateAlert.textContent = 'Overdue!';
                    dueDateAlert.classList.add('overdue');
                    dueDateAlert.style.display = 'block';
                } else {
                    dueDateAlert.style.display = 'none'; // Hide alert if not due
                }
            }
        });
    }, 60000); // Check every minute
});

