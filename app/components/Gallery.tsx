"use client"
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from '@emotion/styled';
// import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

interface Photo {
  id: string;
  url: string;
  description: string;
}

const GalleryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
`;

const PhotoCard = styled.div`
  width: 300px;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPhotos = async (startKey: Record<string, any> | undefined = undefined) => {
    // const dbClient = new DynamoDBClient({ region: 'us-east-1' });
    // const command = new ScanCommand({
    //   TableName: 'Photos',
    //   ExclusiveStartKey: startKey,
    //   Limit: 30,
    // });

    // try {
    //   const response = await dbClient.send(command);
    //   const newPhotos: Photo[] = response.Items?.map((item) => ({
    //     id: item.id.S ?? '',
    //     url: item.url.S ?? '',
    //     description: item.description.S ?? '',
    //   })) || [];

    //   setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    //   setHasMore(!!response.LastEvaluatedKey);
    // } catch (error) {
    //   console.error('Error fetching photos:', error);
    // }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <InfiniteScroll
      dataLength={photos.length}
      next={() => fetchPhotos(photos[photos.length - 1]?.id ? { id: { S: photos[photos.length - 1].id } } : undefined)}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={<p style={{ textAlign: 'center' }}>No more photos</p>}
    >
      <GalleryContainer>
        {photos.map((photo) => (
          <PhotoCard key={photo.id}>
            <img src={photo.url} alt={photo.description} />
          </PhotoCard>
        ))}
      </GalleryContainer>
    </InfiniteScroll>
  );
};

export default Gallery;