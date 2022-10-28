# gralakt's Final Project

Web Programming with Python and JavaScript


# Introduction

This website is a fairly advanced calendar, planner, and goal-measuring notebook all in one. Powered by Django. On this websie, users can set goals and tasks, check their statistics, and visually see their progress.

# Distinctiveness and Complexity

My project is nothing like the previous projects in this course. It is an extensive, interactive calendar in which it is in vain to look for any similarities to even the ideas of previous projects. It is complicated becouse I have tried to make it more efficient than simple. I have put the whole tough process of transforming and editing to-do objects, routines and calendar into only 3 APIs. I tried to move a large amount of tasks and processes from the backend to the client's internal server, which allowed me to save a lot of space in the database. In addition, I was able to delve into the subject to create a highly interactive web application. The project contains many moving and eye-pleasing animations and events depending on the user's behavior.

# Files




  - `timetable` - Main application directory
    - `urls.py` - It includes three API urls, three for login, registration and logout, and one url for displaying the home page. 
    - `static` - Holds all static files.
            - `base.js` - JavaScript for website.
            - `right_home.js` - JavaScript for website.
            -`base.css` - Contains styles for main part of website.
            -`right_home.css` - Contains styles for rest part of website.
    - `templates` - Holds all (3) html files.

    - `models.py` - Contains three classes `User`, `RoutineTask` and `NewTask` which has all information about the tasks and routines.  
    - `views.py` - Contains all view functions for `planer` to render the home page, `routine` to render all the routines, using API, as well as creating and editing routine objects,  `callendar` to render callendar via API, `login` to render the login page, `register` to render the register page, `logout` to logout, and finally the most complexed `tasks` which not only returns 'tasks' objects (also creating them on the fly from 'routine' objects) using API, but also creates these objects and edits them via API.  

# Project Structure

## Home Page

On the main page, which is created through the 'planer' view, we see the main and flagship part of the page - the area with the form for creating a new routine and (if any) already present routines. To create a new routine, enter the title and choose how often you want to repeat the action. By clicking on the area of ​​a single routine highlighted below, the area under it will expand, where we will see interesting statistics about this routine. If the routine is currently active after clicking on its highlighted title, we will repeat the routine again. If not, hovering over its title will display information when the routine will be active again. The more repetitions in a row we manage to include, the statistics will grow. If we do not manage to repeat it within the set time limit, the "counter in a row" counter is reset to zero. The currently active routines to be performed today appear at the top, followed by the order of the highest repetitions in the row.

At the very top of the page is a simple navigation bar. Two buttons: Home, Login / Logout. When scrolled down, the form disappears.

The button protruding from the left tip of the page opens a nice area with a calendar when you click it. You can change the months and years shown in the calendar by clicking the buttons above the calendar. The current day is displayed in red. After clicking on any day on the calendar, underneath we open a list with a header - the name of the week and the month number of that day, and a form for creating tasks to be done on that specific day, a list of tasks to be done and done on that day.


## Login Page

Before you can create your goals, you need to login to allow the platform to remember you. Just input the username and password in the form below.

Don't have an account? No worries, as there is a link to the register page in the `signup` button below the form where new users can get registered as well.

## Register Page 

New users can get registered by filling out the `UserRegisterForm` and then they will be redirected back to the home page.

# How to run the application
* Copy this directory and change directory to it inside the terminal
* Make and apply migrations by running `python manage.py makemigrations` and `python manage.py migrate`.