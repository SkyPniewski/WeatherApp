$(document).ready(function() {

    //Fires when DOM is Loaded
    $(function() {
        $(".extraDetails").hide()
        $(".cardIcon").hide()
        $("#hourlyForecastCards").hide();
        initHourCards();
    });

    //WEATHER CARDS    
    //Add events to card clicks
    $(".card-forecast-hour").each(function(index, item){
        if(index == 0)
            updateSelectedHour(item)
        $(item).click( function(event){         
            $(item).find(".extraDetails").toggle(250),
            updateSelectedHour(item)
        
    })});

    $(".card-forecast-day").each(function(index, item){
        if(index == 0)
            updateSelectedDay(item)
        $(item).click( function(event){         
            $(item).find(".extraDetails").toggle(250),
            updateSelectedDay(item)
        
    })});
        
    //Change from Daily to Hourly to Currently
    $("#dailyForecastBtn").click(function(event){
        updateSelectedDay(selectedDay);
        $("#dailyForecastCards").show();
        $("#hourlyForecastCards").hide();
    });
    $("#hourly-btn").click(function(event){    
        updateSelectedHour(selectedHour);    
        $("#hourlyForecastCards").show();        
        $("#dailyForecastCards").hide();
    });


    //Update the selected forecast when card is clicked or sort type is changed
    var selectedHour;
    function updateSelectedHour (hourCard){
        if(selectedHour != null)
            $(selectedHour).removeClass('selected-card');
        selectedHour = hourCard;
        $(selectedHour).addClass('selected-card');
        popSelectedForecast(hourCard, false);
    };

    var selectedDay;
    function updateSelectedDay (dayCard){
        if(selectedDay != null)
            $(selectedDay).removeClass('selected-card');
        selectedDay = dayCard;
        $(selectedDay).addClass('selected-card');
        popSelectedForecast(dayCard, true);
    };

    //populate the selected forecast
    //ask if bool because hour and day forecasts are different
    function popSelectedForecast(card, isDay){
        icon = $(card).find(".cardIcon").html();
        $.getScript("/static/js/skycons.js", function() {
            var skycons = new Skycons({"color": "silver"});
            skycons.set("selectedIcon", icon);
            skycons.play()
         });
         
        summary = $(card).find(".cardSummary").html();
        $('#selectedSummary').html(summary);

        //Precipitation
        precipProbability = $(card).find(".cardPrecipProbability").html();              
        $("#selectedPrecipProbability").html(precipProbability); 
        precipIntensity = $(card).find(".cardPrecipIntensity").html();
        $("#selectedPrecipIntensity").html(precipIntensity);
        $("#selectedDewPoint").html($(card).find(".cardDewPoint").html());
        $("#selectedHumidity").html($(card).find(".cardHumidity").html());
        $("#selectedUVIndex").html($(card).find(".cardUVIndex").html());
        $("#selectedCloudCover").html($(card).find(".cardCloudCover").html());


        //Overview
        temp = $(card).find(".cardTemp").html();              
        $("#selectedTemp").html(temp); 
        apparentTemp = $(card).find(".cardApparentTemp").html();
        $("#selectedApparentTemp").html(apparentTemp);

        time = $(card).find(".cardTime").html();
        $("#selectedTime").html(time);

        //Wind
        $("#selectedWindSpeed").html($(card).find(".cardWindSpeed").html());
        $("#selectedWindBearing").html($(card).find(".cardWindBearing").html());
        $("#selectedWindGust").html($(card).find(".cardWindGust").html());

    }

    //Manage the Hourly Cards so we only show 12 at a time
    function initHourCards(){
        totalHourCards = $("#hourly-cards-row").children().length;
        curHourlyIdx = hourCardsShowCt-1;
        showHourCards(0, curHourlyIdx);
        $("#totalcards").html(totalHourCards);

    };
   
    var curHourlyIdx = 0;
    var hourCardsShowCt = 12;
    var totalHourCards;
    function shiftHourCards(direction){
        curHourlyIdx += direction;
        if(curHourlyIdx >= totalHourCards-1){
            curHourlyIdx = totalHourCards - 1;
        }
        if(curHourlyIdx <= hourCardsShowCt -1){
            curHourlyIdx = hourCardsShowCt -1;

        }
        showHourCards(curHourlyIdx-hourCardsShowCt+1, curHourlyIdx);
        $("#current-idx").html(curHourlyIdx);
    };

    //Show the hour cards between the start and end indices
    function showHourCards(startIdx, endIdx){
        $("#hourly-cards-row").children('.column').each(function(index, item){
            if(index >= startIdx && index <= endIdx)
                $(item).find(".card-forecast-hour").show();
            else
                $(item).find(".card-forecast-hour").hide();
            });
                
    }

    //events attached to the buttons so we can shift the hourly forecast cards
    $("#prev-hour-btn").click(function(){
        shiftHourCards(-1);
    });
    $("#next-hour-btn").click(function(){
        shiftHourCards(1);
    });
});