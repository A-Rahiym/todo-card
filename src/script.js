const todoCard = document.querySelector('[data-testid="test-todo-card"]');
const todoTitle = document.querySelector('[data-testid="test-todo-title"]');
const todoDescription = document.querySelector('[data-testid="test-todo-description"]');
const todoStatus = document.querySelector('[data-testid="test-todo-status"]');
const todoDueDate = document.querySelector('[data-testid="test-todo-due-date"]');
const todoTimeRemaining = document.querySelector('[data-testid="test-todo-time-remaining"]');
const todoPriority = document.querySelector('[data-testid="test-todo-priority"]');
const priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
const completeToggle = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const editButton = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteButton = document.querySelector('[data-testid="test-todo-delete-button"]');
const statusControl = document.querySelector('[data-testid="test-todo-status-control"]');
const expandToggle = document.querySelector('[data-testid="test-todo-expand-toggle"]');
const overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');
const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
const editTitleInput = document.querySelector('[data-testid="test-todo-edit-title-input"]');
const editDescInput = document.querySelector('[data-testid="test-todo-edit-description-input"]');
const editPrioritySelect = document.querySelector('[data-testid="test-todo-edit-priority-select"]');
const editDueDateInput = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');
const saveButton = document.querySelector('[data-testid="test-todo-save-button"]');
const cancelButton = document.querySelector('[data-testid="test-todo-cancel-button"]');

const DESCRIPTION_COLLAPSE_THRESHOLD = 120;

let state = {
  title: 'Prepare sprint planning summary',
  description: 'Review backlog priorities, estimate effort, and draft the planning deck for Monday.',
  priority: 'High',
  dueDate: new Date('2026-06-01T18:00:00Z'),
  status: 'Pending',
  expanded: false,
  editing: false,
};

let savedState = null;
let timerInterval = null;

function cloneState(source) {
  return {
    ...source,
    dueDate: new Date(source.dueDate.getTime()),
  };
}

function formatDueDateDisplay(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function dueDateToInputValue(date) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getRemainingText(now, dueDate) {
  if (state.status === 'Done') return 'Completed';
  const diffMs = dueDate.getTime() - now.getTime();
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (Math.abs(diffMs) < minuteMs) return 'Due now!';

  if (diffMs > 0) {
    if (diffMs >= 2 * dayMs) {
      const days = Math.floor(diffMs / dayMs);
      return `Due in ${days} day${days === 1 ? '' : 's'}`;
    }
    if (diffMs >= dayMs) return 'Due tomorrow';
    const hours = Math.ceil(diffMs / hourMs);
    if (hours <= 0) return 'Due now!';
    const minutes = Math.ceil(diffMs / minuteMs);
    if (hours < 2) return `Due in ${minutes} minute${minutes === 1 ? '' : 's'}`;
    return `Due in ${hours} hour${hours === 1 ? '' : 's'}`;
  }

  const overdueMs = Math.abs(diffMs);
  if (overdueMs < hourMs) {
    const mins = Math.floor(overdueMs / minuteMs);
    return `Overdue by ${mins} minute${mins === 1 ? '' : 's'}`;
  }
  const overdueHours = Math.floor(overdueMs / hourMs);
  return `Overdue by ${overdueHours} hour${overdueHours === 1 ? '' : 's'}`;
}

function isOverdue() {
  return state.status !== 'Done' && new Date() > state.dueDate;
}

function needsCollapse() {
  return state.description.length > DESCRIPTION_COLLAPSE_THRESHOLD;
}

function applyPriorityClasses() {
  todoCard.classList.remove('priority-high', 'priority-medium', 'priority-low');
  todoCard.classList.add(`priority-${state.priority.toLowerCase()}`);
  todoPriority.textContent = state.priority;
  priorityIndicator.dataset.priority = state.priority.toLowerCase();
  priorityIndicator.setAttribute('aria-label', `Priority: ${state.priority}`);
}

function applyStatusClasses() {
  const isDone = state.status === 'Done';
  const isInProgress = state.status === 'In Progress';

  todoCard.classList.toggle('is-done', isDone);
  todoCard.classList.toggle('is-in-progress', isInProgress);
  todoTitle.classList.toggle('is-complete', isDone);

  todoStatus.textContent = state.status;
  todoStatus.dataset.status = state.status.toLowerCase().replace(' ', '-');

  statusControl.value = state.status;
  completeToggle.checked = isDone;
}

function updateTimeDisplay() {
  const text = getRemainingText(new Date(), state.dueDate);
  todoTimeRemaining.textContent = text;
  todoTimeRemaining.dateTime = state.dueDate.toISOString();

  const overdue = isOverdue();
  overdueIndicator.hidden = !overdue;
  todoCard.classList.toggle('is-overdue', overdue);
}

function updateExpandCollapse() {
  const shouldCollapse = needsCollapse();
  expandToggle.hidden = !shouldCollapse;

  if (!shouldCollapse) {
    state.expanded = false;
    todoDescription.classList.remove('is-collapsed');
    expandToggle.setAttribute('aria-expanded', 'true');
    expandToggle.textContent = 'Show more';
  } else {
    const expanded = state.expanded;
    todoDescription.classList.toggle('is-collapsed', !expanded);
    expandToggle.setAttribute('aria-expanded', String(expanded));
    expandToggle.textContent = expanded ? 'Show less' : 'Show more';
  }
}

function renderView() {
  todoTitle.textContent = state.title;
  todoDescription.textContent = state.description;
  todoDueDate.textContent = `Due ${formatDueDateDisplay(state.dueDate)}`;
  todoDueDate.dateTime = state.dueDate.toISOString();

  applyPriorityClasses();
  applyStatusClasses();
  updateTimeDisplay();
  updateExpandCollapse();

  editForm.hidden = true;
  editButton.hidden = false;
  deleteButton.hidden = false;

  startTimer();
}

function renderEditMode() {
  editTitleInput.value = state.title;
  editDescInput.value = state.description;
  editPrioritySelect.value = state.priority;
  editDueDateInput.value = dueDateToInputValue(state.dueDate);

  editForm.hidden = false;
  editButton.hidden = true;
  deleteButton.hidden = true;

  stopTimer();
  editTitleInput.focus();
}

function startTimer() {
  stopTimer();
  timerInterval = setInterval(updateTimeDisplay, 45 * 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function setStatus(newStatus) {
  state.status = newStatus;
  applyStatusClasses();
  updateTimeDisplay();
  if (newStatus === 'Done') stopTimer();
  else startTimer();
}

completeToggle.addEventListener('change', () => {
  setStatus(completeToggle.checked ? 'Done' : 'Pending');
});

statusControl.addEventListener('change', () => {
  setStatus(statusControl.value);
});

expandToggle.addEventListener('click', () => {
  state.expanded = !state.expanded;
  updateExpandCollapse();
});

editButton.addEventListener('click', () => {
  savedState = cloneState(state);
  state.editing = true;
  renderEditMode();
});

cancelButton.addEventListener('click', () => {
  if (savedState) {
    state = cloneState(savedState);
  }
  state.editing = false;
  savedState = null;
  renderView();
  editButton.focus();
});

saveButton.addEventListener('click', () => {
  const rawDate = editDueDateInput.value;
  const parsedDate = rawDate ? new Date(rawDate + 'T18:00:00Z') : state.dueDate;

  state.title = editTitleInput.value.trim() || state.title;
  state.description = editDescInput.value.trim() || state.description;
  state.priority = editPrioritySelect.value;
  state.dueDate = parsedDate;
  state.editing = false;
  state.expanded = false;
  savedState = null;

  renderView();
  editButton.focus();
});

deleteButton.addEventListener('click', () => {
  alert('Delete clicked');
});
renderView();