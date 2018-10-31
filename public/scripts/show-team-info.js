const url = 'http://localhost:3000'
let teamId
let teamData
let memberData
const addBtn = document.getElementById('add-button')
document.addEventListener('DOMContentLoaded', () => {
    // local storage get team id wanted
    teamId = 1
    //
    getTeam()

    // add member functionality
    const addMemEmail = document.getElementById('addEmail')
    addBtn.addEventListener('click', () => {
        email = addMemEmail.value
        let emailObj = {
            email: email
        }
        let teamId = addBtn.getAttribute('data-id')
        addMemberGroup(teamId, emailObj)
        location.reload()
    })
})

// get team requested info
let getTeam = () => {
    axios.get(`${url}/teams/${teamId}`)
    .then((response) => {
        console.log(response.data)
        teamData = response.data.teamData
        getEvent(teamData[0].event_id)
        const description = document.getElementById('team-des')
        description.value = teamData[0].description
        addBtn.setAttribute('data-id', teamData[0].id)
        memberData = response.data.userData
        skillsData = response.data.skillsWantedData
        skillsData.forEach((skill) => {
            createSkillChips(skill)
        })
        memberData.forEach((member) => {
            appendMembers(member)
        })
    })
}

// get event name
let getEvent = (eventId) => {
    axios.get(`${url}/events/${eventId}`)
    .then((response) => {
        console.log(response.data)
        appendEvent(response.data)
    })
}

let addMemberGroup = (teamId, email) => {
    axios.post(`${url}/teams/${teamId}/addMember`, email)
    .then((response) => {
        console.log(response)
    })
}

// append event info
let appendEvent = (eventInfo) => {
    let eventInput = document.getElementById('eventName')
    eventInput.value = eventInfo[0].name
}

// append team info to screen
let appendMembers = (member) => {
    // create card
    let teamDiv = document.getElementById('teamDiv')
    let cardDiv = document.createElement('div')
    cardDiv.classList.add('card')
    cardDiv.setAttribute('style', 'width: 18rem;')
    teamDiv.appendChild(cardDiv)
    //create image
    let userImg = document.createElement('img')
    userImg.classList.add('card-img-top')
    userImg.setAttribute('src', member.user_picture_url)
    cardDiv.appendChild(userImg)
    // create card body
    let cardBody =  document.createElement('div')
    cardBody.classList.add('card-body')
    cardDiv.appendChild(cardBody)
    //create name title
    let nameSpot = document.createElement('h4')
    nameSpot.innerText = `${member.first_name} ${member.last_name}`
    cardBody.appendChild(nameSpot)
    // create list of skill
    let ulList = document.createElement('ul')
    ulList.classList.add('card-text')
    cardBody.appendChild(ulList)
    let skillList = member.userSkills
    skillList.forEach(skill => {
        let li = document.createElement('li')
        li.innerText = skill.type
        ulList.appendChild(li)
    })
    // create delete button
    let deleteBtn = document.createElement('button')
    deleteBtn.setAttribute('type', 'button')
    deleteBtn.classList.add('btn')
    deleteBtn.classList.add('btn-danger')
    deleteBtn.setAttribute('data-id', member.user_id)
    deleteBtn.innerText = 'Remove Member'
    cardBody.appendChild(deleteBtn)
    // add event listener to delete button
    deleteBtn.addEventListener('click', (event) => {
        let userId = event.target.getAttribute('data-id')
        let teamId = addBtn.getAttribute('data-id')
        deleteMember(teamId, userId)
    })
}

let createSkillChips = (skill) => {
    const chipsDiv = document.getElementById('chipsDiv')
    let chipDiv = document.createElement('div')
    chipDiv.classList.add('chip')
    chipDiv.innerText = skill.type
    chipDiv.setAttribute('id', skill.type)
    chipsDiv.appendChild(chipDiv)
}

let deleteMember = (teamId, userId) => {
    axios.delete(`${url}/teams/${teamId}/removeMember/${userId}`)
    .then((response) => {
        location.reload()
    })
}
