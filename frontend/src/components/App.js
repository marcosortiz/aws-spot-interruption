import React from 'react';
import Amplify from 'aws-amplify';
import {withAuthenticator, Greetings, SignIn, RequireNewPassword, ConfirmSignIn, VerifyContact, ForgotPassword} from 'aws-amplify-react';




import SfrPage from './sfr/SfrPage';
import Config from '../config';

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
        identityPoolId: Config.cognito.IdentityPoolId,
        region: Config.region,
        userPoolId: Config.cognito.UserPoolId,
        userPoolWebClientId: Config.cognito.userPoolWebClientId,
        mandatorySignIn: true,
    }
});

export default withAuthenticator(App, true, [
    <Greetings />,
    <SignIn />,
    <RequireNewPassword/>,
    <ConfirmSignIn />,
    <VerifyContact />,
    <ForgotPassword />
  ])