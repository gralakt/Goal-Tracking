from django.urls import path
from . import views

urlpatterns = [
    path('planer', views.planer, name='home'),
    path('API/', views.callendar, name='API'),
    path('tasks/', views.tasks, name='tasks'),
    path('routine/', views.routine, name='routine'),

    path('login/', views.loginPage, name="login"),
    path('logout/', views.logoutPage, name="logout"),
    path('register/', views.registerPage, name="register")
]