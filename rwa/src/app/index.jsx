import React from 'react';
import {render} from 'react-dom';

import RefrenceWebApplication from './RefrenceWebApplication.jsx'

class App extends React.Component {
    render () {
        return (
            <div>
                <RefrenceWebApplication />
            </div>
        );
    }
}

render(<App/>, document.getElementById('app'));