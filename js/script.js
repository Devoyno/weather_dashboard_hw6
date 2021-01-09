$(document).ready(function () {
  $("#search-button").on("click", function () {
    const cityName = $("#search-value").val().trim();
    searchWeather(cityName);
    document.querySelector("#search-value").value='';
  });

  function makeList(name) {
    var li = $("<li>").addClass("list-group-item").text(name);
    $(".history").append(li);
  }

  $(".history").on("click", "li", function () {
    searchWeather($(this).text());
  });

  function searchWeather(name) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      name +
      "&appid=a4f916420d3bfbb8c319e419d8718d33&units=imperial";
    $.ajax({
      method: "GET",
      url: queryURL,
      dataType: "json",
    }).then(function (weatherData) {
      if (history.indexOf(name) === -1 && name !== "") {
        history.push(name);
        localStorage.setItem("history", JSON.stringify(history));
        makeList(name);
      }
      $("#todayWeather").empty();
      var card = $("<div>").addClass("card mt-3");
      var cardBody = $("<div>").addClass("card-body");
      var cardTitle = $("<h2>").addClass("card-title").text(weatherData.name);
      var temp = Math.round(weatherData.main.temp);
      var tempEl = $("<p>")
        .addClass("card-text")
        .text("Temp: " + temp + "°F");

      var date = moment().format("ddd MMMM Do");

      var dateEl = $("<p>").text(date);

      var humidity = weatherData.main.humidity;

      var humidityEl = $("<p>")
        .addClass("card-text")
        .text("Humidity: " + humidity + "%");

      var wind = weatherData.wind.speed;
      var windEl = $("<p>")
        .addClass("card-text")
        .text("Wind Speed: " + wind + "mph");

      var image = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/w/" +
          weatherData.weather[0].icon +
          ".png"
      );

      $("#todayWeather").append(
        card.append(
          cardBody.append(
            cardTitle.append(image),
            dateEl,
            tempEl,
            humidityEl,
            windEl
          )
        )
      );

      getForcast(weatherData.coord.lat, weatherData.coord.lon);
      getUVIndex(weatherData.coord.lat, weatherData.coord.lon);
    });
  }

  function getUVIndex(lat, lon) {
    $.ajax({
      method: "GET",
      url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=a4f916420d3bfbb8c319e419d8718d33`,
      dataType: "json",
      success: function (response) {
        console.log(response);

        var button = $("<button>").addClass("btn").text(response.value);
        if (response.value < 3) {
          button.addClass("btn-success");
        } else if (response.value < 7) {
          button.addClass("btn-warning");
        } else {
          button.addClass("btn-danger");
        }
        $("#todayWeather .card-body").append(button);
      },
    });
  }

  function getForcast(lat, lon) {
    $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=a4f916420d3bfbb8c319e419d8718d33&units=imperial`,
      dataType: "json",
    }).then(function (res) {
      
      $("#forecast-box").empty();

      for (var i = 1; i < 6; i++) {
        var day = res.daily[i];
        var time = moment.unix(day.dt).format("ddd MMMM Do");

        // Add Temp var

        var tempMax = Math.round(day.temp.max);
        var tempMin = Math.round(day.temp.min);

        // console.log(temp);

        var image = $("<img>").attr(
          "src",
          "https://openweathermap.org/img/w/" + day.weather[0].icon + ".png"
        );

        var card = $("<div>").addClass("card text-white bg-primary m-1");
        var cardBody = $("<div>").addClass("card-body");
        var cardTitle = $("<h4>").addClass("card-title").text(time);

        // Add card elements - 5day

        var tempMaxEl = $("<h6>")
          .addClass("card-text")
          .text("High: " + tempMax + "°F");
        var tempMinEl = $("<h6>")
          .addClass("card-text")
          .text("Low: " + tempMin + "°F");

        $("#forecast-box").append(
          card.append(
            cardBody.append(cardTitle.append(image), tempMaxEl, tempMinEl)
          )
        );
      }
    });
  }

  var history = JSON.parse(localStorage.getItem("history")) || [];
  console.log(history);

  if (history.length > 0) {
    searchWeather(history[history.length - 1]);
  }
  for (var i = 0; i < history.length; i++) {
    makeList(history[i]);
  }
});
