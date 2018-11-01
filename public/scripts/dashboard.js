const url = 'http://localhost:3000'

/*******TO DO*******/
// get user id from cookie/local storage
let userId = 1

document.addEventListener('DOMContentLoaded', () => {
    
    

    getUserTeams()
    fillEventInfo()
})

// auto fill event cards
// needs edit to fill only events associated with teams user is on
let teamsEventData
let fillEventInfo = () => {
    axios.get(`${url}/users/${userId}/events`)
    .then((response) => {
        console.log(response.data)
        console.log(teamsEventData)
        let events = response.data
        events.forEach((event) => {
            let team = teamsEventData.find((team) => {
                return team.event_id === event.id
            })
            createCard(event, team)
        })
    })
}

// get all teams user is associated with
let getUserTeams = (eventId) => {
    axios.get(`${url}/users/${userId}/teams`)
    .then((response) => {
        // console.log(response.data)
        teamsEventData = response.data
    })
}


/******TO DO **********/
// search/filter bar to find/filter team containing skills you want/input (team member skills)
// back button to click on new event and clear team info
// need local storage set for navigating to manage-member/show page
// need local storage set for navigating to edit-team page


function createCard(event, team) {
    //creat all elements to make a card dynamically
    let card = document.createElement('div')
    let cardImg = document.createElement('img')
    let cardBody = document.createElement('div')
    let cardTitle = document.createElement('h5')
    let cardText = document.createElement('p')
    let cardButton = document.createElement('button')
    let cardDate = document.createElement('p')
    let cardLocation = document.createElement('p')
  
    //grab the bootstrap styles with classlist
    //set the event to the newly created variable
    card.classList.add('card')
    cardImg.classList.add('card-img-top')
    cardImg.setAttribute('alt', 'Card Image Here')
    cardImg.setAttribute('src', event.event_picture_url)
    cardBody.classList.add('card-body')
    cardTitle.classList.add('card-title')
    cardTitle.innerText = event.name
    cardText.classList.add('card-text')
  
    cardButton.setAttribute('data-eventId', event.id)
    cardButton.setAttribute('data-teamId', team.id)
  
    let date = event.date.split('T')
    cardDate.innerText = date[0]
    cardLocation.innerText = event.location
    cardButton.innerText = "Look for Teams"
    cardButton.classList.add('btn')
    cardButton.classList.add('btn-primary')
    // append all data to the card contents
    cardText.appendChild(cardDate)
    cardText.appendChild(cardLocation)
    cardBody.appendChild(cardTitle)
    cardBody.appendChild(cardText)
    cardBody.appendChild(cardButton)
    card.appendChild(cardImg)
    card.appendChild(cardBody)
  
    //get the card to append properly in each row
    let row = document.getElementById('event-row')
  
    //append the card to thew row
    row.appendChild(card)
  
    //add event listener to button on click to be passed onto another function show dynamically added event
    cardButton.addEventListener('click', (e) => {
    //   localStorage.setItem('event-search-id', event.id)
      /*********TO DO ************/
        // on click of event card
        // show your team info on left (including skills wanted and skills of team members)
        let teamId = e.target.getAttribute('data-teamId')
        axios.get(`${url}/teams/${teamId}`)
        .then((response) => {
            console.log(response.data)
        })
        // needs manage teammate buttons and edit button linking to other pages
        // generate teams also going to event
        // hide events
    })
  
  }

  // build your team card
  let createYourTeamCard = (teamInfo, eventName) => {
      let eventNameSpot = document.getElementById('myTeamEventName')
      eventNameSpot.innerText = eventName
      let teamInfoSpot = document.getElementById('myTeamInfo')
      teamInfoSpot
  }
  // build other teams cards
  let createOtherTeamsCards = () => {
      let otherTeamDiv = document.getElementById('otherTeams')
  }
//   <div class="card border-secondary">
//                 <div class="card-body">
//                   <h5 class="card-title">Card title</h5>
//                   <p class="card-text">This is another card with title and supporting text below. This card has some
//                     additional content to make it slightly taller overall.</p>
//                 </div>
//               </div>