async function requestLogin(e){
    e.preventDefault();
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
        }
        const r = await fetch(`https://habit-hole.herokuapp.com/auth/login`, options)
        const data = await r.json()
        if (data.err){ throw Error(data.err); }
        login(data);
    } catch (err) {
        alert("Wrong username or password"); window.location.reload(); throw Error(data.err);
    }
}

async function requestRegistration(e) {
    e.preventDefault();
    try {
        if (document.getElementById('password2').value === document.getElementById('password').value) {
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
            }
            const r = await fetch(`https://habit-hole.herokuapp.com/auth/register`, options)
            const data = await r.json()
            if (data.err){
                if(data.err == "Error creating user: value too long for type character varying(16)") {
                    alert('Username is too long')
                }
                if(data.err == `Error creating user: duplicate key value violates unique constraint "users_username_key"`) {
                    alert('Username already exists')
                }
                 window.location.reload(); throw Error(data.err);}
            requestLogin(e);
        } else {
            alert('Password Must be Matching.');
            window.location.reload();
        }

    } catch (err) {
        console.warn(err);
    }
}

function login(data){
    const payload = jwt_decode(data.token);;
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', payload.username);
    location.hash = '#profile';
}

function logout(){
    localStorage.clear();
    location.hash = '#login';
}

function currentUser(){
    const username = localStorage.getItem('username')
    return username;
}

function renderHomepage(){
    if(currentUser()){
        location.hash = '#profile';
    }
    const homepage = document.createElement('div');
    homepage.innerHTML = `<div class="p-4 p-md-5 mb-4 text-white rounded bg-dark">
    <div class="d-flex flex-row">
    <div class="col-md-6 px-0 py-2">
      <h1 class="display-4 fst-italic">Sleep better, today.</h1>
      <p class="lead my-3">From world renowned developers comes habit-hole,
      <br>
      a revolutionary sleep tracking web-app.</p>
    </div>
    <div class="col-md-6 px-0 ">
      <img class="img-responsive align-center w-100 h-100 d-none d-lg-block" src="./static/images/forest.jpg" alt="forest" />
    </div>
    </div>
  </div>
  <div class="row mb-2">
    <div class="col-md-6">
      <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
        <div class="col p-4 d-flex flex-column position-static">
          <strong class="d-inline-block mb-2 text-success">Health & Fitness</strong>
          <h3 class="mb-0">Benefits of tracking your sleep</h3>
          <div class="mb-2 text-muted mt-2">July 18</div>
          <p class="card-text mb-auto mt-2">Decreased risk of serious medical conditions.</p>
          <p class="card-text mb-auto mt-2">Improved mood.</p>
          <p class="card-text mb-auto mt-2">Better cognitive functioning.</p>
          <p class="card-text mb-auto mt-2">Improved immunity.</p>
          <p class="card-text mb-auto mt-2">Better weight control.</p>
          <p class="card-text mb-auto mt-2">Better sleep efficiency.</p>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
        <div class="col p-4 d-flex flex-column position-static">
          <strong class="d-inline-block mb-2 text-primary">Company News</strong>
          <h3 class="mb-0">habit-hole</h3>
          <div class="mb-1 text-muted mt-2">July 18</div>
          <p class="mb-auto mt-1">Habit hole is an app developed to help users track their sleep patterns, compare their own historial sleep data and improve their quality of life.</p>
          <p class="mb-auto mt-2">This application was designed and developed by 3 full-stack engineers working as part of the futureproof training programme.</p>
          <div class="d-flex bd-highlight my-2">
          <div class="p-2 flex-fill bd-highlight">
          <a href="https://github.com/uzair14" class="text-decoration-none" target="_blank">Uzair <i class="fa-brands fa-github"></i></a>
          </div>
          <div class="p-2 flex-fill bd-highlight"><a href="https://github.com/rameez-khawaja" class="text-decoration-none" target="_blank">Rameez <i class="fa-brands fa-github"></i></a></div>
          <div class="p-2 flex-fill bd-highlight"><a href="https://github.com/eheath30" class="text-decoration-none" target="_blank">Elliot <i class="fa-brands fa-github"></i></a></div>
        </div>
        </div>
      </div>
    </div>
  </div>`;
main.appendChild(homepage);
}

function renderLoginForm() {
    const fields = [
        { tag: 'input', attributes: { type: 'text', name: 'username', placeholder: 'Username', class:"form-control my-1"} },
        { tag: 'input', attributes: { type: 'password', name: 'password', placeholder: 'Password', class:"form-control my-1"} },
        { tag: 'input', attributes: { type: 'submit', value: 'Login', class:"btn btn-dark my-1"} }
    ]
    const form = document.createElement('form');
    fields.forEach(f => {
        let field = document.createElement(f.tag);
        Object.entries(f.attributes).forEach(([a, v]) => {
            field.setAttribute(a, v);
            form.appendChild(field);
        })
    })
    form.addEventListener('submit', requestLogin)

    let title = document.createElement('h3');
    title.textContent = 'Login';
    let card = document.createElement('div');
    card.appendChild(title);
     card.setAttribute('class', 'shadow-lg p-4 p-md-5 mb-4 text-white rounded bg-secondary');
     card.appendChild(form)
    main.appendChild(card);

}

function renderRegisterForm() {
    const fields = [
        { tag: 'input', attributes: { type: 'text', name: 'username', placeholder: 'Username', class:"form-control my-1" } },
        { tag: 'input', attributes: { type: 'password', name: 'password', placeholder: 'Password', class:"form-control my-1", id:"password" } },
        { tag: 'input', attributes: { type: 'password', name: 'passwordConfirmation', placeholder: 'Confirm Password', class:"form-control my-1", id:"password2" } },
        { tag: 'input', attributes: { type: 'submit', value: 'Create Account', class:"btn btn-dark my-1"} }
    ]
    const form = document.createElement('form');
    fields.forEach(f => {
        let field = document.createElement(f.tag);
        Object.entries(f.attributes).forEach(([a, v]) => {
            field.setAttribute(a, v);
            form.appendChild(field);
        })
    })
    form.addEventListener('submit', requestRegistration)
    let title = document.createElement('h3');
    title.textContent = 'Register for a free account';
    let card = document.createElement('div');
    card.appendChild(title);
     card.setAttribute('class', 'shadow-lg p-4 p-md-5 mb-4 text-white rounded bg-secondary');
     card.appendChild(form)
    main.appendChild(card);
}

async function renderFeed() {
    const feed = document.createElement('section');
    feed.id = 'feed';
    let username = localStorage.getItem('username');
    let usernameForm = { 'username': username };
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( usernameForm )
        }
        const r = await fetch(`https://habit-hole.herokuapp.com/habits/fetchUsername`, options)
        const postData = await r.json()
        Dashboard(postData, username)

    } catch (err) {
        console.warn(`Error: ${err}`);
    }
}

async function renderProfile() {
    const profile = document.createElement('section');
    const greeting = document.createElement('h3');
    let name = `${localStorage.getItem('username')}`
    const capitalisedName = name.charAt(0).toUpperCase() + name.slice(1);
    greeting.textContent = `Hi there, ${capitalisedName}!`
    greeting.setAttribute('class', 'mb-5');
    profile.appendChild(greeting);
    main.appendChild(profile);

    let username = localStorage.getItem('username');
    let usernameForm = { 'username': username };
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( usernameForm )
        }
        const r = await fetch(`https://habit-hole.herokuapp.com/habits/fetchUsername`, options)
        const postData = await r.json()
        if (postData.sleeptarget == null){
            const form = document.createElement('form')

            const howOftenText = document.createElement('h3')
            howOftenText.textContent = "How often do you want to track your sleep?"

            const howOfteninput = document.createElement('select')

            const dailyChoice = document.createElement('option')
            dailyChoice.textContent = "Daily"
            howOfteninput.setAttribute('class', 'form-select border-secondary rounded')

            howOfteninput.appendChild(dailyChoice)
            profile.appendChild(howOftenText)
            profile.appendChild(howOfteninput)

            const howManyHours = document.createElement('h3')
            howManyHours.textContent = "How many hours do you want to sleep per night?"

            const inputSleepTarget = document.createElement('input')
            inputSleepTarget.setAttribute('class', 'rounded border-secondary')
            inputSleepTarget.type = "number"
            inputSleepTarget.id = "sleeptarget"
            inputSleepTarget.placeholder = "Enter an integer between 1-16"
            inputSleepTarget.min = 1
            inputSleepTarget.max = 16

            const button = document.createElement('button')
            button.textContent = "Submit"
            button.setAttribute('class', 'btn btn-light')

            form.appendChild(howManyHours)
            form.appendChild(inputSleepTarget)
            linebreak = document.createElement("br");
            form.appendChild(linebreak);
            form.appendChild(button)
            profile.appendChild(form)
            profile.setAttribute('class', 'shadow-lg p-4 p-md-5 mb-4 text-white rounded bg-secondary');
            form.addEventListener('submit', updateSleepTarget)

        } else {
            let today = new Date();
            today.setHours( today.getHours() + 1 );
            today = today.toISOString();
            let latestIndex = postData.sleepdate.length
            let latestDate = postData.sleepdate[latestIndex-1]
            if (latestDate != undefined){latestDate = latestDate.split('T')[0]}

            if(today.split('T')[0] != latestDate){
                const form = document.createElement('form')

                const howOften = document.createElement('h3')
                howOften.textContent = "How often would you like to track you?"

                const howManyHours = document.createElement('h3')
                howManyHours.textContent = "How many hours did you sleep last night?"

                const inputSleepTarget = document.createElement('input')
                inputSleepTarget.type = "number"
                inputSleepTarget.id = "sleephour"
                inputSleepTarget.placeholder = "Enter an integer between 0-20"
                inputSleepTarget.min = 0
                inputSleepTarget.max = 20
                inputSleepTarget.setAttribute('class', 'form-control')

                const button = document.createElement('button')
                button.textContent = "Submit"
                button.setAttribute('class', 'btn btn-danger')

                form.appendChild(howManyHours)
                linebreak = document.createElement("br");
            form.appendChild(linebreak);
                form.appendChild(inputSleepTarget)
                linebreak = document.createElement("br");
            form.appendChild(linebreak);
                form.appendChild(button)
                profile.appendChild(form)
                profile.setAttribute('class', 'shadow-lg p-4 p-md-5 mb-4 text-white rounded bg-secondary');
                form.addEventListener('submit', updateSleepTime)
            } else{

                let streak = 0
                // let compare1 = new Date(postData.sleepdate[6].split('T')[0])
                // let compare2 = new Date(postData.sleepdate[5].split('T')[0])
                for (i = 0; i<postData.sleephours.length; i++){
                    if (postData.sleephours[i]>=postData.sleeptarget){
                        streak = streak + 1
                    } else if (postData.sleephours[i]<postData.sleeptarget) {
                        streak = 0
                    }
                }

                if (streak == 0) {
                    const tryHarder = document.createElement('h3')
                    tryHarder.textContent = `You should be more mindful of your sleep time.`
                    const zeroStreak = document.createElement('h3')
                    zeroStreak.textContent = `You currently have a 0 day hot-streak.`
                    const linebreak = document.createElement("br");
                    const sadFace = document.createElement('img')
                    sadFace.setAttribute('src', './static/images/sad.jpg')
                    sadFace.setAttribute('class', 'rounded-circle w-25 h-25')
                    profile.appendChild(tryHarder)
                    profile.appendChild(zeroStreak)
                    profile.appendChild(linebreak);
                    profile.appendChild(sadFace)
                    profile.setAttribute('class', 'shadow-lg p-4 p-md-5 mb-4 text-white rounded bg-danger');
                }
                else {
                    const WellDone = document.createElement('h3')
                    WellDone.textContent = `Well done, you are on a ${streak} day streak!`
                    award = document.createElement('img')
                    award.src = './static/images/example-award.png';
                    award.setAttribute('alt', 'award')
                    award.setAttribute('class', 'award')
                    profile.appendChild(WellDone)
                    profile.appendChild(award)
                    profile.setAttribute('class', 'shadow-lg p-4 p-md-5 mb-4 text-white rounded bg-success');
                }
            }
        }
    } catch (err) {
        console.warn(`Error: ${err}`);
    }
}

async function updateSleepTime(){
    let today = new Date();
    today.setHours( today.getHours() + 1 );
    today = today.toISOString();
    let username = localStorage.getItem('username');
    sleephour = document.getElementById("sleephour").value
    let usernameForm = { 'username': username, 'sleephour': sleephour, 'sleepday': today };
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( usernameForm )
        }
        const r = await fetch(`https://habit-hole.herokuapp.com/habits/updateSleepTime`, options)
        window.location.reload()
    } catch (err) {
        console.warn(`Error: ${err}`);
    }
}

async function updateSleepTarget(){
    let username = localStorage.getItem('username');
    sleeptarget = document.getElementById("sleeptarget").value
    let usernameForm = { 'username': username, 'sleeptarget': sleeptarget };
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( usernameForm )
        }
        const r = await fetch(`https://habit-hole.herokuapp.com/habits/updateSleepTarget`, options)
        window.location.reload()
    } catch (err) {
        console.warn(`Error: ${err}`);
    }

}

function Dashboard(postData, username) {
    let canvas = document.createElement('canvas');
    canvas.id = "myChart"
    canvas.setAttribute('aria-label', 'My Line Chart')
    canvas.setAttribute('role', 'canvas')
    let altText = document.createElement('span')
    altText.textContent = 'Line Chart mapping sleep data'
    canvas.appendChild(altText);

    let bootstrapdashboard = document.createElement('section')
    bootstrapdashboard.innerHTML =`
    <section class="container mx-auto">
    <div class="jumbotron p-3 p-md-5 text-white rounded">
  </div>
  </section>
  `
    bootstrapdashboard.setAttribute('class', 'shadow-lg p-4 p-md-5 mb-4 text-white rounded bg-light');
    let title = document.createElement('h2')
    let name = username
    const capitalisedName = name.charAt(0).toUpperCase() + name.slice(1);
    title.textContent = `${capitalisedName}'s historical sleep data`
    title.setAttribute('class', 'my-4')
    main.appendChild(title)
    main.appendChild(bootstrapdashboard)

    document.getElementsByClassName("jumbotron")[0].appendChild(canvas)
    const ctx = document.getElementById('myChart').getContext('2d');
    let dateArray=[]
    let sleepTargetArray=[]
        for (i = 0; i<postData.sleepdate.length; i++){
        dateArray.push(postData.sleepdate[i].split('T')[0])
            sleepTargetArray.push(postData.sleeptarget)
    }
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...dateArray],
            datasets: [{
                label: 'number of hours sleep',
                data: [...postData.sleephours,],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                tension: 0.3,
                borderWidth: 1
            },
            {
                label: 'Sleep Target',
                data: [...sleepTargetArray],

                borderColor: [
                    'green',
                ],
                tension: 0.3,
                borderWidth: 1,
                pointRadius: 0,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        }
    });
}

function render404() {
    const error = document.createElement('h2');
    error.textContent = "Oops, we can't find that page sorry!";
    main.appendChild(error);
}

async function getAllHabits(){
    try {
        const options = {
            headers: new Headers({"Authorization": localStorage.getItem('token')})
        }
        const response = await fetch('https://habit-hole.herokuapp.com/habits', options);
        const data = await response.json();
        return data;
    } catch (err) {
        console.warn(err);
    }
}

const nav = document.querySelector('nav');
const main = document.querySelector('main');

const publicRoutes = ['#', '#login', '#register'];
const privateRoutes = ['#dashboard', '#profile'];

window.addEventListener('hashchange', updateContent);

function updateNav(){
    nav.innerHTML = '';
    let links;
    let logoutBtn;
    if (currentUser()){
        links = privateRoutes.map(createNavLink);
        logoutBtn = document.createElement('a');
        logoutBtn.textContent = 'Logout';
        logoutBtn.setAttribute('class', 'nav-link text-light')
        logoutBtn.setAttribute('href', '#')
        logoutBtn.onclick = logout;
        nav.appendChild(logoutBtn);
    } else {
        links = publicRoutes.map(createNavLink);
    }
    links.forEach(l => nav.insertBefore(l, logoutBtn))
}

function updateMain(path) {
    main.innerHTML = '';
    if (path) {
        switch(path){
            case '#login':
                renderLoginForm(); break;
            case '#register':
                renderRegisterForm(); break;
            case '#dashboard':
                renderFeed(); break;
            case '#profile':
                renderProfile(); break;
            default:
                render404(); break;
        }
    } else {
        renderHomepage();
    }
}

function createNavLink(route){
    const link = document.createElement('a');
    link.setAttribute('class', 'nav-link text-light');
    link.textContent = route === '#' ? 'Home' : `${route[1].toUpperCase()}${route.substring(2)}`;
    link.href = route;
    return link;
}

function updateContent(){
    const path = window.location.hash;
    if (privateRoutes.includes(path) && !currentUser()){
        window.location.hash = '#';
    } else {
        updateNav();
        updateMain(path);
    }
}

updateContent();
