<div style="background-color: black; border: 1px solid #cccccc; padding: 15px; border-radius: 5px;">
    <h2 style="color: white;">Live Chat API</h2>
    <p>This API is created to provide live chat functionality.</p>
</div>

<div style="margin-top: 20px; border: 1px solid #cccccc; padding: 15px; border-radius: 5px;">
    <h3>Development Setup</h3>
    <p>In development, you need to set the following environment variables:</p>
    <ul>
        <li><strong>PORT</strong></li>
        <li><strong>MONGODB_URL</strong></li>
        <li><strong>TEST_MONGODB_URL</strong></li>
        <li><strong>JWT_SECRET</strong></li>
        <li><strong>JWT_SECRET_RENEW</strong></li>
        <li><strong>JWT_EXPIRATION</strong></li>
        <li><strong>JWT_RENEWAL_INTERVAL</strong></li>
        <li><strong>REQUESTS_LIMIT</strong></li>
        <li><strong>REQUESTS_LIMIT_MINUTES</strong></li>
    </ul>
</div>

<div style="margin-top: 20px; border: 1px solid #cccccc; padding: 15px; border-radius: 5px;">
    <h3>Environment Variables</h3>
    <p>If variables are set in a `.env` file, include the following:</p>
    <pre>PORT = number => 9999
MONGODB_URL= 'string' => mongodb://127.0.0.1:27017/dbname
TEST_MONGODB_URL= 'string' => mongodb://127.0.0.1:27017/testdbname
JWT_SECRET= 'string' => asdfasdf
JWT_SECRET_RENEW= 'string' => asdfasdf
JWT_EXPIRATION= 'string' => '1s'
JWT_RENEWAL_INTERVAL= 'string' => '2d'
REQUESTS_LIMIT= 'number' => 999999
REQUESTS_LIMIT_MINUTES= 'number' => 99999</pre>
</div>

<div style="margin-top: 20px; border: 1px solid #cccccc; padding: 15px; border-radius: 5px;">
    <h3>Dependencies</h3>
    <p>The following dependencies are used. Install them with:</p>
    <code>npm install</code>
    <p style="margin-top: 20px">dependencies:</p>
    <ul>
        <li><strong>bcryptjs</strong>: ^2.4.3</li>
        <li><strong>com</strong>: file:../com</li>
        <li><strong>dotenv</strong>: ^16.0.3</li>
        <li><strong>express</strong>: ^4.18.2</li>
        <li><strong>jsonwebtoken</strong>: ^9.0.2</li>
        <li><strong>mongodb</strong>: ^4.12.1</li>
        <li><strong>mongoose</strong>: ^6.7.5</li>
    </ul>
</div>

<div style="margin-top: 20px; border: 1px solid #cccccc; padding: 15px; border-radius: 5px;">
    <h3>Running the API</h3>
    <p>To start the API, execute:</p>
    <code >npm start</code>
</div>

<div style="margin-top: 20px; margin-bottom: 30px; border: 1px solid #cccccc; padding: 15px; border-radius: 5px;">
    <h3>Debugging</h3>
    <p>For debugging purposes, use:</p>
    <code>npm run inspect</code>
</div>
