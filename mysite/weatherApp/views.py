from django.shortcuts import get_object_or_404, render

# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect, HttpRequest, Http404
from django.template import loader
from django.urls import reverse

from .models import User

# DarkSky
from darksky.api import DarkSky
from darksky.types import languages, units, weather

#geoip
from django.contrib.gis.geoip2 import GeoIP2
from geoip2 import database

#ipware for client IP
from ipware import get_client_ip

#requests to get IP
import requests

from django.core.cache import cache

#import time for user model
from django.utils import timezone

def dashboard(request):	

	client_ip = get_client_ip(request)
	
	try:
		user = User.objects.get(client_ip = client_ip[0])
	except:
		user = User()
	
	#Grabs the IP from api.ipify.org which can be found in GeoIP2's API
	remote_ip_cache = cache.get('remote_ip') # or user.last_ip
	remote_ip = requests.get(url='https://api.ipify.org')
	
	#Instead of storing in the database, we can just use the user's cache to store their content
	if(remote_ip_cache == None):		
		cache.set('remote_ip', remote_ip)
	#If the ip that we get from api.ipify.org is different than the cache/data model
	#We can assume that they have relocated and we will try and update their location based
	#off the GeoIP API
	if(remote_ip_cache != remote_ip):
		cache.set('remote_ip', remote_ip)
		remote_ip_cache = remote_ip

	user.last_ip = remote_ip_cache.text
	g = GeoIP2()

	try:
		lat_lon = g.lat_lon(remote_ip_cache.text)
		user.last_latitude = lat_lon[0]
		user.last_longitude = lat_lon[1]
	except:
		raise Http404("Can not find Location.")

	#We could make some logic to only allow these users to get requests from Dark Sky API
	# every so often.
	user.last_request = timezone.now()
	user.save()

	geoCity = g.city(remote_ip.text)

	#Get Forecast from Dark Sky API with API_KEY
	DWD_API_KEY = '9e3ac71786112191eaed1cd8abbe4614'
	darksky = DarkSky(DWD_API_KEY)

	forecast = darksky.get_forecast(
		lat_lon[0], lat_lon[1],
		extend=False, # default `False`
		lang=languages.ENGLISH, # default `ENGLISH`
		units=units.AUTO, # default `auto`
		exclude=[weather.MINUTELY, weather.ALERTS] # default `[]`
	)

	context = {'forecast': forecast,
				'geoCity': geoCity}
	return render(request, 'weatherApp/dashboard.html', context)

#if i decided to go the multi-view route, I would have changed the context being sent
def dailyForecast(request):
	if(request.method == 'POST'):
		value = request.POST['btn']
	return render(request, 'weatherApp/dailyForecast.html', {'forecast':m_Forecast})