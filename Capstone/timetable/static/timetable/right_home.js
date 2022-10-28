document.addEventListener('DOMContentLoaded', loadRoutine)

function loadRoutine() {
	fetch(`routine/`)
	.then(response => response.json())
	.then(data => {
		console.log(data)
		for (i = 0; i < data.length; i++){
			createRoutineContainer(data[i])
		}
		tryy()
	})
}

function createRoutineContainer(routine) {
	var routineContainer = document.createElement('div')

	var routineTitle = document.createElement('div')

	var routineInside = document.createElement('div')
	routineInside.className = 'panel'

	var percent = (routine.streakes / 90) * 100
	var streaks = routine.streakes
	var times = routine.times

	var routineBar = document.createElement('div')

	var status = routine.is_active
	if (status == true){
		routineTitle.innerHTML = `<p>&#8987 ${routine.title}</p>`
		routineTitle.className = 'activeRoutine'
		routineTitle.onclick = () => {
			if (routine.streakes < 15){
				newPercent = 100
			} else {
				newPercent = ((routine.streakes + 1) / 90) * 100				
			}

			newStreakes = streaks + 3
	        routineBar.style.width = `${newPercent}%`;
	        routineBar.innerHTML = `Congrats! See you next time!`;
		
	        progressBar = routineBar.parentElement
	        routineDiv = progressBar.parentElement
	        title = routineDiv.querySelector('.activeRoutine')

			title.className = 'noActiveRoutine'
			title.innerHTML = `<div class="tooltip">&#128197 ${routine.title}<span class="tooltiptext">Next: ${routine.next_date}</span></div>`

			streaks ++;
			times ++;
			fetch(`routine/`, {
			    method: 'PUT',
			    body:JSON.stringify({
			    	streaks: streaks,
			    	id: routine.id,
			    	times: times
			    })
			})
		}
	} else {
		routineTitle.className = 'noActiveRoutine'
		routineTitle.innerHTML = `<div class="tooltip">&#128197 ${routine.title}<span class="tooltiptext">Next: ${routine.next_date}</span></div>`
	}

	routineContainer.className = 'accordion'

	routineInside.innerHTML = `<div class="routine-info">
	<p>CREATED</p> ${routine.start_date}  <p>'IN A ROW' RECORD</p> ${routine.streakes_record}
	<p>LAST DONE</p> ${routine.last_date} <p>TOTAL</p> ${routine.times} times <p>EVERY</p>${routine.repetition} day(s)
	</div>`

	routineContainer.append(routineTitle)

	var routineProgress = document.createElement('div')
	routineProgress.className = 'Progress'

	if (percent == 0){
		routineBar.innerHTML = `Don't give up! Next try: ${routine.next_date}`
		routineBar.className = 'clear-bar'
	} else {
		routineBar.className = 'Bar'
		routineBar.style.width = `0px`
		routineBar.value = `${percent}%`
 		loadProgress(routineBar)
	}

	routineProgress.append(routineBar)

	routineContainer.append(routineProgress)

	var routinesContainer = document.querySelector('#routines-container')
	routinesContainer.append(routineContainer)
	routinesContainer.append(routineInside)
}

function loadProgress(bar) {
	progressButton = document.querySelector('#makeProgress')
	var i = 0;
	function move(bar) {
	  if (i == 0) {
	    i = 1;
	    var width = 0;
	    var id = setInterval(frame, 10);
	    function frame() {
	      if (width >= parseInt(bar.value)) {
	        i = 0;
	      } else {
	        width++;
	        bar.style.width = width + "%";
	        bar.innerHTML = width + "/90";
	      }
	    }
	  }
	}
	move(bar)
}

document.addEventListener('DOMContentLoaded', 	routineSubmit)
// This function takes care of sending a POST request when a button is clicked in order to create a new routine
function routineSubmit() {
// submit_routine
	// Find an element with id = submit-task
	const routineSubmitButton = document.querySelector('#submit_routine');

	// If the item is clicked, execute the createTask function
	routineSubmitButton.onclick = function createRoutine() {

		// console.log('HELLO')

		// Find the input element and save its value in the variable taskTitle
		const routineTitle = document.querySelector('#routine_title').value

		const routineRepetition = document.querySelector('#routine_repetition').value

		// If 'taskTitle' is not empty
		if (routineTitle !== ''){
			// Send POST request to create a new task
			fetch(`routine/`, {
			    method: 'POST',
			    body:JSON.stringify({
			    	title: routineTitle,
			    	repetition: routineRepetition
			    })
			})
		}

		// Refresh the task tables by calling the tasks function with an argument passed as the argument to the current function

		document.querySelector('#task_title_input').innerHTML = ''
		location.reload()
		// loadRoutine()
	}
}



function tryy() {
	var acc = document.getElementsByClassName("accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
	  acc[i].addEventListener("click", function() {

	    this.classList.toggle("active");
	    var panel = this.nextElementSibling;
	    if (panel.style.maxHeight) {
	      panel.style.maxHeight = null;
	      panel.style.paddingBottom = '0px';
	    } else {
	      panel.style.maxHeight = panel.scrollHeight + "px";
	      panel.style.paddingBottom = '10px';
	    }
	  });
	}
}