import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export default async function uploadImage(uri) {
  try {
    let response

    const fileInfo = await FileSystem.getInfoAsync(uri);

    const maxFileSize = 400 * 1024
    if (fileInfo.size > maxFileSize) {
      const res = await compressImageHandler(uri)
      const result = await uploadToServer(res.uri)
      response = result
    } else {
      const res = await uploadToServer(uri)
      console.log(res)
      response = res
    }

    return response
  } catch (error) {
    alert(error);
  }
}

async function uploadToServer(uri) {
  try {

    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];

    const apiUrl = 'https://imagesapi-production.up.railway.app/upload';

    let formData = new FormData();
    formData.append('photo', {
      uri: uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
      fieldname: `${fileType}`
    });

    let response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    let responseData = await response.json();
    return responseData;
  }catch(error){
    console.log(error)
    return false}
}

async function compressImage(uri, compressValue) {
  const resizeImageInfo = await manipulateAsync(
    uri,
    [{ resize: { width: 600, height: 600, withoutEnlargement: true, fit: 'inside' } }]
  );

  const formatImageInfo = await manipulateAsync(
    resizeImageInfo.uri, [],
    { format: SaveFormat.PNG }
  );

  const compressedImageInfo = await manipulateAsync(
    formatImageInfo.uri,
    [], { compress: compressValue }
  );

  const resultImage = await FileSystem.getInfoAsync(compressedImageInfo.uri);
  console.log(resultImage)
  return resultImage
}

async function compressImageHandler(uri) {
  let response;

  console.log('work')

  for (let i = 0; i < 9; i++) {

    let compressValue = 1 - (i/10)

    const res = await compressImage(uri, compressValue);

    if (res.size < 1024 * 400) {
      response = res;
      break;
    } else {
      uri = res.uri;
      response = false;
    }
  }
  return response;
}