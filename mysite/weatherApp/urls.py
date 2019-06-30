from django.urls import path
from django.conf.urls.static import static

from . import views

app_name = 'weatherApp'
urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('dailyForecast', views.dailyForecast, name = 'dailyForecast')
]
