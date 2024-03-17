<div style="background-color: black; border: 1px solid #cccccc; padding: 10px;">
    <h1 style="color: white;">Forapi</h1>
    <p>Welcome to this repository. It contains my project, an ecommerce app. This file contains instructions for downloading and installing the app on Android, as well as an explanation of the folder's content.</p>
</div>

<div align="center" style="margin-top: 30px; margin-bottom: 30px">
    <h2>Download App from Dropbox</h2>
    <span>
        <img src="./qrcode-generado.png" alt="QR code for app download">
    </span>
    <h2>Warnings:</h2>
    <h5>Android 6 or higher required, no iOS version.</h5>
    <h5>The app saves images in cache, which may increase the final size.</h5>
</div>

<div style="background-color: black; border: 1px solid #cccccc; padding: 10px; margin-bottom: 30px">
    <h2 style="color: white;">Instructions</h2>
    <ol>
        <li><h3>Log In</h3>
            <p>To enter the home page, you can just use the following credentials:</p>
            <ul>
                <li>User: usuario1@usuario1.com</li>
                <li>Password: 123123123</li>
            </ul>
            <p>Note: If you prefer to register, you can. The app does not send registration emails; it is only enabled for password recovery.</p>
            <p>Important: Please do not change the password of this user.</p>
        </li>
        <li><h3>Home Page</h3>
            <p>Upon entering the home page, the app makes a random search with two possible outcomes:</p>
            <ul>
                <li>Display Books</li>
                <li>Display Furniture</li>
            </ul>
            <p>Important: The other categories do not have items. This app locates the users and then displays the items. If the app throws a location error or does not find items, go to settings and paste the following into the location input: 40.637304569429205, 0.28253461881064923. Then, send the new location. Do not press "relocation" because this button is to find the device location again.</p>
        </li>
        <li><h3>Search</h3>
            <p>You can only search for books and furniture. The other categories are empty. Use "canape" to find furniture and "libro" to find books.</p>
            <p>Note: You can also find other words included in the item descriptions, for example, "cambrian" (a color of canape).</p>
        </li>
        <li><h3>WhatsApp Chat</h3>
            <p>If you add one or more items to the basket and you enter the ItemRequest page, you can open WhatsApp. It will open my personal WhatsApp. You can text me if you want to.</p>
        </li>
    </ol>
</div>

<div style="background-color: black; border: 1px solid #cccccc; padding: 10px; margin-bottom: 30px">
    <h2 style="color: white;">Folders</h2>
    <p>This section explains the content of the folders. The technical descriptions and comments are inside them.</p>
    <ol>
        <li>
            <h3>ChatsApi</h3>
            <p>This is an API that uses socket.io to create real-time chats. This project may not be implemented yet because I first developed the entire project in JS and now I'm changing it to TS. Also, to avoid increasing hosting costs.</p>
        </li>
        <li>
            <h3>DataApi</h3>
            <p>This API uses Node.js and Express connected to a MongoDB database to save data (except images) of the API. In future iterations I will add typescript.</p>
        </li>
        <li>
            <h3>ImgApi</h3>
            <p>This is a simple API that uses Multer to save images in a public folder. It needs more work and can request tokens to display images. The logic can be improved. I created this to learn how images are handled on servers. I know that for small applications, it's more common to use external services like Cloudinary, Bynder, etc.</p>
        </li>
        <li>
            <h3>ElectronApp</h3>
            <p>This app is created using the DOM of JS and Tailwind CSS. It would have been better to use a framework like Vue, React, etc. I will do this in future iterations.</p>
        </li>
        <li>
            <h3>NativeApp</h3>
            <p>This app is created using React Native in Expo Bare. It may need a frontend library for UI/UX like Material UI, Ant Design, or Bootstrap. I will implement this to improve the app's design in the future.</p>
        </li>
    </ol>
</div>


<div style="background-color: black; border: 1px solid #cccccc; padding: 10px;">
    <h2 style="color: white;">Info</h2>
    <p>This project is just created to improve my coding skills; it does not have commercial purposes. If you download the app, please try not to create a lot of data.</p>
</div>


