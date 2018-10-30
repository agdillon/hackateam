const express = require('express')
const router = express.Router()
const knex = require('../knex')
const uuidv4 = require('uuid/v4')
// READ ALL records for this table
router.get('/', (req, res, next) => {
    return knex('skills')
      .then((rows) => {
        res.json(rows)
      })
      .catch((err) => {
        next(err)
      })
  })
// READ ONE record for this table
router.get('/:id', (req, res, next) => {
    knex('skills')
      .where('id',req.params.id)
      .then((rows) => {
        res.json(rows)
      })
      .catch((err) => {
        next(err)
      })
  })
// CREATE ONE record for this table
router.post('/', (req, res, next) => {
    // add skill to data base
    // add skill association to skills wanted or skills user
    return knex('skills')
      .insert({
        "key": uuidv4(),
        "type": req.body.type
      })
      .returning('*')
      .then((data) => {
        if(req.body.team_id) {
            knex('skills_team_wanted')
            .insert({
                "key": uuidv4(),
                "skill_id": data[0].id,
                "team_id": req.body.team_id
            })
            .returning('*')
            .then((skillData) => {
                res.json({
                    skillsData: data[0],
                    skillAssociation: skillData[0]
                })
            }).catch((err) => {
                next(err)
            })
        } else if(req.body.user_id) {
            knex('user_skills')
            .insert({
                "key": uuidv4(),
                "skill_id": data[0].id,
                "user_id": req.body.user_id
            })
            .returning('*')
            .then((skillData) => {
                res.json({
                    skillsData: data[0],
                    skillAssociation: skillData[0]
                })
            }).catch((err) => {
                next(err)
            })
        }
      })
      .catch((err) => {
        next(err)
      })
  })
module.exports = router