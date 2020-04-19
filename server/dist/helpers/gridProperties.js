"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateGamePositions = () => {
    const numberOfBoxes = 3;
    const numberOfPointsPerBox = 8;
    const positionsForLine = 3;
    const gamePositions = [];
    const validPointPositions = [];
    const validMoves = [
        [1, 3],
        [0, 2, 9],
        [1, 4],
        [0, 5, 11],
        [2, 7, 12],
        [3, 6],
        [5, 7, 14],
        [4, 6],
        [9, 11],
        [1, 8, 10, 17],
        [9, 12],
        [3, 8, 13, 19],
        [4, 10, 15, 20],
        [11, 14],
        [6, 13, 15, 22],
        [12, 14],
        [17, 19],
        [9, 16, 18],
        [17, 20],
        [11, 16, 21],
        [12, 18, 23],
        [19, 22],
        [14, 21, 23],
        [20, 22]
    ];
    for (let boxes = 0; boxes < numberOfBoxes; boxes++) {
        for (let positions = 0; positions < numberOfPointsPerBox; positions++) {
            const currentPosition = boxes * numberOfPointsPerBox + positions;
            gamePositions.push(currentPosition);
        }
        //top
        const topLinePositions = [];
        for (let position = boxes * numberOfPointsPerBox; position < boxes * numberOfPointsPerBox + positionsForLine; position++) {
            topLinePositions.push(position);
        }
        //bottom
        const bottomLinePositions = [];
        for (let position = (boxes * numberOfPointsPerBox) + positionsForLine * 2 - 1; position < boxes * numberOfPointsPerBox + numberOfPointsPerBox; position++) {
            bottomLinePositions.push(position);
        }
        //left
        const leftLinePosition = [];
        let positionsToSkip = positionsForLine;
        for (let position = boxes * numberOfPointsPerBox; position < boxes * numberOfPointsPerBox + numberOfPointsPerBox - 1; position = position + positionsToSkip) {
            leftLinePosition.push(position);
            if (position !== boxes * numberOfPointsPerBox)
                positionsToSkip = 2;
        }
        //right
        const rightLinePositions = [];
        for (let position = boxes * numberOfPointsPerBox + positionsForLine - 1; position < boxes * numberOfPointsPerBox + numberOfPointsPerBox; position = position + 2) {
            rightLinePositions.push(position);
        }
        rightLinePositions[rightLinePositions.length - 1] = rightLinePositions[rightLinePositions.length - 1] + 1;
        validPointPositions.push(topLinePositions);
        validPointPositions.push(bottomLinePositions);
        validPointPositions.push(leftLinePosition);
        validPointPositions.push(rightLinePositions);
    }
    [1, 3, 4, 6].forEach((startPosition) => {
        validPointPositions.push([startPosition, startPosition + numberOfPointsPerBox, startPosition + numberOfPointsPerBox * 2]);
    });
    const scorePointsByIndex = validPointPositions.reduce((acc, cur) => {
        cur.forEach((ele) => {
            if (acc[ele]) {
                acc[ele].push(cur);
            }
            else {
                acc[ele] = [cur];
            }
        });
        return acc;
    }, {});
    return {
        gamePositions,
        validPointPositions,
        scorePointsByIndex,
        validMoves
    };
};
exports.default = generateGamePositions();
//# sourceMappingURL=gridProperties.js.map