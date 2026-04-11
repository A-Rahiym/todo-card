const todoCard = document.querySelector('[data-testid="test-todo-card"]');
const todoTitle = document.querySelector('[data-testid="test-todo-title"]');
const todoStatus = document.querySelector('[data-testid="test-todo-status"]');
const todoDueDate = document.querySelector('[data-testid="test-todo-due-date"]');
const todoTimeRemaining = document.querySelector('[data-testid="test-todo-time-remaining"]');
const completeToggle = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const editButton = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteButton = document.querySelector('[data-testid="test-todo-delete-button"]');

const fixedDueDate = new Date('2026-06-01T18:00:00Z');

function formatDueDateLabel() {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });

  todoDueDate.textContent = `Due ${formatter.format(fixedDueDate)}`;
  todoDueDate.dateTime = fixedDueDate.toISOString();
}

function getRemainingText(now, dueDate) {
  const diffMs = dueDate.getTime() - now.getTime();
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (Math.abs(diffMs) < minuteMs) {
    return 'Due now!';
  }

  if (diffMs > 0) {
    if (diffMs >= 2 * dayMs) {
      const days = Math.floor(diffMs / dayMs);
      return `Due in ${days} day${days === 1 ? '' : 's'}`;
    }

    if (diffMs >= dayMs) {
      return 'Due tomorrow';
    }

    const hours = Math.ceil(diffMs / hourMs);
    if (hours <= 0) {
      return 'Due now!';
    }

    return `Due in ${hours} hour${hours === 1 ? '' : 's'}`;
  }

  const overdueHours = Math.floor(Math.abs(diffMs) / hourMs);
  if (overdueHours <= 0) {
    return 'Due now!';
  }

  return `Overdue by ${overdueHours} hour${overdueHours === 1 ? '' : 's'}`;
}

function updateTimeRemaining() {
  todoTimeRemaining.textContent = getRemainingText(new Date(), fixedDueDate);
  todoTimeRemaining.dateTime = fixedDueDate.toISOString();
}

function updateCompletedState() {
  const isDone = completeToggle.checked;

  todoCard.classList.toggle('is-done', isDone);
  todoTitle.classList.toggle('is-complete', isDone);
  todoStatus.classList.toggle('is-done', isDone);
  todoStatus.textContent = isDone ? 'Done' : 'Pending';
}

completeToggle.addEventListener('change', updateCompletedState);

editButton.addEventListener('click', function () {
  console.log('edit clicked');
});

deleteButton.addEventListener('click', function () {
  alert('Delete clicked');
});

formatDueDateLabel();
updateTimeRemaining();
updateCompletedState();
setInterval(updateTimeRemaining, 60 * 1000);
