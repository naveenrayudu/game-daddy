const generateGamePositions = (numberOfRings: number, numberOfInsertsPerLine: number)  => {
    const numberOfLines = 2 * numberOfRings + 1;
    const positionToUse: number[] = [];
    var validGamePositions: number[][]= [];
    
    
    // fill upper half of the grid
    const firstHalfPosition = () => {
        setHalfPostions(0, true, 0, numberOfRings);
    }
    
    // fill lower half of the grid
    const secondHalfPosition = () => {
        setHalfPostions(2, false, numberOfRings + 1, numberOfRings * 2 + 1);
    }
    
    // fill the middle line
    const setMiddlePositions = () => {
        // fill left middle line
        setMiddleHalfPostions(numberOfLines * numberOfRings);
    
        // fill right middle line
        setMiddleHalfPostions(numberOfLines * numberOfRings + numberOfRings + 1);
    }
    
    
    function setMiddleHalfPostions(lineStartPosition: number) {
        const validPositionsForThisColumn: number[] = [];
        for(let rows = 0; rows < numberOfInsertsPerLine; rows++) {
            const index = lineStartPosition  + rows;
            positionToUse.push(index);
            validPositionsForThisColumn.push(index);
        }
        validGamePositions.push(validPositionsForThisColumn);
    }
    
    
    const setHalfPostions = (lineStartPosition: number, incrementValue: boolean, columnNumber: number, upperLimit:number) => {
        for (let columns = columnNumber; columns < upperLimit; columns++) {
            let positionsToSkip = lineStartPosition;
            let index = columns * numberOfLines;
            const validPositionsForThisColumn = [];
            for (let rows = 0; rows < numberOfInsertsPerLine; rows++) {
                index = index  + positionsToSkip;
                positionToUse.push(index);
                validPositionsForThisColumn.push(index);
        
                positionsToSkip = numberOfRings - lineStartPosition;
            }
            validGamePositions.push(validPositionsForThisColumn);
            if(incrementValue)
                lineStartPosition++;
            else
                lineStartPosition--;
        }
    }
    
    const fillPositions = () => {
        firstHalfPosition();
        secondHalfPosition();
        setMiddlePositions();
    
        // Top calls will fill all the valid horizontal positions.
        // Call this to explicitly set the verfical positions
        fillVerticalHalfPositions();
    }
    
    const fillVerticalHalfPositions = () => {
        // fill left half vertical positions
        for(let columns = 0; columns < numberOfRings; columns++) {
            let index = columns * numberOfLines + columns;
            const validPositionsForThisRow = [];
            for(let row = 0; row < numberOfInsertsPerLine; row++) {
                validPositionsForThisRow.push(index);
                index = index + numberOfLines * (numberOfRings - columns);
            }
            validGamePositions.push(validPositionsForThisRow);
        }
    
        // fill right half vertical positions
        for(let columns = 3; columns > 0; columns--) {
            let index = columns * numberOfLines - columns;
            const validPositionsForThisRow = [];
            for(let row = 0; row < numberOfInsertsPerLine; row++) {
                validPositionsForThisRow.push(index);
                index = index + numberOfLines * (numberOfRings + 1 - columns);
            }
            validGamePositions.push(validPositionsForThisRow);
        }
    
        // fill top middle vertical position
        fillVerticalMiddleHalfPositions(numberOfRings);
    
        // fill bottom middle vertical position
        fillVerticalMiddleHalfPositions(numberOfLines * (numberOfRings + 1) + Math.floor(numberOfLines / 2));
       
    }
    
    
    const fillVerticalMiddleHalfPositions = (middleStartIndex: number) => {
        const validPositionsForThisRow = [];
        for(let row = 0; row < numberOfInsertsPerLine; row++) {
            validPositionsForThisRow.push(middleStartIndex);
            middleStartIndex = middleStartIndex + numberOfLines;
        }
        validGamePositions.push(validPositionsForThisRow);
    }
    
    fillPositions();

    return {
        postionsToUse : positionToUse,
        validGamePositions: validGamePositions
    }
}

export default generateGamePositions;