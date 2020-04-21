import React from 'react';
import './timerBorder.css'

const TimerBorder: React.FC<{
    showTimer: boolean
}> = ({ showTimer, children }) => {




    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%'
        }}>
            {
                showTimer &&
                <div style={{
                    position: "absolute", 
                    width: '100%',
                    height: '100%'
                }}>
                    <div className="top-border"></div>
                    <div className="bottom-border"></div>
                    <div className="left-border"></div>
                    <div className="right-border"></div>
                </div>
            }

            <div style={{
                width: showTimer ? '98%' : '100%',
                height: showTimer ? '98%' : '100%',
                margin: 'auto'
            }}>
                {children}
            </div>
        </div>
    )
}

export default TimerBorder
