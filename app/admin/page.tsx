"use client";
import { CSSProperties, useCallback, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import ImageDropzone from '../components/Dropzone';
import { StyledContainer } from '../components/ContainerElements';
import { useAuth } from '../api/auth/AuthContext';
import SSTUpload from '../test/page';

interface Photo {
  id: string;
  url: string;
  description: string;
}

const logOutButton: CSSProperties = {
  background: 'linear-gradient(to right, #777777, #3a3a3a)',
  border: '1px solid grey',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  left: '50%',
  transform: 'translateX(-50%)',
  marginBottom: '20px',
}

const Admin: React.FC = () => {
  const { userDetails, loginUser, logoutUser, isAuthenticated } = useAuth();
  console.log('userDetails', userDetails);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoDescription, setNewPhotoDescription] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchPhotos();
    }
  }, [isAuthenticated]);

  const fetchPhotos = async () => {
    // Fetch photos using authenticated API requests
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPhotos(items);
    // Consider implementing updatePhotoOrder on the backend
  };

  const onFilesAdded = useCallback((addedFiles: File[]) => {
    // Placeholder for actual upload logic
    console.log(addedFiles);
    // Here you would handle the logic to upload files and fetch their URLs, then update the photo state.
  }, []);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      await loginUser(email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Failed to log in: ' + (error as Error).message);
    }
  };

  return (
    <StyledContainer>
      <h1>{userDetails ? 'Edit My Photo Gallery' : 'Admin | Photo Gallery'}</h1>
      {isAuthenticated ? (
        <>
          <ImageDropzone onFilesAdded={onFilesAdded} />
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="photos">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {photos.map((photo, index) => (
                    <Draggable key={photo.id} draggableId={photo.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <img src={photo.url} alt={photo.description} />
                          <p>{photo.description}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <button
            style={logOutButton}
            onClick={() => {
              logoutUser();
            }}
          >
            Log Out
          </button>
        </>
      ) : (
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
      )}
    </StyledContainer>
  );
};

export default Admin;
