<span style="color:purple"># Taboo</span>
Unleash your word-guessing skills and experience the excitement of Taboo with this online version!

<span style="color:purple">## Introduction</span>
This project is an online version of the game Taboo. The objective of the game is for a designated "Clue-Giver" to describe a word without using five specified "taboo words",
while his team members attempt to correctly guess the word. The game consists of multiple rounds, which users can determine the number of. 
Each round consists of two turns. In one turn, a team acts as the guessing team, while in the other turn, they become the Buzzer Team. 
The Buzzer Team's responsibility is to watch for any accidental use of the taboo words by the Clue-Giver. 
At the end of all the rounds, the team with the most correctly guessed words is declared the winner.

The project aims to provide players with the flexibility to enjoy the game both remotely or in person. In the remote mode, players can utilize the chat and buzzer functionality. 
If the players want to play in-person, they can utilize this application for displaying the cards and keeping score.

Joining the game is convenient, with options to join remotely through an invite-link or access code, or to join in-person through a QR code. 
Additionally, user-friendly features, such as a dictionary API for word lookup and a share button to showcase achievements at the end of a game, enhance the overall experience of the application.

Let’s play Taboo!

<span style="color:purple">## Getting Started</span>
This guide helps you to install this client code on your local machine.

<span style="color:purple">### Prerequisites</span>
Before getting started, download the following:

1. For your local development environment, you will need to install [Node.js](https://nodejs.org/en).
2. Download the code of [this repository](https://github.com/sopra-fs23-group-05/Client).

<span style="color:purple">### Installing</span>
Follow these steps to install the client code on your local machine:

1. In your IDE, locate the option to import a project or open an existing project.

```
e.g. in IntelliJ go to “File” > “New” > “Project from Existing Sources”
```

2. Select the downloaded file of the client code.

3. Run the following command to install the project dependencies:

```
npm install
```

4. Once the dependencies are installed successfully, you can run the application locally using:

``` 
npm run dev 
```
Now you can open [http://localhost:3000](http://localhost:3000) to view the application in your browser. Make sure you have the [server](https://github.com/sopra-fs23-group-05/Server) running as well.

Notice that the page will reload if you make any edits. You will also see any lint errors in the console (use Google Chrome).

<span style="color:purple">### Deployment
To deploy the application, you need to build the project first. To do so, run the following command:

``` 
npm run build 
```   

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

Then, you can push your changed code to this GitHub repository. The application will be automatically deployed to Heroku. To do so, run the following commands:

```
git add .
```

```
git commit -m "commit message"
```

```
git push origin main
```

<span style="color:purple">### Testing</span>
Testing is optional, and you can run the tests with `npm run test`.
This launches the test runner in an interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

> For macOS user running into a 'fsevents' error: https://github.com/jest-community/vscode-jest/issues/423

<span style="color:purple">## Technologies</span>
We used React with HTML/CSS and JS for this client code of the application. Further we used:
TODO 

* [MUI](https://mui.com) for UI elements.
* [QR-Code API]() to invite people.
* [Dictionary API](https://www.datamuse.com/api/) to get definitions of a word.
* [Twitter API](https://developer.twitter.com/en/docs/twitter-api) to share the result.
* [Taboo API](https://github.com/Kovah/Taboo-Data) to get the card data.
* [Axios API]() to make API calls to our server.

<span style="color:purple">## Illustrations</span>
TODO

<span style="color:purple">## Roadmap</span>
Possible features that new developers can add:
* A canvas to also draw the word instead of describing it. 
* Feedback that shows if you are close to the word (if there is a spelling mistake etc.)

We are open for more ideas!

<span style="color:purple">## Authors</span>
* Daniel Maksimovic
* Felix Merz
* Melea Köhler
* Tom Meier

<span style="color:purple">## License</span>
TODO
This project is licensed under the MIT License - see the ___ file for details

<span style="color:purple">## Acknowledgments</span>
TODO
* Hat tip to anyone whose code was used
* Inspiration
* etc

