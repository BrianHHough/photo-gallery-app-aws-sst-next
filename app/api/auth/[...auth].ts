import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_v7tgjgn6q', // Your UserPoolId here
  ClientId: '1nit66nr57fuh9j64hsnicpnrl', // Your UserPoolClientId here
};

interface NewPasswordCallback {
    (user: CognitoUser, userAttributes: { [key: string]: any }, requiredAttributes: string[]): void;
  }

const userPool = new CognitoUserPool(poolData);

export const loginUser = async (username: string, password: string, newPasswordCallback: NewPasswordCallback): Promise<any> => {
  const user = new CognitoUser({ Username: username, Pool: userPool });
  
  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password
  });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('access token + ' + result.getAccessToken().getJwtToken());
        resolve(result);
      },
      onFailure: (err) => {
        console.error(err);
        reject(err);
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        console.log('New password is required');
        // Remove attributes that can't be modified
        delete userAttributes.email_verified; // adjust this as per your user pool attributes

        // Trigger the callback with user, userAttributes, and the requiredAttributes
        newPasswordCallback(user, userAttributes, requiredAttributes);
      }
      // You can also add handlers for other authentication challenges here
    });
  });
};

export const signOutUser = () => {
    const currentUser = userPool.getCurrentUser();
    currentUser?.signOut();
};
