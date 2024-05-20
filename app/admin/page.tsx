"use client"
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { signIn, signUp } from '@/app/services/api';
// import { DynamoDBClient, PutItemCommand, ScanCommand, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';
import { StyledContainer } from '../components/ContainerElements';

// Login elements
import { AuthenticationDetails, CognitoUserPool, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { loginUser, signOutUser } from '@/app/api/auth/[...auth]';

interface Photo {
  id: string;
  url: string;
  description: string;
}

const poolData = {
    UserPoolId: 'us-east-1_v7tgjgn6q', // From your Cognito setup
    ClientId: '1nit66nr57fuh9j64hsnicpnrl', // From your Cognito setup
};    

const userPool = new CognitoUserPool(poolData);

const Admin: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoDescription, setNewPhotoDescription] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

//   const dbClient = new DynamoDBClient({ region: 'us-east-1' });

  useEffect(() => {
    if (isAuthenticated) {
      fetchPhotos();
    }
  }, [isAuthenticated]);

  const fetchPhotos = async () => {
    const user = userPool.getCurrentUser();
    if (user) {
      user.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          console.error(err);
          return;
        }
        const token = session.getIdToken().getJwtToken();
        // Use this token to make authenticated API requests
      });
    }
  };

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPhotos(items);
    updatePhotoOrder(items);
  };

  const updatePhotoOrder = async (photos: Photo[]) => {
    try {
      const requests = photos.map((photo, index) => ({
        PutRequest: {
          Item: {
            id: { S: photo.id },
            url: { S: photo.url },
            description: { S: photo.description },
            order: { N: index.toString() },
          },
        },
      }));
    //   const command = new BatchWriteItemCommand({
    //     RequestItems: {
    //       Photos: requests,
    //     },
    //   });
    //   await dbClient.send(command);
    } catch (error) {
      console.error('Error updating photo order:', error);
    }
  };

  const addNewPhoto = async () => {
    try {
      const newPhoto = {
        id: Date.now().toString(),
        url: newPhotoUrl,
        description: newPhotoDescription,
      };

    //   const command = new PutItemCommand({
    //     TableName: 'Photos',
    //     Item: {
    //       id: { S: newPhoto.id },
    //       url: { S: newPhoto.url },
    //       description: { S: newPhoto.description },
    //     },
    //   });

    //   await dbClient.send(command);
      setPhotos([...photos, newPhoto]);
      setNewPhotoUrl('');
      setNewPhotoDescription('');
    } catch (error) {
      console.error('Error adding new photo:', error);
    }
  };

  const handleSignUp = async () => {
    try {
    //   await signUp(email, password);
      alert('Sign up successful!');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      const authResult = await loginUser(email, password, handleNewPassword);
      console.log('Login successful:', authResult);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Failed to log in: ' + (error as Error).message);
    }
  };

  const handleNewPassword = (user: CognitoUser, userAttributes: { [key: string]: any }, requiredAttributes: string[]): void => {
    console.log("User attributes initially:", userAttributes);
    console.log("Required attributes:", requiredAttributes);
  
    // Remove attributes that should not be modified
    delete userAttributes.email_verified; // This is already being deleted
    delete userAttributes.email; // Additionally, ensure email is not being modified
  
    // Prompt user for new password
    const newPassword = prompt('Please enter your new password'); // This is a simple prompt, consider using a more secure method in production
  
    if (newPassword) {
      user.completeNewPasswordChallenge(newPassword, userAttributes, {
        onSuccess: (result) => {
          console.log('Password change successful, logged in');
          setIsAuthenticated(true);
        },
        onFailure: (error) => {
          console.error('Error while changing password:', error);
          alert('Error changing password: ' + (error as Error).message);
        }
      });
    }
  };

  return (
    <StyledContainer>
      <h1>Admin | Photo Gallery</h1>
      {isAuthenticated ? (
        <>
          <input
            type="text"
            placeholder="Photo URL"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
          />
          <input
            type="text"
            placeholder="Photo Description"
            value={newPhotoDescription}
            onChange={(e) => setNewPhotoDescription(e.target.value)}
          />
          <button onClick={addNewPhoto}>Add Photo</button>

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="photos">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {photos.map(({ id, url, description }, index) => (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <img src={url} alt={description} />
                          <p>{description}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

            <button onClick={() => {
                signOutUser();
                setIsAuthenticated(false);
            }}>
                Log Out
            </button>
        </>
      ) : (
        <>
            <form onSubmit={handleSignIn}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign In</button>
            </form>
        </>
      )}
    </StyledContainer>
  );
};

export default Admin;
