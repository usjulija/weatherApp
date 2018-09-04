const main = document.getElementById("app");
const locationButton = document.getElementById("location");
const searchButton = document.getElementById("search");
const apiKey = "6df34740c7766e4c99784637a68ebe70";

//get weather based on current location
function getLocation() {
  //check is location navigation is supported
  if (!navigator.geolocation){
    main.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }
  //take position lat and lang
  function success(position) {
    let latitude  = position.coords.latitude;
    let longitude = position.coords.longitude;
    let unsplashUrl;

    //modify url
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    //fetch data
    fetchWeather(url);
  }

  //handle error whren geolocation went wrong
  function error() {
    main.innerHTML = "<p>We were unable to retrieve your location, please allow browser to know your current location</p>";
  }

  //loading message
  main.innerHTML = `
    <div class='locating'>
      <svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 560 560" width=50>
        <path fill="#14213D" d="M49 372c1 4 5 7 9 7l4-1c5-1 8-7 6-13A233 233 0 0 1 285 52c63-1 122 23 166 67h-26c-6 0-10 5-10 10 0 6 5 11 10 11l51-1a10 10 0 0 0 11-10l-1-52c0-5-5-10-10-10-6 0-11 5-11 11l1 26a253 253 0 0 0-360 4 254 254 0 0 0-57 264zm0 0M455 450c-90 92-238 93-330 4l26-1c6 0 10-5 10-10 0-6-5-10-10-10h-51c-6 0-11 5-11 11l1 51c0 5 5 10 10 10 6 0 11-5 11-10l-1-27a254 254 0 0 0 427-130c10-46 6-94-10-138-1-5-7-8-13-6-5 2-8 8-6 13 31 85 10 178-53 243zm0 0"/>
      </svg>
    </div>
    <p>...Locating</p>`;

  navigator.geolocation.getCurrentPosition(success, error);
}

//get weather based on search input
function searchlocation() {
  //add search form
  main.innerHTML = `
    <div>
      <form class="searchForm">
        <input type="search" class="searchInput" placeholder="Enter city name..." name="search">
        <button type="submit">🔍</button>
      </form>
    </div>
    <ul class="container"></ul>
  `;

  //add event listner to the search form
  document.querySelector('.searchForm').addEventListener('submit', searchInitiate);

  function searchInitiate(e) {
    e.preventDefault();

    const input = e.srcElement['0'].value.trim();

    //modify url
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${input}&appid=${apiKey}&units=metric`;
    //fetch data
    fetchWeather(url);
  }
}

//function fetching data from weather API
function fetchWeather(url) {
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

      //display information in the app
      main.innerHTML = `
      <label class="switch">
        <input type="checkbox">
          <span class="slider" tabindex=0 aria-label="temperarture converting button"></span>
      </label>
      <h2><span>${data.city.name}</span>, <span>${data.city.country}</span></h2>
      <h3>Today</h3>
      <h4>${forecast[0].dayOfWeek}</h4>
      <p>${forecast[0].description}</p>
      <p class="temperature C">${forecast[0].temp}&#176;C</p>
      <div class="image main">
        <img src="./images/${forecast[0].icon}.svg" alt="weather icon">
      </div>
      `;

      //add forecast
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
        img.src = `./images/${day.icon}.svg`;
        img.alt = day.description;

        weaterContainer.appendChild(container);
        container.appendChild(heading);
        container.appendChild(weatherDescription);
        container.appendChild(temp);
        container.appendChild(imageContainer);
        imageContainer.appendChild(img);
      })

      //choose unplash picture based on current weather
      unsplashUrl = `https://api.unsplash.com/search/photos?page=10&query=${data.list['0'].weather['0'].main}`;
      fetchUnsplash(unsplashUrl);

      //add event listeners to temperature toggle button
      document.querySelector('input[type=checkbox]').addEventListener('click', temperatureToggle);
      document.querySelector('.slider').addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
          temperatureToggle();
        } else {
          return;
        }
      });
    })
    .catch(() => {
      console.log("error with weather API");
      main.innerHTML = "<p>Sorry, not possible to  get data on current weather, please try again later</p>";
    });
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

//fetch background image depending on weather summary
function fetchUnsplash(unsplashUrl) {
  let background = document.getElementById('background');

  fetch(unsplashUrl, {
    headers: {
      Authorization: 'Client-ID 73848e2ce82fbdcd2e3231097715e99a0d340f66efa2984701e7b81111e13924'
    }
    })
  .then(response => response.json())
  .then(data => {
    let randomiser = Math.floor(Math.random() * 10);
    background.style.backgroundImage = `url(${data.results[randomiser].urls.regular})`;
  })
  .catch(() => console.log('An error occured from Unsplash'));
}

//Celsius to Fahrenheit and back converter
function temperatureToggle() {
  const checkbox = document.querySelector('input[type=checkbox]');
  let temperatures = document.querySelectorAll('.temperature');

  temperatures.forEach(item => {
    if (item.classList.contains('C')) {
      let oldValue = parseFloat(item.innerHTML);
      let newValue = Math.round((oldValue*1.8)+32);
      item.classList.remove('C');
      item.classList.add('F');
      item.innerHTML = `${newValue}&#176F`;
      checkbox.checked = true;
    } else if (item.classList.contains('F')) {
      let oldValue = parseFloat(item.innerHTML);
      let newValue = Math.round((oldValue-32)/1.8);
      item.classList.remove('F');
      item.classList.add('C');
      item.innerHTML = `${newValue}&#176C`;
      checkbox.checked = false;
    }
  });
}

//event listeners for buttons
locationButton.addEventListener('click', getLocation);
searchButton.addEventListener('click', searchlocation);
