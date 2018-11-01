const url = 'https://hackateam-cat.herokuapp.com'

let teamId, teamData, memberData
let allPossibleSkills = []

const addMemberBtn = document.getElementById('add-button')
const addSkillBtn = document.getElementById('add-skill')

document.addEventListener('DOMContentLoaded', () => {
    // local storage get team id wanted
    teamId = localStorage.getItem('edit-team-Id')

    getTeam()

    // add member functionality
    const addMemEmail = document.getElementById('addEmail')
    addMemberBtn.addEventListener('click', () => {
        email = addMemEmail.value
        // teamId = addMemberBtn.getAttribute('data-id')
        addMemberGroup(teamId, email)
        location.reload()
    })

  // get list of all possible skills and append to datalist
  axios.get(`${url}/skills`)
    .then(response => {
      allPossibleSkills = response.data.map(skillObj => skillObj.type)
      let skillsDatalist = document.getElementById('skills')
      allPossibleSkills.forEach(skill => {
        let option = document.createElement('option')
        option.setAttribute('value', skill)
        skillsDatalist.appendChild(option)
      })
    })

  addSkillBtn.addEventListener('click', () => {
    let skillInput = document.querySelector(`[list='skills']`)
    let skillAdded = { type: skillInput.value }

    if (allPossibleSkills.includes(skillAdded.type)) {
      axios.post(`${url}/skills`, { type: skillAdded.type, team_id: teamId })
        .then(response => {
          console.log(response.data)
          skillAdded.id = response.data.skillData.id
          createSkillChips(skillAdded)
        })
        .catch((err) => { console.log(err) })
    }
    else {
      allPossibleSkills.push(skillAdded.type)

      axios.post(`${url}/skills/new`, { type: skillAdded.type, team_id: teamId })
        .then(response => {
          skillAdded.id = response.data.skillData.id
          createSkillChips(skillAdded)
        })
        .catch((err) => { console.log(err) })
    }

    skillInput.value = ''
  })

  // on submit, get info out of form and update team in database
  document.getElementById('edit-team').addEventListener('submit', (ev) => {
    ev.preventDefault()

    // get form data
    let description = document.getElementById('team-des').value
    let teamSize = document.getElementById('team-size').value

    let checkBox = document.getElementById('has-idea')
    let ideaBool
    if (checkBox.classList.contains('false')) {
      ideaBool = false
    } else {
      ideaBool = true
    }

    axios.put(`${url}/teams/${teamId}`, { description, team_size_limit: teamSize, idea: ideaBool })
      .catch((err) => { console.log(err) })
  })
})

// get team requested info
let getTeam = () => {
    axios.get(`${url}/teams/${teamId}`)
    .then((response) => {
        // console.log(response.data)
        teamData = response.data.teamData
        getEvent(teamData[0].event_id)
        const description = document.getElementById('team-des')
        description.innerText = teamData[0].description
        addMemberBtn.setAttribute('data-id', teamData[0].id)
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
        // console.log(response.data)
        appendEvent(response.data)
    })
}

let addMemberGroup = (teamId, email) => {
    axios.post(`${url}/teams/${teamId}/addMember`, { email })
    .then((response) => {
        // console.log(response)
    })
}

// append event info
let appendEvent = (eventInfo) => {
    let eventInput = document.getElementById('eventName')
    eventInput.innerText = eventInfo[0].name
}

// append team info to screen
let appendMembers = (member) => {
    // create card
    let teamDiv = document.getElementById('teamDiv')
    let cardDiv = document.createElement('div')
    cardDiv.classList.add('card')
    cardDiv.setAttribute('style', 'width: 15rem;')
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

    cardDiv.appendChild(cardBody)

    let row = document.getElementById('member-row')
    row.appendChild(cardDiv)

    // add event listener to delete button
    deleteBtn.addEventListener('click', (event) => {
        let userId = event.target.getAttribute('data-id')
        let teamId = addMemberBtn.getAttribute('data-id')
        deleteMember(teamId, userId)
    })
}

let createSkillChips = (skill) => {
  // skill is an object with attributes type and id

  const chipsDiv = document.getElementById('chipsDiv')
  let chipDiv = document.createElement('div')
  chipDiv.classList.add('chip')
  chipDiv.innerText = skill.type
  chipDiv.setAttribute('id', skill.type)
  let closeSpan = document.createElement('span')
  closeSpan.classList.add('closebtn')
  closeSpan.innerHTML = '&times;'
  chipDiv.appendChild(closeSpan)
  chipsDiv.appendChild(chipDiv)

  // add event listener to delete
  closeSpan.addEventListener('click', (event) => {
    let type = document.getElementById(skill.type)
    type.parentNode.removeChild(type)

    console.log(skill)

    axios.delete(`${url}/skills/${skill.id}`, { data: { team_id: teamId } })
      .then(res => { console.log(res) })
      .catch(err => { console.log(err) })
  })
}

let deleteMember = (teamId, userId) => {
    axios.delete(`${url}/teams/${teamId}/removeMember/${userId}`)
    .then((response) => {
        location.reload()
    })
}
