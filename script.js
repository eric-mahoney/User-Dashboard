window.onload = function() {
    let setTime = function(){
        let time = new Date();
        let hour = {
            'value': time.getHours(),
            'name': 'hour'
        };
        let minute = {
            'value': time.getMinutes(),
            'name': 'minute'
        };
        let months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November', 'December'];
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let date = {
            'day_raw': time.getDay(),
            'day': days[time.getDay()],
            'date': time.getDate(),
            'month': months[time.getMonth()],
            'tomorrow': days[time.getDay()],
            'days': days
        }
    
        if(minute.value < 10){
            minute.value = '0' + minute.value;
        }
        
        // convert to 12 hour format, add period to time
        if(hour.value >= 12){
            minute.value += "pm";
            hour.value = hour.value - 12;
            document.getElementById('welcome-message').innerHTML = 'Good afternoon!';
            if(hour.value >= 8){
                document.getElementById('welcome-message').innerHTML = 'Good night!';
            }
            if(hour.value == 0){
                hour.value = 12;
            }
        }else{
                minute.value += "am";
                document.getElementById('welcome-message').innerHTML = 'Good morning!';
            }
        document.getElementById('hour').innerHTML = hour.value;
        document.getElementById('minute').innerHTML = minute.value;
        document.getElementById('month').innerHTML = date.month;
        document.getElementById('weekday').innerHTML = date.day;
        document.getElementById('date').innerHTML = date.date;
        
        return date;

    }
    setTime();
    //let refresh_clock = window.setInterval(setTime, 60000);

    let getCat = function(){
        let key = '70ae4269-d2cf-4377-aa3b-7b2540617761';
        let api = 'https://api.thecatapi.com/v1/images/search';
        fetch(api)
            .then(function(response){
                return response.json();
            })
            .then(function(JSONresponse){
                document.getElementById('cat-gif').src = JSONresponse[0].url;
            })
    }
    getCat();
    
    let catFact = function(){
        let fact = 'https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=1';
        fetch(fact)
            .then(function(fact_response){
                return fact_response.json();
            })
            .then(function(JSONresponse){
                document.getElementById('cat-fact').innerHTML = JSONresponse.text;
            })
    }
    catFact();

    let getWeather = function(){
        let getLocation = function(){
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(position){
                    callWeather(position.coords.latitude, position.coords.longitude);
                });
            }
        }
        getLocation()
        
        let callWeather = function(latitude,longitude){
            console.log(latitude);
            console.log(longitude);
            let weather_call = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=b02825401afe8e67744e41e265592144&units=imperial`;
            fetch(weather_call)
                .then(function(weather_response){
                    return weather_response.json();
                })
                .then(function(weather_obj){
                    console.log(weather_obj);
                    let temp = weather_obj.main.temp;
                    let icon = weather_obj.weather[0].icon;
                    let description = weather_obj.weather[0].description;
                    let name = weather_obj.name;
                    let high = weather_obj.main.temp_max;
                    let low = weather_obj.main.temp_min;
                    let humidity = weather_obj.main.humidity;
                    updateWeather(icon,temp,name,high,low,humidity);
                    getForecast(latitude,longitude);
                })
        }

        let updateWeather = function(icon,temp,name,high,low,humidity){
            document.getElementById('location').innerHTML = name;
            document.getElementById('icon').src = "http://openweathermap.org/img/w/" + icon + ".png";
            document.getElementById('temperature').innerHTML = Math.floor(temp);
            document.getElementById('temp-high-value').innerHTML = Math.floor(high);
            document.getElementById('temp-low-value').innerHTML = Math.floor(low);
            document.getElementById('humidity-value').innerHTML = humidity;
        }

        function getForecast(latitude,longitude){
            let forecast_call = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=b02825401afe8e67744e41e265592144&units=imperial`;
            fetch(forecast_call)
                .then(function(forecast_response){
                    return forecast_response.json();
                })
                .then(function(forecast_obj){
                    console.log(forecast_obj)
                    for(var j = 0; j < 5; j++){
                        let forecast_container = document.createElement('div');
                        forecast_container.className = 'forecast-card';
                        
                        let day_div = document.createElement('div');
                        let temp_max_div = document.createElement('div');
                        let temp_min_div = document.createElement('div');
                        let temp_icon_div = document.createElement('div');
                        let temp_icon_pic = document.createElement('img');

                        day_div.className = "forecast-day";
                        temp_max_div.className = "forecast-max-temp";
                        temp_min_div.className = "forecast-min-temp";
                        temp_icon_div.className = "forecast-icon";
                        current_day = setTime().day_raw + j + 1;

                        // fixes index errors by resetting the current_day in the for loop back to the beginning
                        if(current_day >= 7){
                            current_day = current_day - 7;
                        }
                        console.log('the current numeric day is: ' + current_day);
                        console.log('the day from the array is: ' + setTime().days[current_day]);
                        day_div.innerHTML = setTime().days[current_day];
                        temp_max_div.innerHTML = Math.floor(forecast_obj.list[j].main.temp_max);
                        temp_min_div.innerHTML = Math.floor(forecast_obj.list[j].main.temp_min);
                        temp_icon_div.appendChild(temp_icon_pic);
                        temp_icon_pic.src = "http://openweathermap.org/img/w/" + forecast_obj.list[j].weather[0].icon + ".png";

                        forecast_container.appendChild(day_div);
                        forecast_container.appendChild(temp_icon_div);
                        forecast_container.appendChild(temp_max_div);
                        forecast_container.appendChild(temp_min_div);

                        document.getElementById('five-day-forecast').appendChild(forecast_container);
                    }
                })
        }
    }
    getWeather()
    
    let getNews = function(){

            var url = 'https://newsapi.org/v2/top-headlines?' +
            'sources=bbc-news&' +
            'apiKey=e67d4d336cc8496388d6ca911b8ea10e';
            var req = new Request(url);
            fetch(req)
                .then(function(response) {
                    return response.json();
                })
                .then(function(news_obj){
                    console.log(news_obj);
                    
                    for(var i = 0; i < 10; i++){
                        // create variables to retrieve the key information we need to populate the news-card
                        let article_title = news_obj.articles[i].title;
                        let article_description = news_obj.articles[i].description;
                        let article_url = news_obj.articles[i].url;
                        let article_image = news_obj.articles[i].urlToImage;

                        // create container class for elements
                        let new_element = document.createElement('div');
                        new_element.className = 'news-info';
                        document.getElementById('news').appendChild(new_element);

                        // create elements for the different variables
                        let news_title = document.createElement('h3');
                        let news_url = document.createElement('a');
                        let news_description = document.createElement('p');
                        let news_image = document.createElement('img');

                        // adding values to the different elements
                        news_image.className = 'news-image';
                        news_title.className = 'news-title';
                        
                        if(article_image != null){
                            news_image.src = article_image;   
                        }
                        news_description.innerHTML = article_description;
                        news_url.innerHTML = article_title;
                        news_url.href = article_url;
                        news_url.target = "_blank";

                        // append the new elements to the news class
                        new_element.appendChild(news_image);
                        news_title.appendChild(news_url);
                        new_element.appendChild(news_title);
                    }
                });
    }
    getNews();
}