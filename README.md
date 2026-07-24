# Cross the Road 

Project Name: Cross the Road - Frog Edition

## Timeline:

Just for information: This project was originally developed during my bachelors at Monash University Malaysia in April 2021
But I wasn't using GitHub for my projects. Which is why I am uploading the full project as a part of my portfolio.

This is a cross the road game built using Javascript and css. In this game player controls a frog to cross a road full of obstacles(Vehicles). As you clear the levels, the difficulty of the game is increased by adding more vehicles, different types vehicles and the speed of the vehicles is increased.
You have 3 lives to create a new highscore.

This project was built to improve and showcase my skills in javascript and css stylting.


## How to Run It
* Make sure you have Live server installed in your VS Code
* Open the main game folder in VS Code
* Then right click on the index.html file and click "Open with Live Server"


* If you dont have VS Code but have python installed
* Open a terminal and the "cd" into the main game folder containing the index.html
* then type this in terminal python -m http.server 8000


## How to Customize
You can easily tweak the game's difficulty or appearance by editing `js/config.js`:
* **Change Speeds:** Adjust `baseSpeed` inside the `VEHICLE_STATS` object.
* **Alter the Board:** Modify `COLS` and `ROWS` to make the grid larger or smaller.
* **Adjust Difficulty Scaling:** Tweak `VEHICLE_SPEED` (default +18%) and `NUMBER_OF_VEHICLE` (default +15%) to change how hard the game gets on higher levels.
* You can also change the look of the player(frog) or the vehicles to something else but make sure to save the file as .png and with the same name.