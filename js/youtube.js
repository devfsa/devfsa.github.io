const youtubeDataApiURL = 'https://www.googleapis.com/youtube/v3/search';
const youtubeKey = 'AIzaSyCaMCzli7qY23GVcwG_XUiEbdHMQxZL5jA';
const youtubeChannelId = 'UC1E4DKVVg1Fnpjidi4XQfaw';

const youtubeQueryURL = `${youtubeDataApiURL}?key=${youtubeKey}&channelId=${youtubeChannelId}&part=snippet,id&order=date`;

fetch(youtubeQueryURL)
  .then(response => {
    response.json()
      .then(data => {
        console.log(data);

        const html = data['items'].map(d =>
        `
          <div>
            <img src="${d['snippet']['thumbnails']['high']['url']}" />
            <h3>${d['snippet']['title']}</h3>
          </div>
        `
        ).join('');

        document.getElementById('youtube-videos').insertAdjacentHTML('beforeend', html);
    });
  })
  .catch(function (err) {
    console.log('Fetch Error:', err);
  });

