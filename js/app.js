const main = document.getElementById("app");

//get current location
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
        main.innerHTML = `
        <h2><span>${data.city.name}</span>, <span>${data.city.country}</span></h2>
        <p>${data.list['0'].weather['0'].description}</p>
        <p><span>${data.list['0'].main.temp}</span>&#176;<span id="toggle">C</span></p>
        <div class="image">
          <img src="http://openweathermap.org/img/w/${data.list['0'].weather['0'].icon}.png" alt="weather icon">
        </div>
        `;

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

getLocation();
