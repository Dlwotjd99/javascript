const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

const savedTodoList = JSON.parse(localStorage.getItem("saved-items"));
const savedWeatherData = JSON.parse(localStorage.getItem('saved-weather'));

const createTodo = function (storageData) {
  let todoContents = todoInput.value;
  if (storageData) {
    todoContents = storageData.contents;
  }

  const newLi = document.createElement("li");
  const newSpan = document.createElement("span");
  const newBtn = document.createElement("button");

  //클릭시 취소선
  newBtn.addEventListener("click", () => {
    newLi.classList.toggle("complete");
    saveItemsFn();
  });

  //더블 클릭시 삭제
  newLi.addEventListener("dblclick", () => {
    newLi.remove();
    saveItemsFn();
  });

  //새로고침해도 취소선 유지
  if (storageData?.complete === true) {
    newLi.classList.add("complete");
  }

  newSpan.textContent = todoContents;
  newLi.appendChild(newBtn);
  newLi.appendChild(newSpan);
  todoList.appendChild(newLi);
  todoInput.value = "";
  saveItemsFn();
};

const keyCodeCheck = function () {
  if (window.event.keyCode === 13 && todoInput.value.trim() !== "") {
    createTodo();
  }
};

const deleteAll = function () {
  const liList = document.querySelectorAll("li");
  for (let i = 0; i < liList.length; i++) {
    liList[i].remove();
  }
  saveItemsFn();
};

const saveItemsFn = function () {
  const saveItems = [];

  // console.log(todoList.children[0].querySelector("span").textContent);
  for (let i = 0; i < todoList.children.length; i++) {
    const todoObj = {
      contents: todoList.children[i].querySelector("span").textContent,
      complete: todoList.children[i].classList.contains("complete"),
    };
    saveItems.push(todoObj);
  }

  saveItems.length === 0
    ? localStorage.removeItem("saved-items")
    : localStorage.setItem("saved-items", JSON.stringify(saveItems));
};

if (savedTodoList) {
  for (let i = 0; i < savedTodoList.length; i++) {
    createTodo(savedTodoList[i]);
  }
}

const weatherDataActive = function({ location, weather }){
	const weatherMainList = [
		'Clear',
		'Clouds',
		'Drizzle',
		'Rain',
		'Snow',
		'Thunderstorm',
	];
	weather = weatherMainList.includes(weather) ? weather : 'Fog';
	const locationNameTag = document.querySelector('#location-name-tag');

	locationNameTag.textContent = location;
	document.body.style.backgroundImage = `url('./images/${weather}.jpg')`

	if (!savedWeatherData || savedWeatherData.location !== location || savedWeatherData.weather !== weather) {
		localStorage.setItem('saved-weather', JSON.stringify({location, weather}));
	}
}

const weatherSearch = function({ latitude, longitude }){
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=1361f8ae7363d2764b712ef4a6e39731`)
  .then((res) => {
    return res.json();
  })
  .then((json) => {
		const weatherData = {
			location: json.name,
			weather: json.weather[0].main,
		};
		weatherDataActive(weatherData);
  })
  .catch((err)=>{
    console.log(err);
  });
};

const accessToGeo = function({ coords }){
	const { latitude, longitude} = coords;
  const positionObj = {
    latitude,
    longitude
  };
  weatherSearch(positionObj);
};

const askForLocation = function(){
  navigator.geolocation.getCurrentPosition(accessToGeo, (err)=>{
		console.log(err);
    alert('위치정보를 허용해 주세요.');
  });
};

askForLocation();
if (savedWeatherData) {
	weatherDataActive(savedWeatherData)
};
