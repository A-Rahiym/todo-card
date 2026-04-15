# Todo Task Card

A responsive Todo Task Card built with plain HTML, CSS, and Vanilla JavaScript.

## Features

- **Complete Task Management**: Mark tasks as done with checkbox toggle, applies strike-through styling and disables timer
- **Priority Levels**: Visual priority indicators (High, Medium, Low) with color-coded styling
- **Smart Due Date Display**: Dynamic time remaining shows contextual messages:
  - "Due now!" when within 1 minute
  - "Due in X minute(s)" for times under 2 hours
  - "Due in X hour(s)" for times under 24 hours
  - "Due tomorrow" for tasks due within 24 hours
  - "Due in X day(s)" for longer durations
  - "Overdue by X minute(s)/hour(s)" for past-due tasks
- **Auto-Refresh Timer**: Time remaining updates every 45 seconds without manual refresh
- **Collapsible Descriptions**: Long descriptions (>120 characters) collapse with "Show more/less" toggle
- **Multiple Status Options**: Toggle between Pending, In Progress, and Done states
- **Full Editing Capability**: Modify task details inline
- **Required `data-testid` Attributes**: Full test coverage with semantic test identifiers
- **Accessible Controls**: Keyboard focus visibility and ARIA labels for screen readers
- **Responsive Layout**: Adapts seamlessly from mobile to desktop screens
- **Semantic HTML Structure**: Proper semantic markup for better structure and SEO

## Project Structure

```text
.
├── index.html
├── README.md
└── src
    ├── script.js
    └── styles.css
```

## How To Run

### Option 1: Open directly in browser

1. Open the project folder
2. Double-click `index.html`
3. Or run this command from the project root:

```bash
xdg-open index.html
```

### Option 2: Run with a local static server (recommended)

From the project root, run one of these:

Using Python:

```bash
python3 -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

Using Node (if installed):

```bash
npx serve .
```

Then open the local URL shown in terminal.

## Editing Tasks

Click the **Edit** button to modify task details:

- **Title**: Edit the task name
- **Description**: Update task details and notes
- **Priority**: Change priority level (Low, Medium, High)
- **Due Date**: Update the task deadline

Changes are applied when you click **Save**, or press **Cancel** to discard edits. Empty fields retain their original values. The auto-refresh timer pauses during edit mode and resumes after saving.

## Interaction Notes

### Status & Completion

- **Checkbox**: Marks task as done, applies strike-through styling, and fades the card
- **Status Dropdown**: Switch between Pending, In Progress, and Done states
- Completing a task stops the auto-refresh timer; reopening reactivates it
- Overdue tasks display a red "Overdue" indicator and apply overdue styling

### Time Display

- Time remaining auto-refreshes every 45 seconds for accurate countdown
- Completed tasks show "Completed" instead of time remaining
- Overdue styling applies dynamically as tasks pass their due date

### Task Management

- **Delete Button**: Shows a confirmation alert (implementation ready for integration)
- Edit mode hides edit/delete buttons and displays the edit form
- Focus automatically returns to the Edit button after saving or canceling changes
