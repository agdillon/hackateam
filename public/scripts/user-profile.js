const url = 'https://hackateam-cat.herokuapp.com'

// temporarily hardcoding a user id of 1
const id = 1

let allPossibleSkills = []

function getFormData() {
  let formData = {}

  formData.first_name = document.getElementById('inputFirstName').value
  formData.last_name = document.getElementById('inputLastName').value
  formData.portfolio_url = document.getElementById('inputURL').value

  return formData
}

function submitHandler(ev) {
  ev.preventDefault()

  axios.put(`${url}/users/${id}`, getFormData())
    .then(() => { window.location.href = `https://hackateam-cat.herokuapp.com/html/dashboard.html` })
    .catch((err) => { console.log(err) })
}

function createChip(skillAdded) {
  // skillAdded is an object with attributes type and id

  let chipDiv = document.createElement('div')
  chipDiv.classList.add('chip')
  chipDiv.innerText = skillAdded.type
  chipDiv.setAttribute('id', skillAdded.type)
  let closeSpan = document.createElement('span')
  closeSpan.classList.add('closebtn')
  closeSpan.innerHTML = '&times;'
  chipDiv.appendChild(closeSpan)
  chipsDiv.appendChild(chipDiv)

  // add event listener to delete
  closeSpan.addEventListener('click', (event) => {
    let type = document.getElementById(skillAdded.type)
    type.parentNode.removeChild(type)

    axios.delete(`${url}/skills/${skillAdded.id}`, { data: { user_id: id } })
      .catch(err => { console.log(err) })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('add-button')
  const chipsDiv = document.getElementById('chipsDiv')

  let mycookie = document.cookie
  console.log('cookie', mycookie)

  // get existing user info from database and fill in form
  axios.get(`${url}/users/${id}`)
    .then(response => {
      let user = response.data

      // populate form with current user data
      document.getElementById('inputFirstName').value = user.first_name
      document.getElementById('inputLastName').value = user.last_name
      document.getElementById('inputURL').value = user.portfolio_url
      document.getElementById('inputEmail').value = user.email
    })
    .catch((err) => { console.log(err) })

  // get all current skills for user and make chips for them
  axios.get(`${url}/users/${id}/skills`)
    .then(response => {
      response.data.forEach(skill => { createChip(skill) })
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

  addButton.addEventListener('click', () => {
    let skillInput = document.querySelector(`[list='skills']`)
    let skillAdded = { type: skillInput.value }

    if (allPossibleSkills.includes(skillAdded.type)) {
      axios.post(`${url}/skills`, { type: skillAdded.type, user_id: id })
        .then(response => {
          skillAdded.id = response.data.skillsData.id
          createChip(skillAdded)
        })
        .catch((err) => { console.log(err) })
    }
    else {
      allPossibleSkills.push(skillAdded.type)

      axios.post(`${url}/skills/new`, { type: skillAdded.type, user_id: id })
        .then(response => {
          skillAdded.id = response.data.skillsData.id
          createChip(skillAdded)
        })
        .catch((err) => { console.log(err) })
    }

    skillInput.value = ''
  })

  // on submit, get info out of form and update user in database
  document.getElementById('editProfileForm').addEventListener('submit', submitHandler)
})
