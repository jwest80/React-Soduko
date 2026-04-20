# React Soduko

A small React sudoku app I built while getting my feet wet with React development.

The interesting part of the project is the sudoku logic. I originally tried to solve puzzles with an algorithm that works somewhat like a human solver: eliminate values based on the row, column, and 3x3 group, then look for placements that can only belong in one square. That worked for some grids, but I eventually fell back to brute force recursion for cases the simple human-style rules could not solve.

The app can generate puzzles, keep the generated puzzle to a single solution, and let you click cells to change values.

## Running The App

The easiest way to run it is with Docker Compose:

```bash
docker-compose up
```

Then open:

```text
http://localhost:3000
```

If you are using the newer Docker Compose plugin, this also works:

```bash
docker compose up
```

The compose file mounts the repo into the container, so source changes should be picked up by the React dev server.

## Local Development

You can also run it without Docker if you have Node installed:

```bash
npm install
npm start
```

Useful scripts:

```bash
npm start
npm run build
npm test
```

`npm start` runs the Sass watcher and the Create React App dev server together.

## Project Layout

```text
src/
  App.js
  App.scss
  index.js
  index.scss
  board/
    board.js
    board.scss
    generate.js
    generate.scss
    square.js
  utility/
    suduko.js
    sets.js
    rules.js
```

Main pieces:

- `src/App.js` wires the app shell together.
- `src/board/board.js` owns the 9x9 board state and user interactions.
- `src/board/generate.js` renders the difficulty buttons.
- `src/board/square.js` renders one cell.
- `src/utility/suduko.js` contains puzzle generation and solving logic.
- `src/utility/sets.js` adds helper methods to `Set`, such as `union`, `intersection`, and `difference`.
- `src/utility/rules.js` is mostly placeholder code from an earlier direction.

## Sudoku Logic

The solver in `src/utility/suduko.js` works in two phases.

First it tries simple elimination:

- For a blank square, remove any value already present in the same row, column, or 3x3 group.
- If only one value remains, fill it in.
- It also tries a cross-group check to find values that have only one possible placement inside a group.

If those rules stop making progress and the puzzle is still incomplete, it switches to brute force:

- Find the next empty square.
- Try each possible value.
- Recurse until the grid is solved or rejected.
- Keep a small number of solutions so generation can detect puzzles with more than one solution.

Generation starts by seeding a partially filled grid, solving it into a complete board, and then removing numbers randomly while checking that the puzzle still has one solution.

## Developer Notes

This project was originally created with Create React App and still uses `react-scripts`.

Styles are written in SCSS. The source imports the `.scss` files directly, while the old Sass scripts may still generate `.css` and `.css.map` files during local builds. Generated CSS files are ignored by git.

The project name and some class/file names use the misspelling `suduko`. That is historical and has not been cleaned up.

The code is intentionally small and experimental. It is not a polished sudoku engine, and the solver rules are limited before brute force takes over.
