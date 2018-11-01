const express = require('express')
const router = express.Router()
const knex = require('../knex')
const uuidv4 = require('uuid/v4')
// READ ALL records for this table

router.get('/', (req, res, next) => {
    // if time pass on skills_wanted for a filter or filter in the route
    // return knex('teams')
    //     .then((rows) => {
    //         res.json(rows)
    //     })
    //     .catch((err) => {
    //         next(err)
    //     })
    return knex('user_team')
        .select('user_team.user_id', 'user_team.team_id', 'users.first_name', 'users.last_name', 'users.email', 'users.portfolio_url', 'users.user_picture_url')
        .join('users', 'user_team.user_id', 'users.id')
        .then((userData) => {
            knex('user_skills')
                .select('user_skills.user_id', 'skills.type')
                .join('skills', 'skills.id', 'user_skills.skill_id')
                .then((userSkillsData) => {
                    userData.forEach((user) => {
                        let skills = userSkillsData.filter((skill) => {
                            return user.user_id === skill.user_id
                        })
                        user.userSkills = skills
                    })
                    // res.json(userData)
                    return knex('teams')
                        .select('id', 'team_size_limit', 'has_idea', 'is_full', 'event_id', 'description')
                        .then((teamData) => {
                            // res.json(teamData)
                            teamData.forEach((team) => {
                                // filter userData where team_id === team.id then add to key value
                                let thisTeamsUsers = userData.filter((user) => {
                                    return team.id === user.team_id
                                })
                                team.members = thisTeamsUsers
                            })
                            return knex('skills_team_wanted')
                                .select('skills_team_wanted.team_id', 'skills.type')
                                .join('skills', 'skills.id', 'skills_team_wanted.skill_id')
                                .then((skillsWantedData) => {
                                    teamData.forEach((team) => {
                                        // filter where team_id === team.id then add to key value
                                        let thisTeamsSkills = skillsWantedData.filter((skill) => {
                                            return team.id === skill.team_id
                                        })
                                        team.skillsWanted = thisTeamsSkills
                                    })
                                    res.json(teamData)
                                })
                        })
                })
                .catch((err) => {
                    next(err)
                })
        })
        .catch((err) => {
            next(err)
        })
})
// READ ONE record for this table
// Get team info and all associated users
router.get('/:id', (req, res, next) => {
    // nest each users skills in a each member's info as an array
    // nest skills wanted for the team in a key as an array
    return knex('user_team')
        .select('user_team.user_id', 'user_team.team_id', 'users.first_name', 'users.last_name', 'users.email', 'users.portfolio_url', 'users.user_picture_url')
        .join('users', 'user_team.user_id', 'users.id')
        .where('user_team.team_id', req.params.id)
        .then((userData) => {
            knex('user_skills')
                .select('user_skills.user_id', 'skills.type')
                .join('skills', 'skills.id', 'user_skills.skill_id')
                .then((userSkillsData) => {
                    userData.forEach((user) => {
                        let skills = userSkillsData.filter((skill) => {
                            return user.user_id === skill.user_id
                        })
                        user.userSkills = skills
                    })
                    return knex('teams')
                        .select('id', 'team_size_limit', 'has_idea', 'is_full', 'event_id', 'description')
                        .where('id', req.params.id)
                        .then((teamData) => {
                            return knex('skills_team_wanted')
                                .select('skills_team_wanted.team_id', 'skills.type', 'skills.id')
                                .join('skills', 'skills.id', 'skills_team_wanted.skill_id')
                                .where('team_id', req.params.id)
                                .then((skillsWantedData) => {
                                    res.json({
                                        teamData: teamData,
                                        userData: userData,
                                        skillsWantedData: skillsWantedData
                                    })
                                })
                        })
                })
                .catch((err) => {
                    next(err)
                })
        })
        .catch((err) => {
            next(err)
        })
})
// CREATE ONE record for this table
router.post('/', (req, res, next) => {
    // add associated user team to table
    return knex('teams')
        .insert({
            "key": uuidv4(),
            "team_size_limit": req.body.team_size_limit,
            "event_id": req.body.event_id,
            "has_idea": req.body.idea,
            "is_full": req.body.is_full,
            "description": req.body.description
        })
        .returning('*')
        .then((data) => {
            res.json(data[0])
            return knex('user_team')
                .insert({
                    "key": uuidv4(),
                    "user_id": req.body.user_id,
                    "team_id": data[0].id
                })
                .returning('*')
                .then((allData) => {
                    res.json({
                        userTeam: allData[0],
                        teamData: data[0]
                    })
                }).catch((err) => {
                    next(err)
                })
        })
        .catch((err) => {
            next(err)
        })
})
// CREATE user-team association (add by email?)
router.post('/:id/addMember', (req, res, next) => {
    // recieving email
    // find user by email
    return knex('users')
        .where('email', req.body.email)
        .then((user) => {
            res.json(user)
            return knex('user_team')
                .insert({
                    "key": uuidv4(),
                    "user_id": user[0].id,
                    "team_id": req.params.id
                })
                .returning('*')
                .then((allData) => {
                    res.json(allData[0])
                }).catch((err) => {
                    next(err)
                })
        })
        .catch((err) => {
            next(err)
        })
    // create user team association
})
// Delete team member
router.delete('/:id/removeMember/:userid', (req, res, next) => {
console.log(req.params)
    return knex('user_team')
        .where({
            team_id: req.params.id,
            user_id: req.params.userid
        })
        .first()
        .then((row) => {
            if (!row) return next()
            return knex('user_team')
                .del()
                .where({
                    team_id: req.params.id,
                    user_id: req.params.userid
                })
                .then(() => {
                    res.send(`ID ${req.params.userid} Deleted`)
                })
        })
})
// UPDATE ONE record for this table
router.put('/:id', (req, res, next) => {
    return knex('teams')
        .where('id', req.params.id)
        .then((data) => {
            return knex('teams')
                .where('id', req.params.id)
                .limit(1)
                .update({
                    "team_size_limit": req.body.team_size_limit,
                    "event_id": req.body.event_id,
                    "has_idea": req.body.idea,
                    "is_full": req.body.is_full,
                    "description": req.body.description
                })
                .returning('*')
                .then((data) => {
                    res.json(data[0])
                })
        })
        .catch((err) => {
            next(err)
        })
})
// DELETE ONE record for this table
router.delete('/:id', function (req, res, next) {
    return knex('teams')
        .where('id', req.params.id)
        .first()
        .then((row) => {
            if (!row) return next()
            return knex('teams')
                .del()
                .where('id', req.params.id)
                .then(() => {
                    res.send(`ID ${req.params.id} Deleted`)
                })
        })
        .catch((err) => {
            next(err)
        })
})

// get teams by event
router.get('/event/:id', function (req, res, next) {
    // return knex('teams')
    // .where('event_id', req.params.id)
    //     .then((rows) => {
            
    //     })
    //     .catch((err) => {
    //         next(err)
    //     })
    return knex('user_team')
        .select('user_team.user_id', 'user_team.team_id', 'users.first_name', 'users.last_name', 'users.email', 'users.portfolio_url', 'users.user_picture_url')
        .join('users', 'user_team.user_id', 'users.id')
        .then((userData) => {
            knex('user_skills')
                .select('user_skills.user_id', 'skills.type')
                .join('skills', 'skills.id', 'user_skills.skill_id')
                .then((userSkillsData) => {
                    userData.forEach((user) => {
                        let skills = userSkillsData.filter((skill) => {
                            return user.user_id === skill.user_id
                        })
                        user.userSkills = skills
                    })
                    // res.json(userData)
                    return knex('teams')
                        .select('id', 'team_size_limit', 'has_idea', 'is_full', 'event_id', 'description')
                        .where('event_id', req.params.id)
                        .then((teamData) => {
                            // res.json(teamData)
                            teamData.forEach((team) => {
                                // filter userData where team_id === team.id then add to key value
                                let thisTeamsUsers = userData.filter((user) => {
                                    return team.id === user.team_id
                                })
                                team.members = thisTeamsUsers
                            })
                            return knex('skills_team_wanted')
                                .select('skills_team_wanted.team_id', 'skills.type')
                                .join('skills', 'skills.id', 'skills_team_wanted.skill_id')
                                .then((skillsWantedData) => {
                                    teamData.forEach((team) => {
                                        // filter where team_id === team.id then add to key value
                                        let thisTeamsSkills = skillsWantedData.filter((skill) => {
                                            return team.id === skill.team_id
                                        })
                                        team.skillsWanted = thisTeamsSkills
                                    })
                                    res.json(teamData)
                                })
                        })
                })
                .catch((err) => {
                    next(err)
                })
        })
        .catch((err) => {
            next(err)
        })
})

module.exports = router
