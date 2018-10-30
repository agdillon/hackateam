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
router.post('/new', (req, res, next) => {
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
  // post to user_skills association table
  router.post('/', (req, res, next) => {
      // get skill by type
      knex('skills')
      .where('type', req.body.type)
      .then((skillData) => {
        if(req.body.team_id) {
            knex('skills_team_wanted')
            .insert({
                "key": uuidv4(),
                "skill_id": skillData[0].id,
                "team_id": req.body.team_id
            })
            .returning('*')
            .then((associationData) => {
                res.json({
                    skillData: skillData[0],
                    associationData: associationData[0]
                })
            }).catch((err) => {
                next(err)
            })
        } else if(req.body.user_id) {
            knex('user_skills')
            .insert({
                "key": uuidv4(),
                "skill_id": skillData[0].id,
                "user_id": req.body.user_id
            })
            .returning('*')
            .then((associationData) => {
                res.json({
                    skillsData: skillData[0],
                    associationData: associationData[0]
                })
            }).catch((err) => {
                next(err)
            })
        }
      })
  })
  // delete from association table
module.exports = router