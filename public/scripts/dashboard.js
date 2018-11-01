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
let fillEventInfo = () => {
    axios.get(`${url}/users/${userId}/events`)
    .then((response) => {
        console.log(response.data)
        let events = response.data
        events.forEach((event) => {
            createCard(event)
        })
    })
}

// get all teams user is associated with
let getUserTeams = () => {
    axios.get(`${url}/users/${userId}/teams`)
    .then((response) => {
        console.log(response.data)
    })
}


/******TO DO **********/
// search/filter bar to find/filter team containing skills you want/input (team member skills)
// back button to click on new event and clear team info
// need local storage set for navigating to manage-member/show page
// need local storage set for navigating to edit-team page


function createCard(event) {
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
  
    cardButton.setAttribute('data-id', event.id)
  
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

        // needs manage teammate buttons and edit button linking to other pages
        // generate teams also going to event
        // hide events
    })
  
  }

  // build your team card
  let createYourTeamCard = () => {
      
  }
  // build other teams cards