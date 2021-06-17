import React, { useEffect, useState } from 'react';
import CountDown from 'ant-design-pro/lib/CountDown';
import moment from 'moment';

const Test = () => {
    var targetTime = 0;
    let time = 0;

    useEffect(() => {
        if(localStorage.getItem('time') === null){
            localStorage.setItem('time', new Date());
        }
        else {
            time = localStorage.getItem('time');
            
        }
        
    });

    time = localStorage.getItem('time'); console.log(time);

    if (time === 0) {
        targetTime = new Date().getTime() + 60*60000; console.log('1');
    }
    else {
        targetTime = new Date(time).getTime()+ 60*60000; console.log('2');
    }

    return (
        <div>
            <CountDown style={{ fontSize: 30 }} target={targetTime} />
        </div>
    )
}

export default Test;
