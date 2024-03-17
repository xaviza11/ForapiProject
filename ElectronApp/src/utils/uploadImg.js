async function upload(file, token) {
    const uploadUrl = 'https://imagesapi-production.up.railway.app/upload';

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        formData.append('photo', file);

        xhr.open('POST', uploadUrl, true);

        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    reject(error);
                }
            } else {
                console.error('Error:', xhr.statusText);
                reject(new Error(xhr.statusText || 'Solicitud fallida'));
            }
        };

        xhr.onerror = function () {
            console.error('Error de red');
            reject(new Error('Error de red'));
        };

        xhr.send(formData);
    });
}

module.exports = upload


