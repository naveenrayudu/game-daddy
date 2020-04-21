import React from 'react'

const Abondoned: React.FC<{
    content: string,
    continueText: string,
    continueClickHandler: () => void,
    showCancelButton?: boolean,
    cancelText?: string
    cancelButtonHandler?: () => void
}> = ({ content, continueText, continueClickHandler, showCancelButton, cancelButtonHandler, cancelText }) => {
    return (
        <div>
            {content}

            <div>
                <button onClick={continueClickHandler}>{continueText}</button>
                {showCancelButton && <button onClick={cancelButtonHandler}>{cancelText}</button>}
            </div>

        </div>
    )
}

export default Abondoned
