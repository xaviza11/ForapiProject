import React, { useState, useEffect } from 'react';
import { View, Image, ImageStyle, ActivityIndicator } from 'react-native';
import log from '../utils/coolog';
import * as FileSystem from 'expo-file-system';
import sanitize from 'sanitize-filename';
import defaultImage from '../../assets/no-user.png';

type ImageCacheProps = {
  uri: string;
  width: number;
  height: number;
  radius: number;
};

const ImageCache: React.FC<ImageCacheProps> = (props) => {
  const { uri, radius, width, height } = props;

  useEffect(() => {
    log.pc('<--- ImageCache --->');
    console.log('loading image', uri);
    cached();
  }, [uri]);

  const [newUri, setNewUri] = useState<string | null>(uri);
  const MAX_CACHE_SIZE = 30 * 1024 * 1024;

  const cached = async () => {
    try {
      const sanitizeString = sanitize(uri);

      if (uri === 'none') {
        setNewUri('none');
        return;
      }

      const path = `${FileSystem.cacheDirectory}${sanitizeString}`;
      const imageInfo = await FileSystem.getInfoAsync(path);

      if (imageInfo.exists) {
        setNewUri(imageInfo.uri);
        return;
      }

      const directoryInfo = await FileSystem.getInfoAsync(FileSystem.cacheDirectory);
      const directorySize = await getDirectorySize(FileSystem.cacheDirectory)

      if (directoryInfo !== null && MAX_CACHE_SIZE < directorySize) {
        console.log('Cache size limit reached. Deleting files...');
        const files = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory);

        for (let i = 0; i < 2 && i < files.length; i++) {
          const fileName = files[i];
          const filePath = `${FileSystem.cacheDirectory}${fileName}`;
          try {
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (fileInfo.exists && !fileInfo.isDirectory) {
              await FileSystem.deleteAsync(filePath);
              console.log(`File deleted successfully: ${filePath}`);
            } else {
              console.log(`File does not exist or is a directory: ${filePath}`);
            }
          } catch (error) {
            /*console.error(`Error deleting the file: ${filePath}`, error);*/
            //!The logic try to delete the same image 2 times probably it's a useEffect problem
          }
        }

        setNewUri(uri);
        return;
      }

      const newImage = await FileSystem.downloadAsync(uri, path);
      setNewUri(newImage.uri);
    } catch (error) {
      console.error('Error downloading the image: ', error)
    }
  };

  const getDirectorySize = async (directoryUri) => {
    let totalSize = 0;
  
    const files = await FileSystem.readDirectoryAsync(directoryUri);
  
    for (const fileName of files) {
      const fileUri = `${directoryUri}/${fileName}`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri, { size: true });
  
      if (fileInfo.exists && !fileInfo.isDirectory) {
        totalSize += fileInfo.size; 
      }
    }
  
    return totalSize;
  };

  const imageStyle: ImageStyle = {
    width: width,
    height: height,
    borderRadius: radius,
  };

  return (
    <View style={{ width, height, justifyContent: 'center', alignItems: 'center', backgroundColor: 'gray', borderRadius: radius }}>
      {newUri ? (
        newUri !== 'none'
          ? <Image source={{ uri: newUri }} style={imageStyle} />
          : <Image source={defaultImage} style={imageStyle} />
      ) : (
        <ActivityIndicator size="small" color="green" />
      )}
    </View>
  );

};

export default ImageCache;
