const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex) {
  console.log('dropping all tables...')
  return knex.migrate.rollback()
    .then(() => {
      console.log('seeding all tables...')
      return knex.migrate.latest()
    })
    .then (() => {
      const topicsInsertions = knex('topics').insert(topicData);
      const usersInsertions = knex('users').insert(userData);

      return Promise.all([topicsInsertions, usersInsertions])
  })
  .then(() => {
    const formattedDates = formatDates(articleData);
    return knex('articles')
      .insert(formattedDates)
      .returning('*')
  })
  .then(articleRows => {
    const articleRef = makeRefObj(articleRows);
    const formattedComments = formatComments(commentData, articleRef);
    return knex('comments').insert(formattedComments);
  });
};
