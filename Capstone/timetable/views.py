from django.shortcuts import render, redirect, HttpResponse
import calendar
from django.http import JsonResponse
from .models import NewTask, RoutineTask
from django.views.decorators.csrf import csrf_exempt
from datetime import date, datetime, timedelta
import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm


# This function renders the home page
def planer(request):
	return render(request, "timetable/home.html")


# This function deals with RoutineTask objects
@csrf_exempt
def routine(request):

	# Save today's date in the today_date variable
	now = datetime.now()
	today_date = now.date()

	# If the method is GET
	if request.method == "GET":
		# Try to save all 'RutineTask' objects of the user who sent the request in the variable 'routines'
		try:
			routines = RoutineTask.objects.filter(user=request.user)
			# For every routine
			for routine in routines:
				# If the 'last_date' attribute for the routine is not empty
				if routine.last_date is not None:
					# If the date 'last_date' is less than the date:
					# (today's date) - (repeat the routine every how many days)
					if routine.last_date < today_date - timedelta(days = routine.repetition):
						# Set the 'streakes' attribute of the routine to 0
						routine.streakes = 0
					# If the date 'today_date' is more or equal than the date:
					# (last date routine was done) + (repeat the routine every how many days)
					if today_date >= routine.last_date + timedelta(days = routine.repetition):
						# Check that the routine is active
						routine.is_active = True
					# If the routine is to be repeated every day and the next date is less than today's date
					if routine.repetition == 1 and routine.next_date < today_date:
						# Set the next routine date for today
						routine.next_date = today_date
					else:
						# If not, set the next routine date to the result of adding the last date with how many days to repeat
						routine.next_date = routine.last_date + timedelta(days = routine.repetition)
				# Save the routine update
				routine.save()
			# Save all user routines in a new variable after updating
			final_routines = RoutineTask.objects.filter(user=request.user)
			# Return JSON format, with each serialize routine separately
			return JsonResponse([routine.serialize() for routine in final_routines], safe=False)
		# Unless the objects we want to access do not exist
		except RoutineTask.DoesNotExist:
			# Return the JSON format informing that the routines do not exist
			return JsonResponse({"error": "Routines not found."}, status=404)

	# If the method is PUT
	elif request.method == "PUT":
		# Save the JSON format sent with the PUT method
		data = json.loads(request.body)
		# If the 'id' key in the received JSON is not empty
		if data.get("id") is not None:
			# Find the routine object with the id value given in JSON format under the 'id' key
			routine = RoutineTask.objects.get(id=data["id"])
			# Add 1 to the current value of the streakes attribute of routine
			routine.streakes = routine.streakes + 1
			# Add 1 to the current value of the times attribute of routine
			routine.times = routine.times + 1
			# Change the 'last date' value to today
			routine.last_date = today_date
			# Deactivate the routine
			routine.is_active = False
			# If the current number of executions in a row is greater than the record
			if routine.streakes > routine.streakes_record:
				# Update the record to the current value
				routine.streakes_record = routine.streakes
		# Save changes to the routine object
		routine.save()
		# Return Success Status 204
		return HttpResponse(status=204)

	# If the method is POST
	elif request.method == "POST":
		# Save the JSON format sent with the PUT method
		data = json.loads(request.body)
		# Create a new routine object
		new_routine = RoutineTask()
		# If the key 'title' from the saved JSON is not empty
		if data.get("title") is not None:
			# Set the required values for the new routine object
			new_routine.title = data["title"]
			new_routine.start_date = today_date
			new_routine.user = request.user
			new_routine.status = 'A'
			new_routine.times = 0
			new_routine.streakes = 0
			new_routine.repetition = data["repetition"]
			new_routine.is_active = True
			new_routine.last_date = today_date
			new_routine.streakes_record = 0
		# Save the new routine object
		new_routine.save()
		# Return Success Status 204
		return HttpResponse(status=204)


# This function returns a JSON of the calendar.
def callendar(request):
	# Save the month GET method attribute or 10 in the month variable.
	month = int(request.GET.get("month") or 10)
	# Save the year GET method attribute or 2022 in the year variable.
	year = int(request.GET.get("year") or 2022)
	# Save today's date
	now = datetime.now()
	# Create a calendar template with the first day of Sunday.
	text_cal = calendar.HTMLCalendar(firstweekday=0)
	# Generate a monthly calendar with the above template, with the month variable and the year variable
	data = text_cal.formatmonth(year, month)
	# Return JSON file format with monthly calendar with key 'posts', and current month under key 'month'
	return JsonResponse({
		"posts": data,
		"month": now.month
		})


# This function deals with NewTask objects
@csrf_exempt
def tasks(request):
	# Save the day GET method attribute or 1 in the day variable.
	day = int(request.GET.get("day") or 1)
	# Save the month GET method attribute or 10 in the month variable.
	month = int(request.GET.get("month") or 1)
	# Save the year GET method attribute or 2022 in the year variable.
	year = int(request.GET.get("year") or 2022)
	# Create a date object with the given arguments
	requested_date = date(year, month, day)
	# Access all RoutineTask objects, created by the user
	routines = RoutineTask.objects.filter(user=request.user)
	# For each of routines
	for routine in routines:
		# If the creation date of the routine is less than or equal to the requested_date
		if routine.start_date <= requested_date:
			# If the requested_date is the same as the next date to complete the routine
			if requested_date == routine.next_date:
				# Check if such an object has not been created yet
				try:
					task_check = NewTask.objects.get(title=routine.title, date=requested_date, user=request.user)
				# If not create a new 'NewTask' object with following parameters
				except NewTask.DoesNotExist:
					new_task = NewTask()
					new_task.title = routine.title
					new_task.date = requested_date
					new_task.user = request.user
					new_task.status = 'A'
					new_task.is_routine = True
					new_task.routine_id = routine.id
					new_task.save()

	# Try to access all NewTask objects that the user has created
	try:
		tasks = NewTask.objects.filter(user=request.user)
	# If the user didn't create any, return error
	except NewTask.DoesNotExist:
		return JsonResponse({"error": "Tasks not found."}, status=404)

	# If GET - return all tasks serialize in JSON
	if request.method == "GET":
		tasks = NewTask.objects.filter(user=request.user, date=requested_date)
		return JsonResponse([task.serialize() for task in tasks], safe=False)

	elif request.method == "PUT":
		# Load the JSON format sent with the request
		data = json.loads(request.body)
		# If JSON contains a non-null id key
		if data.get("id") is not None:
			# Find that task object
			task = NewTask.objects.get(id=data["id"])
			# Change its status attribute to the status provided in JSON
			task.status = data["status"]
		task.save()
		# Return Success Status 204
		return HttpResponse(status=204)

	elif request.method == "POST":
		# Load the JSON format sent with the request
		data = json.loads(request.body)
		# Create a NewTask object
		new_task = NewTask()
		# If JSON contains a non-null title key - create a new 'NewTask' object with following parameters
		if data.get("title") is not None:
			new_task.title = data["title"]
			new_task.date = requested_date
			new_task.user = request.user
			new_task.status = 'A'
			new_task.is_routine = False
		new_task.save()
		# Return Success Status 204
		return HttpResponse(status=204)



from django.contrib.auth import get_user_model
User = get_user_model()

# This function renders the login page
def loginPage(request):
	if request.method == 'POST':
		username = request.POST.get('username')
		password = request.POST.get('password')
		try:
			user = User.objects.get(username=username)
		except:
			print('User does not exist')
		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request, user)
			return redirect('home')
	page = 'login'
	return render(request, 'timetable/login_register.html', {'page': page})

# This function logs the user out
def logoutPage(request):
	logout(request)
	return redirect('home')

# This function renders the registration page which creates new user objects with the 'UserCreationForm'
def registerPage(request):
	form = UserCreationForm()
	if request.method == 'POST':
		form = UserCreationForm(request.POST)
		if form.is_valid():
			form.save()
			username = form.cleaned_data['username']
			password = form.cleaned_data['password1']
			user = authenticate(username=username, password=password)
			login(request, user)

			# user.username = user.username.lower()
			# user.save()
			# login(request, user)
			return redirect('home')
		else:
			print('Error')
	return render(request, 'timetable/login_register.html', {'form': form})

