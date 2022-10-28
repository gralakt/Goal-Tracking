from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, NewTask, RoutineTask

admin.site.register(User, UserAdmin)
admin.site.register(NewTask)
admin.site.register(RoutineTask)
