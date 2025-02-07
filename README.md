# NodeJs-api_chat_app

MongoDB need to turn on replication to use "write" function of Prisma (maybe it will be your painful set up :DDD)

## Introduction

Today project is a basic NodeJs chat apppication (API) with JWT authentication. This project use Typescript programming languague and ExpressJS web application framework.

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nodejs,express,typescript,mongodb,redis,prisma&perline=10"/>
  </a>
</p>

## Features

- Chat application with socket.io
- Basic authentication
- Caching JWT token with Redis
- MongoDB

## Usage

1.  Install node_modules packages:

    ```bash
    npm install
    ```

2.  Copy `.env.example` to `.env`:

    ```bash
    cp ./.env.example ./.env
    ```

3.  Modify your database information in `.env`:

    ```properties
    PORT=3000

    JWT_ACCESS_SECRET_KEY="secret"
    JWT_ACCESS_EXPIRES_IN="10m"
    JWT_REFRESH_SECRET_KEY="secret"
    JWT_REFRESH_EXPIRES_IN="1d"

    REDIS_URL="redis://localhost:6379"
    DATABASE_URL="mongodb://localhost:27017/chat-app?authSource=admin"
    ```

4.  Start the server (choose dev or prod environment). The dev-server will restart every time the code is changed.

    ```bash
    # Dev environment
    npm run dev

    # Prod environment
    npm run prod
    ```

## Available routes

<div align="center">
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>URL</th>
        <th>Function</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>/api/</td>
        <td>home</td>
      </tr>
      <tr>
        <td>2</td>
        <td>/api/up</td>
        <td>health check</td>
      </tr>
      <tr>
        <td>3</td>
        <td>/api/auth/login</td>
        <td>login to access resources</td>
      </tr>  
      <tr>
        <td>4</td>
        <td>/api/auth/register</td>
        <td>create one new account</td>
      </tr> 
      <tr>
        <td>5</td>
        <td>/api/auth/refreshToken</td>
        <td>refresh the access token</td>
      </tr>
      <tr>
        <td>6</td>
        <td>/api/auth/logout</td>
        <td>logout</td>
      </tr>
      <tr>
        <td>7</td>
        <td>/api/message/recent</td>
        <td>get all recent chat rooms with 1 message</td>
      </tr>
      <tr>
        <td>8</td>
        <td>/api/message/get-messages-by-room-id/${roomID}</td>
        <td>get the recent message of 1 certain chat room</td>
      </tr>
      <tr>
        <td>9</td>
        <td>/api/message/send-message</td>
        <td>request to send 1 message</td>
      </tr>
      <tr>
        <td>10</td>
        <td>/api/message/send-image</td>
        <td>request to send images</td>
      </tr>
      <tr>
        <td>11</td>
        <td>/api/message/delivered-message</td>
        <td>confirm that message is delivered</td>
      </tr>
      <tr>
        <td>12</td>
        <td>/api/message/seem-message</td>
        <td>confirm that message is seen</td>
      </tr>
      <tr>
        <td>13</td>
        <td>/api/room/${roomID}</td>
        <td>find the chat room by roomID</td>
      </tr>
      <tr>
        <td>14</td>
        <td>/api/room/create</td>
        <td>create the chat room with ID of users</td>
      </tr>
      <tr>
        <td>15</td>
        <td>/api/user/all</td>
        <td>get all user infomation</td>
      </tr> 
      <tr>
        <td>16</td>
        <td>/api/user/username/${username}</td>
        <td>find user by username</td>
      </tr>
      <tr>
        <td>17</td>
        <td>/api/user/email/${email}</td>
        <td>find user by email</td>
      </tr>
    </tbody>
  </table>
</div>

## Contributing

If you would like to contribute to this project, feel free to fork the repository and submit a pull request. Any contributions are welcome!
