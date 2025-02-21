## Note

MongoDB need to turn on replication to use "write" function of Prisma (maybe it will be your painful set up :DDD)

## Introduction

Today project is chat application API with JWT authentication. This project use Typescript programming languague and ExpressJS web application framework.

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nodejs,express,typescript,mongodb,redis,prisma&perline=10"/>
  </a>
</p>

## Features

- Chat application API
- MongoDB
- Redis
- JWT authentication

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

    REDIS_URL="redis://username:password@host:6379"
    DATABASE_URL="mongodb://username:password@host:27017/database"
    ```

4.  Run post-install command (Prisma setup)

    ```bash
    npm run prisma:generate
    npm run prisma:migrate
    npm run prisma:seed
    ```

5.  Start the server (choose dev or prod environment). The dev-server will restart every time the code is changed.

    ```bash
    # Dev environment
    npm run dev

    # Prod environment
    npm run prod
    ```

6.  Open a different shell to use the application. You must change ${host} to your IP address or domain name (e.g., localhost). It depends on your setup.

    ```bash
    # Health check
    curl ${host}:3000/api/up
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
        <td>create new account</td>
      </tr>  
      <tr>
        <td>5</td>
        <td>/api/auth/refreshToken</td>
        <td>refesh the access token</td>
      </tr>
      <tr>
        <td>6</td>
        <td>/api/auth/logout</td>
        <td>logout and bring the token into black-list for a while</td>
      </tr>
      <tr>
        <td>7</td>
        <td>/api/message/recent</td>
        <td>get the recent chat history with only 1 message</td>
      </tr>
      <tr>
        <td>8</td>
        <td>/api/message/get-messages-by-room-id/${roomId}</td>
        <td>get the recent message in a certain room</td>
      </tr>
      <tr>
        <td>9</td>
        <td>/api/message/send-message</td>
        <td>request to send a message (save a message to DB)</td>
      </tr>
      <tr>
        <td>10</td>
        <td>/api/message/send-image</td>
        <td style="color:red">not implemented yet</td>
      </tr>
      <tr>
        <td>11</td>
        <td>/api/message/delivered-message</td>
        <td style="color:red">not implemented yet</td>
      </tr>
      <tr>
        <td>12</td>
        <td>/api/message/seen-message</td>
        <td style="color:red">not implemented yet</td>
      </tr>
      <tr>
        <td>13</td>
        <td>/api/room/${roomId}</td>
        <td>check if room exist</td>
      </tr>
      <tr>
        <td>14</td>
        <td>/api/room/create</td>
        <td>create new room</td>
      </tr>
      <tr>
        <td>15</td>
        <td>/api/user/all</td>
        <td>get users list</td>
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
