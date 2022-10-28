from django.db import models
from django.contrib.auth.models import AbstractUser

# Basic Django user model
class User(AbstractUser):
    pass


class RoutineTask(models.Model):
	title = models.CharField(max_length=100)
	user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="routine_tasks")
	status = models.CharField(max_length=1) # A - active || D - disactive
	start_date = models.DateField(null=True)
	times = models.IntegerField()
	streakes = models.IntegerField()
	repetition = models.IntegerField()
	last_date = models.DateField(null=True, blank=True)
	is_active = models.BooleanField()
	next_date = models.DateField(blank=True, null=True)
	streakes_record = models.IntegerField(null=True, blank=True)
	def __str__(self):
		return self.title
	def serialize(self):
		return {
			"repetition": self.repetition,
			"start_date": self.start_date,
			"id": self.id,
			"title": self.title,
			"times": self.times,
			"user_id": self.user.id,
			"status": self.status,
			"streakes": self.streakes,
			"last_date": self.last_date,
			"is_active": self.is_active,
			"next_date": self.next_date,
			"streakes_record": self.streakes_record
		}
	class Meta:
		ordering = ['-is_active','-streakes']


class NewTask(models.Model):
	title = models.CharField(max_length=100)
	date = models.DateField(null=True)
	user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="tasks")
	status = models.CharField(max_length=1) # A - active || D - disactive
	is_routine = models.BooleanField(blank=True, null=True)
	routine_id = models.IntegerField(blank=True, null=True)
	def __str__(self):
		return self.title
	def serialize(self):
		return {
			"id": self.id,
			"title": self.title,
			"date": self.date,
			"user_id": self.user.id,
			"status": self.status,
			"is_routine": self.is_routine,
			"routine_id": self.routine_id
		}
	class Meta:
		ordering = ['-date']