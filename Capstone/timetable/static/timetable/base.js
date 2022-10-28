// Set day, month & year to the current date
const date = new Date();
var day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();


// After loading the page, run this functions
document.addEventListener('DOMContentLoaded', load)
document.addEventListener('DOMContentLoaded', calendar)
document.addEventListener('DOMContentLoaded', nextPreviousCalendarButtons)
document.addEventListener('DOMContentLoaded', sidebarButton)


// This function will send a GET request for a specific month in the calendar of a specific year
function load() {

	// Delete the part of the page that displays to-do and done tasks, from the user's view
	const tasksContainer = document.querySelector('#tasks_container');
	tasksContainer.style.display = 'None';

	// Get a data table for a specific month in a specific year
	fetch(`API/?month=${month}&year=${year}`)
	.then(response => response.json())
	.then(data => {

		dataTable = data.posts;
		calendarContainer = document.querySelector('#calendar-container');
		calendarContainer.innerHTML = dataTable;

		const allDays = document.querySelectorAll('td');
		for (i = 0; i < allDays.length; i++){
			if (allDays[i].innerHTML == day && data.month == month){
				allDays[i].id = 'today'
			}
		}

	})
}

	

// This function causes the buttons above the month 'next' and 'previous' to change the calendar table
function nextPreviousCalendarButtons() {

	// Find the element with the id 'next' and store it in a variable
	const nextButton = document.querySelector('#next');
	// If the item is clicked, execute the commands
	nextButton.onclick = () => {
    	// Round the ends of a calendar table
    	document.querySelector('#calendar').style.borderRadius = "16px"

    	// If the current month value, after adding one number, would not be 13, increase the variable 'month' by one
    	if (month + 1 != 13){
    		month ++;
    	// Otherwise, increase the 'year' variable by one, and set the 'month' variable to 1
    	} else {
    		year ++;
    		month = 1
    	}
    	// Run the 'load' function
    	load();
	}

	// Find the element with the id 'previous' and store it in a variable
	const previousButton = document.querySelector('#previous');
	// If the item is clicked, execute the commands
	previousButton.onclick = () => {
    	// Round the ends of a calendar table
    	document.querySelector('#calendar').style.borderRadius = "16px"

		// Find the element id 'tasks_list'
		const tasksList = document.querySelector('#tasks_list');
		// Clear the html content of this element
		tasksList.innerHTML = ''

		// Find the element with the id 'done_tasks_list'
		const doneTasksList = document.querySelector('#done_tasks_list');
		// Clear the html content of this element
		doneTasksList.innerHTML = ''

    	// If the current 'month' value, after decreasing one number, would not be 0, increase the variable 'month' by one
    	if (month - 1 != 0){
    		month --;
    	// Otherwise, decrease the 'year' variable by one, and set the 'month' variable to 12
    	} else {
    		year --;
    		month = 12;
    	}
    	// Run the 'load' function
    	load();
	}
}				


// This function allows us to interactively operate the buttons related
// to the calendar (click on a specific day, select the next / past month)
function calendar() {

	// Designates the commands after the button is clicked, if the button meets the requirements
	document.addEventListener('click', event => {

		// Save the element that was clicked in the variable 'element'
	    var element = event.target;

	    // If the item is a td (table cell) and is not assigned to the 'noday' class - run the commands
	    if(element.tagName === 'TD' && element.className !== 'noday'){
	    	// Straighten the rounded ends of a calendar table border
	    	document.querySelector('#calendar').style.borderRadius = "0px"


		// Find the element id 'tasks_list'
		const tasksList = document.querySelector('#tasks_list');
		// Clear the html content of this element
		tasksList.innerHTML = ''

		// Find the element with the id 'done_tasks_list'
		const doneTasksList = document.querySelector('#done_tasks_list');
		// Clear the html content of this element
		doneTasksList.innerHTML = ''


	    	// Run the tasks function with an element as an argument
	    	tasks(element);
	    }
	})
}


// This function creates us and shows us a list of tasks to do 
// and tasks done with a header and a form to enter new tasks for a specific day
function tasks(day){

	// Find the element id 'tasks_list'
	const tasksList = document.querySelector('#tasks_list');
	// Clear the html content of this element
	tasksList.innerHTML = ''

	// Find the element with the id 'done_tasks_list'
	const doneTasksList = document.querySelector('#done_tasks_list');
	// Clear the html content of this element
	doneTasksList.innerHTML = ''

	// Send a GET request for all tasks assigned for a given day
	fetch(`tasks/?day=${day.innerHTML}&month=${month}&year=${year}`)
	.then(response => response.json())
	.then(data => {
		// For each task in the received tasks, run the task function with task as an argument
		for(i=0; i < data.length; i++){
			task(data[i]);
		}
	})

	// Find the element id 'tasks_container'
	const tasksContainer = document.querySelector('#tasks_container')
	// Make it visible to the client
	tasksContainer.style.display = 'Block'

	// Array with the names of the days of the week assigned to their abbreviations given in the table
	const allDayName = {"mon": 'Monday', "wed": 'Wednesday', "tue": 'Tuesday', "thu": 'Thursday', "fri": 'Friday', "sat": 'Saturady', "sun": 'Sunday'}
	// Set the variable 'dayName' to the position of 'allDayName' which corresponds to the class name of 'day'
	const dayName = allDayName[day.className];

	// Find the element id 'tasks_div_header'
	const tasksDivHeader = document.querySelector('#tasks_div_header');
	// Set its HTML content
	tasksDivHeader.innerHTML = `<span id='day_number'>${day.innerHTML}</span><span id='day_name'>${dayName}</span>`

	// Call buttons function with day as an argument
	buttons(day)
}


// This function takes care of sending a POST request when a button is clicked in order to create a new task
function buttons(day) {

	// Find an element with id = submit-task
	const submitButton = document.querySelector('#submit-task');

	// If the item is clicked, execute the createTask function
	submitButton.onclick = function createTask() {

		// Find the input element and save its value in the variable taskTitle
		const taskTitle = document.querySelector('#task_title_input').value

		// If 'taskTitle' is not empty
		if (taskTitle !== ''){
			// Send POST request to create a new task
			fetch(`tasks/?day=${day.innerHTML}&month=${month}&year=${year}`, {
			    method: 'POST',
			    body:JSON.stringify({
			    	title: taskTitle
			    })
			})
		}

		// TODO Wait until fetch is posted and then reload tasks and clear input placeholder
		// Refresh the task tables by calling the tasks function with an argument passed as the argument to the current function
		tasks(day)
	}
		document.querySelector('#task_title_input').value = ''	
}


// This function creates a list of active and inactive tasks
function task(data){
	// Select blank lists
	const tasksList = document.querySelector('#tasks_list');
	const doneTasksList = document.querySelector('#done_tasks_list');

	// Create a container for a single task
	const taskContainer = document.createElement('div');
	taskContainer.id = data.id
	taskContainer.innerHTML = `${data.title}`

	// If the status of the task is ACTIVE, assign the class 'task_active'
	// and add the task to the list of ACTIVE tasks
	if(data.status === 'A'){
		taskContainer.className = "task_active"
		tasksList.append(taskContainer)

	// If the status of the task is else, assign the class 'task_active'
	// and add the task to the list of done tasks
	} else {
		taskContainer.className = "task_disactive"
		doneTasksList.append(taskContainer)
	}

	// If the container for a single task is clicked
	taskContainer.onclick = () => {
		// If the task is ACTIVE
		if(data.status === 'A'){
				// If the task was created out of a routine
				if(data.is_routine){
					// Change the routine object properties by one routine execution
					fetch(`routine/`, {
					    method: 'PUT',
					    body:JSON.stringify({
					    	id: data.routine_id
					    })
					})
					// Clear the container from routine 
					document.querySelector('#routines-container').innerHTML = ''
					// and reload that container by calling the loadRoutine function
					loadRoutine()
					// Run animation and then remove task that was clicked
					taskContainer.style.animationPlayState = 'running';
					taskContainer.addEventListener('animationend', () => {
						taskContainer.remove() 
					})

				// If task was not created out of a routine
				} else {
					// Change the task object to disactive
					fetch(`tasks/`, {
					    method: 'PUT',
					    body:JSON.stringify({
					    	status: 'D',
					    	id: data.id
					    })
					})
					// Run animations, remove task from to do list, change it's style to disactive
					// and append it to disactive tasks list
					taskContainer.style.animationPlayState = 'running';
					taskContainer.addEventListener('animationend', () => {
						taskContainer.remove()
						doneTasksList.append(taskContainer)
						taskContainer.className = "task_disactive"
					})					
				}

		// If the task is DISACTIVE
		} else {

			fetch(`tasks/`, {
			    method: 'PUT',
			    body:JSON.stringify({
			    	status: 'A',
			    	id: data.id
			    })
			})
			tasksList.append(taskContainer)
			taskContainer.className = "task_active"

			const dayy = document.querySelector('#day_number').innerHTML
			const day = document.querySelectorAll('td')
			for(i=0; i < day.length; i++){
				if(day[i].innerHTML == dayy){
					var dayyy = day[i]
					tasks(dayyy)
				}
			}
		}
	}
}



// This function opens and closes the sidebar
function sidebarButton() {
	var openSidebarButton = document.querySelector('#open_sidebar_button')
	openSidebarButton.onclick = () => {
		if(openSidebarButton.className == 'OPEN'){
			openNav()
			openSidebarButton.className = "CLOSE"
		} else {
			closeNav()
			openSidebarButton.className = "OPEN"
		}
	}
}


/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.querySelector("#left-container").style.width = "250px";
  document.querySelector("#open_sidebar_button").style.marginLeft = "250px";
  document.querySelector("#middle-conatiner").style.marginLeft = "270px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.querySelector("#left-container").style.width = "0";
  document.querySelector("#open_sidebar_button").style.marginLeft = "0px";
  document.querySelector("#middle-conatiner").style.marginLeft = "20px";
}