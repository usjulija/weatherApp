const main = document.getElementById("app");

//get weather based on current location
function getLocation() {

  if (!navigator.geolocation){
    main.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    let latitude  = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(`lat: ${latitude}; lng: ${longitude}`);

    let unsplashUrl;
    //fetch weather data for current location
    const apiKey = "6df34740c7766e4c99784637a68ebe70";
    let url = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);

        //get the 5 days and save them as array of objects
        let forecastData = [];
        forecastData.push(data.list['0']);
        forecastData.push(data.list['8']);
        forecastData.push(data.list['16']);
        forecastData.push(data.list['24']);
        forecastData.push(data.list['32']);
        console.log(forecastData);

        //filter out only needed information, convert date to the day of weeks
        let forecast = [];
        forecastData.forEach((day) => {
          //if (index < 1) return; //do not save the first item in the array

          //convert date to the week day
          let dayNumber = new Date(day.dt * 1000).getDay();
          console.log(dayNumber);

          let dayData = {
            "dayOfWeek": convertDayOfWeek(dayNumber),
            "description": day.weather['0'].description,
            "temp": Math.round(day.main.temp),
            "icon": day.weather['0'].icon
          };

          forecast.push(dayData);
        });

        console.log(forecast);

        main.innerHTML = `
        <h2><span>${data.city.name}</span>, <span>${data.city.country}</span></h2>
        <h3>Today</h3>
        <h4>${forecast[0].dayOfWeek}</h4>
        <p>${forecast[0].description}</p>
        <p><span class="temperature">${forecast[0].temp}</span>&#176; <span class="toggle">C</span></p>
        <div class="image">
          <img src="http://openweathermap.org/img/w/${forecast[0].icon}.png" alt="weather icon">
        </div>
        `;

        const weaterContainer = document.createElement('div');
        weaterContainer.classList.add('forecast');
        main.appendChild(weaterContainer);

        forecast.forEach((day, index) => {
          if (index < 1) return; //do not include the first item

          const container = document.createElement('div');
          const heading = document.createElement('h4');
          heading.innerHTML = day.dayOfWeek;

          const weatherDescription = document.createElement('p');
          weatherDescription.innerHTML = day.description;

          const temp = document.createElement('p');
          temp.innerHTML = `<span class="temperature">${day.temp}</span>&#176 <span class="toggle">C</span>`;

          const imageContainer = document.createElement('div');
          imageContainer.classList.add('image');

          const img = document.createElement('img');
          img.src = `http://openweathermap.org/img/w/${day.icon}.png`;
          img.alt = day.description;

          weaterContainer.appendChild(container);
          container.appendChild(heading);
          container.appendChild(weatherDescription);
          container.appendChild(temp);
          container.appendChild(imageContainer);
          imageContainer.appendChild(img);
        })

        //choose unplash picture based on current weather
        unsplashUrl = `https://api.unsplash.com/search/photos?page=1&query=${data.list['0'].weather['0'].main}`;
        fetchUnsplash(unsplashUrl);
      })
      .catch(() => console.log("error with weather API"));
  }

  function error() {
    main.innerHTML = "Unable to retrieve your location";
  }

  main.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);
}

//converts week's day number to word
function convertDayOfWeek(dateNumber) {
  let dayOfWeek;
  switch (dateNumber) {
    case 0:
      dayOfWeek = "Sunday";
      break;
    case 1:
      dayOfWeek = "Monday";
      break;
    case 2:
      dayOfWeek = "Tuesday";
      break;
    case 3:
      dayOfWeek = "Wednesday";
      break;
    case 4:
      dayOfWeek = "Thursday";
      break;
    case 5:
      dayOfWeek = "Friday";
      break;
    case  6:
      dayOfWeek = "Saturday";
      break;
  }

  return dayOfWeek;
}

function fetchUnsplash(unsplashUrl) {
  //fetch background image depending on weather summary
  let background = document.getElementById('background');
  console.log(unsplashUrl);
  fetch(unsplashUrl, {
    headers: {
      Authorization: 'Client-ID 73848e2ce82fbdcd2e3231097715e99a0d340f66efa2984701e7b81111e13924'
    }
    })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    background.style.backgroundImage = `url(${data.results['0'].urls.regular})`;
  })
  .catch(() => console.log('An error occured from Unsplash'));
}

//initiates main function
getLocation();
