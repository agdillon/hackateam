const url = 'http://localhost:3000'
let skillsToAdd = []
let allSkills
let eventId = localStorage.getItem('eventID')
document.addEventListener('DOMContentLoaded', () => {
    // *****************TO DO************************************  
    // get user id via local storage
    let userId = 1
    getEventInfo()
    // get all skills
    getAllSkills()
    // add button functionality
    const addButton = document.getElementById('add-button')
    const chipsDiv = document.getElementById('chipsDiv')
    addButton.addEventListener('click', () => {
        let skillInput = document.getElementById('skillsWanted')
        let skillAdded = document.getElementById('skillsWanted').value
        // create chip
        createChip(skillAdded, chipsDiv)
        // add value for submit
        skillsToAdd.push(skillAdded)
        skillInput.value = ''
    })
    // checkbox functionality
    let checkBox = document.getElementById('has-idea')
    checkBox.addEventListener('click', () => {
        if (checkBox.classList.contains('false')) {
            checkBox.classList.add('true')
            checkBox.classList.remove('false')
        } else {
            checkBox.classList.add('false')
            checkBox.classList.remove('true')
        }
    })
    // on submit of form post team info 
    const postForm = document.getElementById('post-form')
    postForm.addEventListener('submit', (event) => {
        event.preventDefault()
        let formElements = event.target.elements
        formElements[0].value = skillsToAdd
        // create object to send from submit
        checkBox = document.getElementById('has-idea')
        let ideaBool
        if (checkBox.classList.contains('false')) {
            ideaBool = false
        } else {
            ideaBool = true
        }
        let teamInfo = {
            "event_id": eventId,
            "has_idea": ideaBool,
            "user_id": userId
        }
        for (let i = 0; i < formElements.length; i++) {
            if (formElements[i].value) {
                teamInfo[formElements[i].name] = formElements[i].value
            }
        }
        teamInfo.team_size_limit = parseInt(teamInfo.team_size_limit)
        postTeam(teamInfo, allSkills)
        
    })

})

// Get all skills function
let getAllSkills = () => {
    axios.get(`${url}/skills`)
        .then((response) => {
            allSkills = response.data
            let skillsDatalist = document.getElementById('skills')
            response.data.forEach(skill => {
                let option = document.createElement('option')
                option.setAttribute('value', skill.type)
                skillsDatalist.appendChild(option)
            })
        })
}

// create team axios call
let postTeam = (teamInfo, allSkills) => {
    axios.post(`${url}/teams`, teamInfo)
        .then((response) => {
            let teamId = response.data.id
            // & for each skill value submited post for either association or add skill and association
            let skills = teamInfo.skillsWanted.split(',')
            skills.forEach((skill) => {
                if (allSkills.some(s => s.type === skill)) {
                    let skillData = {
                        team_id: teamId,
                        type: skill
                    }
                    axios.post(`${url}/skills`, skillData)
                        .then((res) => {
                            console.log(res, response)
                            window.location.href = `${url}/html/dashboard.html`
                        })
                    // pass in team_id and type
                } else {
                    let skillData = {
                        team_id: teamId,
                        type: skill
                    }
                    axios.post(`${url}/skills/new`, skillData)
                        .then((res) => {
                            console.log(res, response)
                            window.location.href = `${url}/html/dashboard.html`
                        })
                }
            })
        })
}

let createChip = (skillAdded, chipsDiv) => {
    let chipDiv = document.createElement('div')
    chipDiv.classList.add('chip')
    chipDiv.innerText = skillAdded
    chipDiv.setAttribute('id', skillAdded)
    chipsDiv.appendChild(chipDiv)
    let closeSpan = document.createElement('span')
    closeSpan.classList.add('closebtn')
    closeSpan.innerHTML = '&times;'
    chipDiv.appendChild(closeSpan)
    // add event listener to delete
    closeSpan.addEventListener('click', (event) => {
        let type = document.getElementById(skillAdded)
        type.parentNode.removeChild(type)
        skillsToAdd = skillsToAdd.filter((skill) => skill !== skillAdded)
    })
}

let getEventInfo = () => {
    axios.get(`${url}/events/${eventId}`)
    .then((response) => {
        let eventNameSpot = document.getElementById('eventName')
        eventNameSpot.innerText = response.data[0].name
    })
}