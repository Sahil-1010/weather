
// let map;

// async function getWeather() {
//     const city = document.getElementById('city').value || 'London';
//     const apiKey = 'c86fe9a96dc544329bd164355252003';
//     const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();

//         if (data.error) {
//             document.getElementById('weather-info').innerHTML = `<p class='error'>Error: ${data.error.message}</p>`;
//             return;
//         }

//         document.getElementById('weather-container').style.display = "block";
//         document.getElementById('weather-info').innerHTML = `
//             <h3>${data.location.name}, ${data.location.country}</h3>
//             <img src="${data.current.condition.icon}" alt="Weather icon">
//             <p>${data.current.condition.text}</p>
//             <p class="temp">${data.current.temp_c}&deg;C</p>
//         `;

//         document.getElementById('time').innerHTML = `<p>Local Time: ${data.location.localtime}</p>`;

//         // Set animation and sound based on weather condition
//         setAnimationAndSound(data.current.condition.text);

//         // Show OpenStreetMap with Leaflet.js
//         const lat = data.location.lat;
//         const lon = data.location.lon;

//         if (!map) {
//             map = L.map('map').setView([lat, lon], 10);
//             L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//                 attribution: '&copy; OpenStreetMap contributors'
//             }).addTo(map);
//             L.marker([lat, lon]).addTo(map).bindPopup(`${data.location.name}, ${data.location.country}`).openPopup();
//         } else {
//             map.setView([lat, lon], 10);
//             L.marker([lat, lon]).addTo(map).bindPopup(`${data.location.name}, ${data.location.country}`).openPopup();
//         }

//     } catch (error) {
//         document.getElementById('weather-info').innerHTML = "<p class='error'>Error fetching data</p>";
//     }
// }

// function setAnimationAndSound(condition) {
//     let animationSrc = "";
//     let audioSrc = "";

//     if (condition.includes("sunny")) {
//         animationSrc = "https://lottie.host/1bea50d1-2c27-4c64-acbf-055eccf6f8d3/qnFBUscTTV.lottie";
//         audioSrc = "sunny.mp3";
//     } else if (condition.includes("rain")) {
//         animationSrc = "https://lottie.host/dfb447ff-827c-4818-a475-71414596c0f9/JQSlHjOEd0.lottie";
//         audioSrc = "rain.mp3";
//     } else if (condition.includes("thunder")) {
//         animationSrc = "https://lottie.host/ce066be1-ed70-4411-acd2-d6cd75045d0f/EBmVLT9gAi.lottie";
//         audioSrc = "thunder.mp3";
//     } else if (condition.includes("overcast")) {
//         animationSrc = "https://lottie.host/42eff85b-b8c7-4feb-b53b-5b3f7315f3d2/KJmhTrnzsC.lottie";
//         audioSrc = "overcast.mp3";
//     } else if (condition.includes("snow")) {
//         animationSrc = "https://lottie.host/f250210f-ed58-4138-aa11-7e8ba85d5807/xki7M3r2LF.lottie";
//         audioSrc = "snow.mp3";
//     } else if (condition.includes("fog")) {
//         animationSrc = "https://lottie.host/ee42ca4c-bd93-41d8-bc75-d95c82797a84/ohTGOIHIcT.lottie";
//         audioSrc = "foggy.mp3";
//     } else if (condition.includes("cyclone")) {
//         animationSrc = "https://lottie.host/df9db381-749b-4ddd-9ab6-65ad693463f1/vNYgyWmWUJ.lottie";
//         audioSrc = "cyclone.mp3";
//     }

//     document.getElementById('animation').innerHTML = `<dotlottie-player src="${animationSrc}" background="transparent" speed="1" style="width: 300px; height: 300px" loop autoplay></dotlottie-player>`;
//     document.getElementById('weather-audio').src = audioSrc;
//     document.getElementById('weather-audio').play();
// }

let map;

async function getWeather() {
    const city = document.getElementById('city').value || 'London';
    fetchWeather(city);
}

async function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeather(`${lat},${lon}`);
        }, () => {
            document.getElementById('weather-info').innerHTML = `<p class='error'>Error: Unable to retrieve location</p>`;
        });
    } else {
        document.getElementById('weather-info').innerHTML = `<p class='error'>Geolocation is not supported by your browser</p>`;
    }
}

async function fetchWeather(location) {
    const apiKey = 'c86fe9a96dc544329bd164355252003';
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            document.getElementById('weather-info').innerHTML = `<p class='error'>Error: ${data.error.message}</p>`;
            return;
        }

        document.getElementById('weather-info').innerHTML = `
            <h3>${data.location.name}, ${data.location.country}</h3>
            <img src="${data.current.condition.icon}" alt="Weather icon">
            <p>${data.current.condition.text}</p>
            <p class="temp">${data.current.temp_c}&deg;C</p>
        `;

        document.getElementById('time').innerHTML = `<p>Local Time: ${data.location.localtime}</p>`;

        setAnimationAndSound(data.current.condition.text.toLowerCase());

        updateMap(data.location.lat, data.location.lon, data.location.name);

    } catch (error) {
        document.getElementById('weather-info').innerHTML = "<p class='error'>Error fetching data</p>";
    }
}

function updateMap(lat, lon, locationName) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        L.marker([lat, lon]).addTo(map).bindPopup(locationName).openPopup();
    } else {
        map.setView([lat, lon], 10);
        L.marker([lat, lon]).addTo(map).bindPopup(locationName).openPopup();
    }
}

function setAnimationAndSound(condition) {
    let animationSrc = "";
    let audioSrc = "";

    if (condition.includes("sunny","clear","starry")) {
        animationSrc = "https://lottie.host/1bea50d1-2c27-4c64-acbf-055eccf6f8d3/qnFBUscTTV.lottie";
        audioSrc = "sunny.mp3";
    } else if (condition.includes("thunder","storm")) {
        animationSrc = "https://lottie.host/ce066be1-ed70-4411-acd2-d6cd75045d0f/EBmVLT9gAi.lottie";
        audioSrc = "thunder.mp3";
    }else if (condition.includes("rain")) {
        animationSrc = "https://lottie.host/dfb447ff-827c-4818-a475-71414596c0f9/JQSlHjOEd0.lottie";
        audioSrc = "rain.mp3"; 
    }else if (condition.includes("cloud","overcast")) {
        animationSrc = "https://lottie.host/42eff85b-b8c7-4feb-b53b-5b3f7315f3d2/KJmhTrnzsC.lottie";
        audioSrc = "overcast.mp3";
    } else if (condition.includes("snow")) {
        animationSrc = "https://lottie.host/f250210f-ed58-4138-aa11-7e8ba85d5807/xki7M3r2LF.lottie";
        audioSrc = "snow.mp3";
    } else if (condition.includes("foggy","mist","fog")) {
        animationSrc = "https://lottie.host/ee42ca4c-bd93-41d8-bc75-d95c82797a84/ohTGOIHIcT.lottie";
        audioSrc = "foggy.mp3";
    } else if (condition.includes("cyclone","tornado")) {
        animationSrc = "https://lottie.host/df9db381-749b-4ddd-9ab6-65ad693463f1/vNYgyWmWUJ.lottie";
        audioSrc = "cyclone.mp3";
    }

    // Display animation
    document.getElementById('animation').innerHTML = `<dotlottie-player src="${animationSrc}" background="transparent" speed="1" style="width: 300px; height: 300px" loop autoplay></dotlottie-player>`;

    // Play sound
    const audioElement = document.getElementById('weather-audio');
    audioElement.src = audioSrc;
    audioElement.play();
}
