# Sliding Puzzle

This project provides a small sliding puzzle implemented with HTML, CSS and JavaScript. The game splits an image into a 3×3 grid and challenges you to restore the picture. Example screenshots are included in this repository.

## Setup

1. Clone this repository.
2. Create a folder called `images` in the project root.
3. Place three JPEG files in this folder named `chantier1.jpg`, `chantier2.jpg` and `chantier3.jpg`. Each image should be 300×300 pixels so that the puzzle pieces align correctly.

## Running the puzzle

Open `index.html` in a modern web browser. You can also serve the directory with a simple web server such as:

```bash
python -m http.server
```

Then navigate to the provided URL. Use the drop-down list to select an image, press **Mélanger** to shuffle the pieces and **Résoudre** to solve the puzzle.

## Dependencies

There are no runtime dependencies outside of a web browser. Any recent browser that supports ES6 JavaScript features will work.

## Contribution guidelines

Contributions are welcome. Please open an issue to discuss your idea before creating a pull request. Follow the existing coding style (4 spaces per indentation level and semicolons) and include clear descriptions of your changes.
