# Todo Task Card

A responsive Todo Task Card built with plain HTML, CSS, and Vanilla JavaScript.

## Features

- Semantic card structure
- Required `data-testid` attributes for testing
- Dynamic due-time text (days/tomorrow/overdue/now)
- Status updates on checkbox toggle
- Accessible controls and visible keyboard focus
- Responsive layout from mobile to desktop

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

1. Open the project folder.
2. Double-click `index.html`.
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

## Interaction Notes

- Checkbox marks task as done, applies strike-through, and fades the card.
- Edit button logs `edit clicked` in browser console.
- Delete button shows `Delete clicked` alert.
- Time remaining auto-refreshes every 60 seconds.
