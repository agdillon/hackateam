const url = 'http://localhost:3000'

let teamsEventData

// code from jsperf.com
function getCookieValue(a) {
    b = '; ' + document.cookie;
    c = b.split('; ' + a + '=');
    return !!(c.length - 1) ? c.pop().split(';').shift() : '';
}

// temporary hardcoding of userId
let userId = 1
// get userId out of cookie
// let userId = JSON.parse(atob(getCookieValue('session'))).passport.user

document.addEventListener('DOMContentLoaded', () => {



    getUserTeams()
    fillEventInfo()
})

// auto fill event cards
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
let getUserTeams = () => {
    axios.get(`${url}/users/${userId}/teams`)
        .then((response) => {
            // console.log(response.data)
            teamsEventData = response.data
        })
}


/******TO DO **********/
// search/filter bar to find/filter team containing skills you want/input (team member skills)
// back button to click on new event and clear team info


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
    let eventRow = document.getElementById('event-row')

    //append the card to the row
    eventRow.appendChild(card)

    //add event listener to button on click to be passed onto another function show dynamically added event
    cardButton.addEventListener('click', (e) => {
        // on click of event card
        // show your team info on left (including skills wanted and skills of team members)
        let teamId = e.target.getAttribute('data-teamId')
        axios.get(`${url}/teams/${teamId}`)
            .then((response) => {
                createYourTeamCard(teamId, event.name)
                // hide events 
                let eventTeam = document.getElementById('otherTeamsDiv')
                eventRow.classList.add('hidden')
                eventTeam.classList.remove('hidden')

                axios.get(`${url}/teams/event/${teamId}`)
                    .then((response) => {
                        console.log(response.data)
                        let teamsByEvent = response.data
                        // filter out your team
                        teamsByEvent.forEach((team) => {
                            createOtherTeamsCards(team, event.name)
                        })
                    })
            })

        // generate teams also going to event

    })

}

// build your team card
let createYourTeamCard = (teamId, eventName) => {
    let eventNameSpot = document.getElementById('myTeamEventName')
    eventNameSpot.innerText = eventName
    let myteamInfoSpot = document.getElementById('myTeamInfo')
    // get all specific team info
    axios.get(`${url}/teams/${teamId}`)
        .then((response) => {
            // append data
            let teamInfo = response.data.teamData[0]
            let memberInfo = response.data.userData
            let skillsWantedInfo = response.data.skillsWantedData
            // create members div
            let membersDiv = document.createElement('div')
            myteamInfoSpot.appendChild(membersDiv)

            let memberHeading = document.createElement('h5')
            memberHeading.innerText = 'Members:'
            membersDiv.appendChild(memberHeading)

            let memberUl = document.createElement('ul')
            membersDiv.appendChild(memberUl)

            memberInfo.forEach((member) => {
                let memberLi = document.createElement('li')
                memberLi.innerText = `${member.first_name} ${member.last_name}`
                memberUl.appendChild(memberLi)

                let memberSkillUl = document.createElement('ul')
                memberLi.appendChild(memberSkillUl)

                member.userSkills.forEach((skill) => {
                    let skillLi = document.createElement('li')
                    skillLi.innerText = skill.type
                    memberSkillUl.appendChild(skillLi)
                })
            })
            // create skills div
            let skillsDiv = document.createElement('div')
            myteamInfoSpot.appendChild(skillsDiv)

            let skillsHeader = document.createElement('h5')
            skillsHeader.innerText = 'Skills Wanted:'
            skillsDiv.appendChild(skillsHeader)

            let skillsUl = document.createElement('ul')
            skillsDiv.appendChild(skillsUl)

            skillsWantedInfo.forEach((skill) => {
                let skillWantedLi = document.createElement('li')
                skillWantedLi.innerText = skill.type
                skillsUl.appendChild(skillWantedLi)
            })
            // create description div
            let descriptionDiv = document.createElement('div')
            myteamInfoSpot.appendChild(descriptionDiv)

            let descriptionHeader = document.createElement('h5')
            descriptionHeader.innerText = 'Description:'
            descriptionDiv.appendChild(descriptionHeader)

            let descriptionPara = document.createElement('p')
            descriptionPara.innerText = teamInfo.description
            descriptionDiv.appendChild(descriptionPara)
            // create manage button
            // put teamid in local storage then go to show-team-info.html
            let manageBtnDiv = document.createElement('div')
            myteamInfoSpot.appendChild(manageBtnDiv)

            let manageBtn = document.createElement('button')
            manageBtn.setAttribute('type', 'button')
            manageBtn.setAttribute('data-teamId', teamInfo.id)
            manageBtn.classList.add('btn')
            manageBtn.classList.add('btn-outline-secondary')
            manageBtn.innerText = 'Manage'
            manageBtnDiv.appendChild(manageBtn)
            manageBtn.addEventListener('click', (e) => {
                let teamStoreId = e.target.getAttribute('data-teamId')
                localStorage.setItem('edit-team-Id', teamStoreId)
                location.href = "show-team-info.html"
            })
        })

}
// build other teams cards
let createOtherTeamsCards = (team, eventName) => {
    let otherTeamDiv = document.getElementById('otherTeams')

    let div = document.createElement('div')
    div.classList.add('card')
    div.classList.add('border-secondary')
    otherTeamDiv.appendChild(div)

    let cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    div.appendChild(cardBody)

    let header = document.createElement('h5')
    header.classList.add('card-title')
    header.innerText = eventName
    cardBody.appendChild(header)

    let divInfo = document.createElement('div')
    divInfo.classList.add('card-text')
    cardBody.appendChild(divInfo)

    let teamInfo = team
    let memberInfo = team.members
    let skillsWantedInfo = team.skillsWanted
    // create members div
    let membersDiv = document.createElement('div')
    divInfo.appendChild(membersDiv)

    let memberHeading = document.createElement('h5')
    memberHeading.innerText = 'Members:'
    membersDiv.appendChild(memberHeading)


    let memberUl = document.createElement('ul')
    membersDiv.appendChild(memberUl)

    memberInfo.forEach((member) => {
        let memberLi = document.createElement('li')
        memberLi.innerText = `${member.first_name} ${member.last_name}`
        memberUl.appendChild(memberLi)

        let memberEmail = document.createElement('p')
        memberEmail.innerText = member.email 
        memberUl.appendChild(memberEmail)

        let memberSkillUl = document.createElement('ul')
        memberLi.appendChild(memberSkillUl)

        member.userSkills.forEach((skill) => {
            let skillLi = document.createElement('li')
            skillLi.innerText = skill.type
            memberSkillUl.appendChild(skillLi)
        })
    })
    // create skills div
    let skillsDiv = document.createElement('div')
    divInfo.appendChild(skillsDiv)

    let skillsHeader = document.createElement('h5')
    skillsHeader.innerText = 'Skills Wanted:'
    skillsDiv.appendChild(skillsHeader)

    let skillsUl = document.createElement('ul')
    skillsDiv.appendChild(skillsUl)

    skillsWantedInfo.forEach((skill) => {
        let skillWantedLi = document.createElement('li')
        skillWantedLi.innerText = skill.type
        skillsUl.appendChild(skillWantedLi)
    })
    // create description div
    let descriptionDiv = document.createElement('div')
    divInfo.appendChild(descriptionDiv)

    let descriptionHeader = document.createElement('h5')
    descriptionHeader.innerText = 'Description:'
    descriptionDiv.appendChild(descriptionHeader)

    let descriptionPara = document.createElement('p')
    descriptionPara.innerText = teamInfo.description
    descriptionDiv.appendChild(descriptionPara)
}