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
    console.log(latitude, longitude);
    let unsplashUrl;
    //fetch weather data for current location
    const apiKey = "6df34740c7766e4c99784637a68ebe70";
    let url = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        //get 5 days and save them as array of objects
        let forecastData = [];
        forecastData.push(data.list['0']);
        forecastData.push(data.list['8']);
        forecastData.push(data.list['16']);
        forecastData.push(data.list['24']);
        forecastData.push(data.list['32']);

        //filter out only needed information, convert date to the day of weeks
        let forecast = [];
        forecastData.forEach((day) => {
          //convert date to the week day
          let dayNumber = new Date(day.dt * 1000).getDay();

          let dayData = {
            "dayOfWeek": convertDayOfWeek(dayNumber),
            "description": day.weather['0'].description,
            "temp": Math.round(day.main.temp),
            "icon": day.weather['0'].icon
          };

          forecast.push(dayData);
        });

        //display informationin the app
        main.innerHTML = `
        <div class="button-container">
          <h2><span>${data.city.name}</span>, <span>${data.city.country}</span></h2>
          <button onclick="temperatureToggle()" aria-label="temperarture converting button">
            <svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 560 560">
              <path fill="#9BC9FF" d="M360 292V156c0-40-32-72-72-72v64h16v175a52 52 0 0 1-16 101v56a108 108 0 0 0 72-188zm0 0"/>
              <path fill="#D1E7F8" d="M236 372c0-23 15-43 36-49V148h16V84c-40 0-72 32-72 72v136a108 108 0 0 0 72 188v-56c-29 0-52-23-52-52zm0 0"/>
              <path fill="#FF6243" d="M272 323a52 52 0 0 0 16 101V148h-16v175zm0 0"/>
              <path fill="#FF3501" d="M340 372c0-23-15-43-36-49V148h-16v276c29 0 52-23 52-52zm0 0"/>
              <path fill="#FFFFFF" d="M49 372c1 4 5 7 9 7l4-1c5-1 8-7 6-13A233 233 0 0 1 285 52c63-1 122 23 166 67h-26c-6 0-10 5-10 10 0 6 5 11 10 11l51-1a10 10 0 0 0 11-10l-1-52c0-5-5-10-10-10-6 0-11 5-11 11l1 26a253 253 0 0 0-360 4 254 254 0 0 0-57 264zm0 0M455 450c-90 92-238 93-330 4l26-1c6 0 10-5 10-10 0-6-5-10-10-10h-51c-6 0-11 5-11 11l1 51c0 5 5 10 10 10 6 0 11-5 11-10l-1-27a254 254 0 0 0 427-130c10-46 6-94-10-138-1-5-7-8-13-6-5 2-8 8-6 13 31 85 10 178-53 243zm0 0"/>
            </svg>
          </button>
        </div>
        <h3>Today</h3>
        <h4>${forecast[0].dayOfWeek}</h4>
        <p>${forecast[0].description}</p>
        <p class="temperature C">${forecast[0].temp}&#176; C</p>
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
          temp.classList.add('temperature');
          temp.classList.add('C');
          temp.innerHTML = `${day.temp}&#176 C`;

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
      .catch(() => {
        console.log("error with weather API");
        main.innerHTML = "<p>Sorry, not possible to  get data on current weather, please try again later</p>";
      });
  }

  function error() {
    main.innerHTML = "<p>We were unable to retrieve your location, please allow browser to know your current location</p>";
  }

  main.innerHTML = `
    <div class='locating'>
      <svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 560 560" width=50>
        <path fill="#14213D" d="M49 372c1 4 5 7 9 7l4-1c5-1 8-7 6-13A233 233 0 0 1 285 52c63-1 122 23 166 67h-26c-6 0-10 5-10 10 0 6 5 11 10 11l51-1a10 10 0 0 0 11-10l-1-52c0-5-5-10-10-10-6 0-11 5-11 11l1 26a253 253 0 0 0-360 4 254 254 0 0 0-57 264zm0 0M455 450c-90 92-238 93-330 4l26-1c6 0 10-5 10-10 0-6-5-10-10-10h-51c-6 0-11 5-11 11l1 51c0 5 5 10 10 10 6 0 11-5 11-10l-1-27a254 254 0 0 0 427-130c10-46 6-94-10-138-1-5-7-8-13-6-5 2-8 8-6 13 31 85 10 178-53 243zm0 0"/>
      </svg>
    </div>
    <p>...Locating</p>`;

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

  fetch(unsplashUrl, {
    headers: {
      Authorization: 'Client-ID 73848e2ce82fbdcd2e3231097715e99a0d340f66efa2984701e7b81111e13924'
    }
    })
  .then(response => response.json())
  .then(data => {
    background.style.backgroundImage = `url(${data.results['0'].urls.regular})`;
  })
  .catch(() => console.log('An error occured from Unsplash'));
}

//Celsius to Fahrenheit and back converter
function temperatureToggle() {
  let temperatures = document.querySelectorAll('.temperature');
  console.log(temperatures);
  temperatures.forEach(item => {
    if (item.classList.contains('C')) {
      let oldValue = parseFloat(item.innerHTML);
      let newValue = Math.round((oldValue*1.8)+32);
      item.classList.remove('C');
      item.classList.add('F');
      item.innerHTML = `${newValue}&#176 F`;
    } else if (item.classList.contains('F')) {
      let oldValue = parseFloat(item.innerHTML);
      let newValue = Math.round((oldValue-32)/1.8);
      item.classList.remove('F');
      item.classList.add('C');
      item.innerHTML = `${newValue}&#176 C`;
    }
  })
}

//initiates main function
getLocation();
