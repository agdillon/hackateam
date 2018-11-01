const express = require('express')
const router = express.Router()
const knex = require('../knex')
// READ ALL records for this table
router.get('/', (req, res, next) => {
    knex('events')
      .then((rows) => {
        res.json(rows)
      })
      .catch((err) => {
        next(err)
      })
  })
// READ ONE record for this table
router.get('/:id', (req, res, next) => {
    knex('events')
      .where('id',req.params.id)
      .then((rows) => {
        res.json(rows)
      })
      .catch((err) => {
        next(err)
      })
  })


module.exports = router