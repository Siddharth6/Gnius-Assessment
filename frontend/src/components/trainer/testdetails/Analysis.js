import React, { useState} from 'react';
import { Table, Tag, Card, Modal, Button } from 'antd';
import AnswerSheet from '../../trainee/answersheet/answer';

export default function Trainee (props){
    return (
        <div>
            <Card>
                <div className="download-section">
                    {props.stats.map(data => (
                        <AnswerSheet user={data} key={data} />
                    ))}
                </div>
            </Card>
        </div>
    )
};
