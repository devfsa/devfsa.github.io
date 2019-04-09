fetch('https://api.github.com/repos/devfsa/vagas/issues')
  .then(response => {
    response.json()
      .then(data => {
        const jobs = data.map(d => {
          const splitTag = /\s+(?:n[ao]|at)\s+/i;
          const tags = d.title.split(splitTag)[0].split('] ');
          const body = splitTag.test(d.title) ? d.title.split(splitTag)[1] + ' - ' : '';
          const title = tags[tags.length - 1];
          const city = tags[0].replace('[', '');
          const labels = d.labels.reduce((l, c) => l + ' - ' + c.name, '');

          return {
            url: d.html_url,
            body,
            title,
            labels: d.labels,
            city,
            description: body + city + labels
          };
        });

        const jobsHTML = jobs.slice(0, 4)
          .reduce((html, job) => {
            const { title, url, description } = job;
            return [
              html,
              '<a href="', url, '" class="card-item" target="_blank">',
              '<p class="card-item-title">', title, '</p>',
              '<p class="card-item-description">', description, '</p>',
              '</a>',
            ].join('');
          }, '');

        document.getElementById("jobs").insertAdjacentHTML('beforeend', jobsHTML);
      });
  })
  .catch(err => {
    console.log('Fetch Error:', err);
  });

fetch('https://api.github.com/repos/devfsa/meetups/issues/7/comments', { headers: { "Accept": "text" } })
  .then(response => {
    response.json()
      .then(data => {
        const reactionsFetchHeader = { "Accept": "application/vnd.github.squirrel-girl-preview+json" };

        // will wait all fetch from comments' reactions
        Promise.all(
          data.map(d => {
            const keynote = {
              url: d.url,
              html_url: d.html_url,
              user: d.user,
              body: d.body,
              title: d.body.split('\r\n')[0].replace(/\*\*/g, '')
            };

            // will transform array of data into array of promises that returns data
            return fetch(`${keynote.url}/reactions`, { headers: reactionsFetchHeader })
              .then(res => res.json())
              .then(reactions => Object.assign({}, keynote, { reactions: reactions || [] }))
              .catch(err => {
                console.log(`Error fetching reactions of ${keynote.title} // ${keynote.url}`);
                console.error(err);
                return Object.assign({}, keynote, { reactions: [] });
              });
          })
        ).then(keynotes => {
          // after fetching all comments' reactions, sort it and then slice it
          const notes = keynotes.sort((k1, k2) => k2.reactions.length - k1.reactions.length).slice(0, 4);
          const keynotesHTML = notes.reduce((html, keynote, i) => {
            const { user, html_url, body, title, reactions } = keynote;
            return [
              html,
              '<div class="card keynote-card">',
              '<div class="keynote-image">',
              '<img src="', user.avatar_url, '" class="keynote-photo" />',
              '</div>',
              '<div class="keynote-desc">',
              '<a href="', html_url, '" class="keynote-title" target="_blank">', title, '</a>',
              '<div class="keynote-info">',
              '<p class="keynote-author">@', user.login, '</p>',
              '<a href="', html_url, '" class="keynote-vote ', i === 0 ? 'voted' : '', '" target="_blank">',
              '<i class="far fa-arrow-alt-circle-up"></i>',
              '<span class="keynote-vote-number"> ', reactions.length, '</span>',
              '</a>',
              '</div>',
              '</div>',
              '</div>',
            ].join('');
          }, '');

          document.getElementById("keynotes").insertAdjacentHTML('beforeend', keynotesHTML);
        });
      });
  })
  .catch(err => {
    console.log('Fetch Error:', err);
  });
