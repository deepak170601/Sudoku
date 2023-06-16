document.addEventListener('DOMContentLoaded', function () {
    var gridElement = document.getElementById('grid');
    var generateButton = document.getElementById('generateButton');
    var submitButton = document.getElementById('submitBtn');
    var showSolutionButton = document.getElementById('showSolutionBtn');
    var difficultySelect = document.getElementById('difficulty');

    var sudokuGrid = [];

    generateButton.addEventListener('click', generateSudoku);
    submitButton.addEventListener('click', validateSudoku);
    showSolutionButton.addEventListener('click', showSolution);
    difficultySelect.addEventListener('change', generateSudoku);

    function generateSudoku() {
        clearGrid();
        var difficulty = difficultySelect.value;
        sudokuGrid = generateRandomGrid(difficulty);
        fillGrid(sudokuGrid);
    }

    function clearGrid() {
        while (gridElement.firstChild) {
            gridElement.firstChild.remove();
        }
    }

    function generateRandomGrid(difficulty) {
        var grid = [];
        for (var i = 0; i < 9; i++) {
            grid[i] = [];
            for (var j = 0; j < 9; j++) {
                grid[i][j] = 0;
            }
        }
        solveSudoku(grid);
        removeNumbers(grid, difficulty);
        return grid;
    }

    function removeNumbers(grid, difficulty) {
        var count;
        switch (difficulty) {
            case 'easy':
                count = 40;
                break;
            case 'medium':
                count = 50;
                break;
            case 'hard':
                count = 60;
                break;
            default:
                count = 40;
        }

        var cells = getAllCells(); // Get all the cells in the grid
        shuffle(cells); // Randomize the order of cells

        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            var row = cell.row;
            var col = cell.col;

            var temp = grid[row][col];
            grid[row][col] = 0;

            if (!hasUniqueSolution(grid)) {
                grid[row][col] = temp; // Restore the number if it doesn't have a unique solution
            }

            count--;
            if (count <= 0) {
                break;
            }
        }
    }

    function getAllCells() {
        var cells = [];
        for (var row = 0; row < 9; row++) {
            for (var col = 0; col < 9; col++) {
                cells.push({ row: row, col: col });
            }
        }
        return cells;
    }
    // Fisher-Yates shuffle algorithm
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function hasUniqueSolution(grid) {
        var clonedGrid = grid.map(function (row) {
            return row.slice();
        });

        return solveSudoku(clonedGrid, true);
    }

    function solveSudoku(grid) {
        var emptyCell = findEmptyCell(grid);
        if (!emptyCell) {
            return true;
        }
        var row = emptyCell.row;
        var col = emptyCell.col;
        for (var num = 1; num <= 9; num++) {
            if (isValidMove(grid, row, col, num)) {
                grid[row][col] = num;
                if (solveSudoku(grid)) {
                    return true;
                }
                grid[row][col] = 0;
            }
        }
        return false;
    }

    function findEmptyCell(grid) {
        for (var row = 0; row < 9; row++) {
            for (var col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    return { row: row, col: col };
                }
            }
        }
        return null;
    }

    function isValidMove(grid, row, col, num) {
    if (num < 1 || num > 9) {
        return false; // Number is outside the valid range
    }
    return (
        isRowValid(grid, row, num) &&
        isColumnValid(grid, col, num) &&
        isSubgridValid(grid, row - (row % 3), col - (col % 3), num)
    );
}


    function isRowValid(grid, row, num) {
        for (var col = 0; col < 9; col++) {
            if (grid[row][col] === num) {
                return false;
            }
        }
        return true;
    }

    function isColumnValid(grid, col, num) {
        for (var row = 0; row < 9; row++) {
            if (grid[row][col] === num) {
                return false;
            }
        }
        return true;
    }

    function isSubgridValid(grid, startRow, startCol, num) {
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                if (grid[row + startRow][col + startCol] === num) {
                    return false;
                }
            }
        }
        return true;
    }


    function fillGrid(grid) {
        for (var i = 0; i < 9; i++) {
            var rowElement = document.createElement('div');
            rowElement.className = 'row';

            for (var j = 0; j < 9; j++) {
                var squareElement = document.createElement('div');
                squareElement.className = 'square';

                if (grid[i][j] !== 0) {
                    squareElement.innerText = grid[i][j];
                    squareElement.dataset.value = grid[i][j];
                    squareElement.contentEditable = false;
                } else {
                    squareElement.contentEditable = true;
                    squareElement.dataset.value = '';
                }

                if ((j + 1) % 3 === 0) {
                    squareElement.classList.add('right-border');
                }
                if ((i + 1) % 3 === 0) {
                    squareElement.classList.add('bottom-border');
                }

                rowElement.appendChild(squareElement);
            }

            gridElement.appendChild(rowElement);
        }
    }

    function validateSudoku() {
        var userGrid = getUserGrid();
        var isValid = true;

        if (hasEmptyCells(userGrid)) {
            alert("Oops! Incomplete Sudoku.");
            return;
        }

        isValid = validateRows(userGrid) && validateColumns(userGrid) && validateSubgrids(userGrid);

        if (isValid) {
            alert("Congratulations! Sudoku is valid.");
        } else {
            alert("Oops! Sudoku is invalid.");
            highlightIncorrectCells(userGrid);
        }
    }

    function highlightIncorrectCells(grid) {
        var rows = gridElement.getElementsByClassName('row');

        for (var row = 0; row < 9; row++) {
            var squares = rows[row].getElementsByClassName('square');

            for (var col = 0; col < 9; col++) {
                if (grid[row][col] !== sudokuGrid[row][col]) {
                    squares[col].classList.add('incorrect');
                }
            }
        }
    }


    function hasEmptyCells(grid) {
        for (var row = 0; row < 9; row++) {
            for (var col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    return true;
                }
            }
        }
        return false;
    }

    function validateRows(grid) {
        for (var row = 0; row < 9; row++) {
            var rowValues = grid[row];
            if (!isUniqueValues(rowValues)) {
                return false;
            }
        }
        return true;
    }

    function validateColumns(grid) {
        for (var col = 0; col < 9; col++) {
            var colValues = [];
            for (var row = 0; row < 9; row++) {
                colValues.push(grid[row][col]);
            }
            if (!isUniqueValues(colValues)) {
                return false;
            }
        }
        return true;
    }

    function validateSubgrids(grid) {
        for (var startRow = 0; startRow < 9; startRow += 3) {
            for (var startCol = 0; startCol < 9; startCol += 3) {
                var subgridValues = [];
                for (var row = startRow; row < startRow + 3; row++) {
                    for (var col = startCol; col < startCol + 3; col++) {
                        subgridValues.push(grid[row][col]);
                    }
                }
                if (!isUniqueValues(subgridValues)) {
                    return false;
                }
            }
        }
        return true;
    }

    function isUniqueValues(arr) {
        var values = new Set(arr);
        values.delete(0);
        return values.size === arr.length;
    }

    function getUserGrid() {
        var userGrid = [];
        var rows = gridElement.getElementsByClassName('row');
        for (var i = 0; i < 9; i++) {
            userGrid[i] = [];
            var squares = rows[i].getElementsByClassName('square');
            for (var j = 0; j < 9; j++) {
                userGrid[i][j] = parseInt(squares[j].innerText) || 0;
            }
        }
        return userGrid;
    }

    function showSolution() {
        clearGrid();
        solveSudoku(sudokuGrid);
        fillGrid(sudokuGrid);
    }

    generateSudoku();
});
