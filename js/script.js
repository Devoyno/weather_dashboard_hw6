$(document).ready(function() {
    $("#search-button").on("click", function() {
        const cityName = $("#search-value").val().trim()
        searchWeather(cityName);
    })
    function searchWeather(name) {
        console.log(name);
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + name + "&appid=a4f916420d3bfbb8c319e419d8718d33&units=imperial"
        $.ajax({
            method:"GET",
            url: queryURL,
            dataType: "json"
        }).then(function(weatherData){
            console.log(weatherData);
            var card = $("<div>").addClass("card mt-3");
            var cardBody = $("<div>").addClass("card-body");
            var cardTitle = $("<h2>").addClass("card-title").text(weatherData.name);
            $("#todayWeather").append(card.append(cardBody.append(cardTitle)));

            getForcast(weatherData.coord.lat, weatherData.coord.lon)
        })
    }


  function getForcast(lat, lon) {
    $.ajax({
        method:"GET",
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=a4f916420d3bfbb8c319e419d8718d33&units=imperial`,
        dataType: "json"
    }).then(function(res){
        console.log(res)

        for (var i = 1; i < 6; i++) {
            console.log(res.daily[i])
            var day = res.daily[i]
        }


    })
  }
})

