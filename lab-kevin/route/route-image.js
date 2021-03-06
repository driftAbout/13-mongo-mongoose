'use strict';

const Image = require('../model/image');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const debug = require('debug')('http:route-note');

module.exports = function(router) {
  debug('routes');
  router.route('/image/:_id?')
    .get((req, res) =>{
      debug(req.method, req.params._id);
      if (req.params._id){
        Image.findById(req.params._id)
          .then( img => {
            if (img) return res.status(200).json(img);
            throw new Error('ENOENT: Id not found');
          })
          .catch(err => errorHandler(err, res));
        return;
      }
      Image.find()
        .then(imgs => imgs.map(img => img._id))
        .then(img_ids => res.status(200).json(img_ids))
        .catch(err => errorHandler(err, res));
    })

    .post(bodyParser, (req, res) =>{
      debug(req.method, req.body);
      new Image(req.body).save()
        .then(img => res.status(201).json(img))
        .catch(err => errorHandler(err, res));
      return;
    })
    
    .put(bodyParser, (req, res) => {
      debug(req.method, req.body);
      Image.findByIdAndUpdate(req.params._id, req.body)
        .then(() => res.sendStatus(204))
        .catch(err => errorHandler(err, res));
    })
   
    .delete((req, res) => {
      debug(req.method, req.params);
      Image.findByIdAndRemove(req.params._id)
        .then((img) => {
          debug('delete img', img);
          return res.sendStatus(204);
        })
        .catch(err => errorHandler(err, res));
    });


  
  // router.post('/', bodyParser, (req, res) => {
  //   debug('route post');
  //   let new_note;
  //   new Note(req.body.subject, req.body.comment)
  //     .then(note => new_note = note )
  //     .then(note => storage.create('note', note))
  //     .then(() => res.status(201).json(new_note))
  //     .catch( err => errorHandler(err, res));
  // });

  // router.get('/:id', (req, res) =>{
  //   debug('route fetchone');
  //   let note_id = req.params.id;
  //   storage.fetchOne('note', note_id)
  //     .then(data => res.status(200).json(JSON.parse(data.toString())))
  //     .catch( err => errorHandler(err, res));
  // });

  // router.get('/', (req, res) =>{
  //   debug('route fetchall');
  //   storage.fetchAll('note')
  //     .then(data => data.map(val => val.split('.')[0]))
  //     .then(data => res.status(200).json(data))
  //     .catch( err => errorHandler(err, res));
  // });

  // router.put('/:id', bodyParser, (req, res) =>{
  //   debug('route update id', req.params.id);
  //   debug('route update body', req.body);
  //   storage.fetchOne('note',  req.params.id)
  //     .then(data => JSON.parse(data.toString()))
  //     .then(item => ({
  //       id: req.params.id,
  //       subject: req.body.subject || item.subject,
  //       comment: req.body.comment || item.comment,
  //     }))
  //     .then(newData => storage.update('note', req.params.id, newData))
  //     .then(() => res.status(204).end())
  //     .catch( err => errorHandler(err, res));
  // });

  // router.delete('/:id', (req, res) => {
  //   debug('delete req', req.params.id);
  //   debug('delete req.body', req.body);
  //   storage.whack('note', req.params.id)
  //     .then(() => res.sendStatus(204))
  //     .catch( err => errorHandler(err, res));
  // });

};