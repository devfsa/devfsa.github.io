const youtubeDataApiURL = 'https://www.googleapis.com/youtube/v3/search';
const youtubeKey = 'AIzaSyCaMCzli7qY23GVcwG_XUiEbdHMQxZL5jA';
const youtubeChannelId = 'UC1E4DKVVg1Fnpjidi4XQfaw';

const youtubeQueryURL = `${youtubeDataApiURL}?key=${youtubeKey}&channelId=${youtubeChannelId}&part=snippet,id&order=date`;

fetch(youtubeQueryURL)
  .then(response => {
    response.json()
      .then(data => {
        const html = data['items'].slice(0, 3)
          .map(d => `
            <div class="video-container">
              <img src="https://img.youtube.com/vi/${d['id']['videoId']}/maxresdefault.jpg" />
              <p>${d['snippet']['title']}</p>
            </div>
          `)
          .join('');

        document.getElementById('youtube-video-gallery').insertAdjacentHTML('beforeend', html);
      });
  })
  .catch(function (err) {
    console.log('Fetch Error:', err);
  });

