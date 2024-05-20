import React, { CSSProperties, useCallback, useState } from 'react';
import { useDropzone, FileRejection, FileError } from 'react-dropzone';

// Define styles as constants
const thumbsContainer: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  };
  
  const thumb: CSSProperties = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  };
  
  const thumbInner: CSSProperties = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };
  
  const img: CSSProperties = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };
  
interface ExtendedFile extends File {
    path?: string; // Optional in case it's not always present
    preview?: string | undefined; // Preview URL
}

interface ImageDropzoneProps {
  onFilesAdded: (files: File[]) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onFilesAdded }) => {
    const [files, setFiles] = useState<ExtendedFile[]>([]);
    const onDrop = useCallback((acceptedFiles: File[]) => {
      const mappedFiles = acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }));
      setFiles(mappedFiles);
      onFilesAdded(acceptedFiles);
    }, [onFilesAdded]);
  
    // Define accept as a string or array of strings
    const accept = {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    };
  
    const maxSize = 10 * 1024 * 1024; // 10 MB

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept,
        maxSize
    });

    const fileRejectionItems = fileRejections.map(({ file, errors }: FileRejection) => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
          <ul>
            {errors.map((e: FileError) => (
              <li key={e.code}>{e.message}</li>
            ))}
          </ul>
        </li>
    ));

    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
            <img
                src={file.preview}
                style={img}
                onLoad={() => URL.revokeObjectURL(file.preview ?? '')} // Clean up after loading
            />
            </div>
        </div>
    ));

  return (
    <section className="container">
      <div {...getRootProps()} style={{ border: '2px dashed #007bff', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the images here ...</p> :
            <p>Drag and drop some images here, or click to select images</p>
        }
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
      <aside>
        <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul>
      </aside>
    </section>
  );
};

export default ImageDropzone;
