document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");

  grabEventInfoAndDisplay()

});

//make the backend live and create global url to access api
let url = 'http://localhost:3000'

//grab elements from events and display them on the website
function grabEventInfoAndDisplay() {

  //get request for event information
  axios.get(`${url}/events`)
    .then((response) => {
      console.log(response)
      let events = response.data
      console.log(events);
      // target the element tage to be appended to.
      for (let i = 0; i < events.length; i++) {
        createCard(events[i])
      }
    })
    .catch((error) => {
      // handle error
      console.log(error);
    })
}

function createCard(infoObject) {
  console.log(infoObject);
  //creat all elements to make a card dynamically
  let card = document.createElement('div')
  let cardImg = document.createElement('img')
  let cardBody = document.createElement('div')
  let cardTitle = document.createElement('h5')
  let cardText = document.createElement('p')
  let cardButton = document.createElement('a')
  let cardDate = document.createElement('p')
  let cardLocation = document.createElement('p')

  //grab the bootstrap styles with classlist
  //set the event to the newly created variable
  // cardTitle.setAttribute('href')
  card.classList.add('card')
  cardImg.classList.add('card-img-top')
  cardImg.setAttribute('alt', 'Card Image Here')
  cardImg.setAttribute('src', infoObject.event_picture_url)
  cardBody.classList.add('card-body')
  cardTitle.classList.add('card-title')
  cardTitle.innerText = infoObject.name
  cardText.classList.add('card-text')

  cardButton.setAttribute('data-id', infoObject.id)

  let date = new Date(infoObject.date)
  // cardDate.innerText = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
  // cardDate.innerText = date.getMonth()
  cardDate.innerText = infoObject.date
  cardLocation.innerText = infoObject.location
  cardButton.innerText = "Find Team"
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
  cardButton.addEventListener('click', (event) => {
    localStorage.setItem('eventID', infoObject.id)
    location.href = "create-team.html";
  })

}
