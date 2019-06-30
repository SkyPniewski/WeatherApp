import datetime

from django.db import models
from django.utils import timezone

#store all the last request variables in this data model
class User(models.Model):
    client_ip = models.CharField(max_length=25, default='127.0.0.1')
    #the last remote ip they connected to using api.ipify.org
    last_ip = models.CharField(max_length=50)
    last_request_date = models.DateTimeField('Last Dark API request date', default=timezone.now())
    last_longitude = models.FloatField(default=0.00)
    last_latitude = models.FloatField(default=0.00)
    
