import React from 'react';
import './Application.scss';
import _ from 'lodash';

const Application = () => {

    return (
        <div className='application'>
            {
                <table>
                    <thead>
                        <tr>
                            {
                                _.range(0, 16).map((c) => {
                                    return <td key={c}>{c}</td>;
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            _.range(0, 10).map((r) => {
                                return (
                                    <tr key={r}>
                                        {
                                            _.range(0, 16).map((c) => {
                                                return <td key={c}>{r + "_" + c}</td>;
                                            })
                                        }
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            }
        </div>
    );
};

export default Application;
