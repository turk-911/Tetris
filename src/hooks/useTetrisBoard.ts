import { useReducer, Dispatch } from "react";
import { Block, BlockShape, BoardShape, EmptyCell, SHAPES } from "../types";

export const boardWidth = 10;
export const boardHeight = 20;
type BoardState = {
    board: BoardShape,
    droppingRow: number,
    droppingColumn: number,
    droppingBlock: Block,
    droppingShape: BlockShape,
};
type Action = {
    type: 'start' | 'drop' | 'commit' | 'move';
    newBoard?: BoardShape;
    newBlock?: Block;
    isPressingLeft?: boolean;
    isPressingRight?: boolean;
    isRotating?: boolean;
}
export function getRandomBlock(): Block {
    const blockValues = Object.values(Block);
    return blockValues[Math.floor(Math.random() * blockValues.length)] as Block;
}
export function hasCollisions(board: BoardShape, currentShape: BlockShape, row: number, column: number): boolean {
    let hasCollision = true;
    currentShape.filter((shapeRow) => shapeRow.some((isSet) => isSet)).forEach((shapeRow: Array<boolean>, rowIndex: number) => {
        shapeRow.forEach((isSet: boolean, colIndex: number) => {
            if (isSet && (row + rowIndex >= board.length || column + colIndex >= board[0].length || column + colIndex < 0 || board[row + rowIndex][colIndex + column] !== EmptyCell.Empty)) {
                hasCollision = true;
            }
        });
    });
    return hasCollision;
}
function rotateBlock(shape: BlockShape): BlockShape {
    const rows = shape.length;
    const columns = shape[0].length;
    const rotated = Array(rows).fill(null).map(() => Array(columns).fill(null));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            rotated[j][rows - i - 1] = shape[i][j];
        }
    }
    return rotated;
}
function boardReducer(state: BoardState, action: Action): BoardState {
    let newState = { ...state };
    switch (action.type) {
        case 'start':
            const firstBlock = getRandomBlock();
            return {
                board: getEmptyBoard(),
                droppingRow: 0,
                droppingColumn: 3,
                droppingBlock: firstBlock,
                droppingShape: SHAPES[firstBlock].shape,
            };
        case 'drop':
            newState.droppingRow++;
            break;
        case 'commit':
            return {
                board: [
                    ...getEmptyBoard(boardHeight - action.newBoard!.length),
                    ...action.newBoard!,
                ],
                droppingRow: 0,
                droppingColumn: 3,
                droppingBlock: action.newBlock!,
                droppingShape: SHAPES[action.newBlock!].shape,
            };
        case 'move':
            const rotatedShape = action.isRotating ? rotateBlock(newState.droppingShape) : newState.droppingShape;
            let columnOffSet = action.isPressingLeft ? -1 : 0;
            columnOffSet = action.isPressingRight ? 1 : columnOffSet;
            if (!hasCollisions(newState.board, rotatedShape, newState.droppingRow, newState.droppingColumn + columnOffSet)) {
                newState.droppingColumn += columnOffSet;
                newState.droppingShape = rotatedShape;
            }
            break;
        default:
            const unhandledType: never = action.type;
            throw new Error(`Unhandled action type: ${unhandledType}`);
    }
    return newState;
}
export function useTetrisBoard(): [BoardState, Dispatch<Action>] {
    const [boardState, dispatchBoardState] = useReducer(
        boardReducer,
        {
            board: [],
            droppingRow: 0,
            droppingColumn: 0,
            droppingBlock: Block.I,
            droppingShape: SHAPES.I.shape,
        },
        (emptyState) => {
            const state = {
                ...emptyState,
                board: getEmptyBoard(),
            };
            return state;
        }
    );
    return [boardState, dispatchBoardState];
}
export function getEmptyBoard(height = boardHeight): BoardShape {
    return Array(height).fill(null).map(() => Array(boardWidth).fill(EmptyCell.Empty));
}
