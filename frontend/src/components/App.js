import React from 'react';
import Amplify from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react';
import SfrPage from './sfr/SfrPage';

class App extends React.Component {


    
    render() {
        return (
            <div className="ui container">
                <SfrPage />
            </div>
        );
    }
}


Amplify.configure({
    Auth: {
        identityPoolId: 'us-east-1:723aef17-de06-4272-8907-34f4e29b8816',
        region: 'us-east-1',
        userPoolId: 'us-east-1_5JLM25m4g',
        userPoolWebClientId: '43vmv2bbugs1mk10g2ofqra3vq',
        mandatorySignIn: true,
    }
});


export default withAuthenticator(App, true);