
// call API
var songsApi = 'http://localhost:3000/songs';

// define currentIndex and object currentSong in order to get information of the current song
var currentIndex = 0;
var currentSong = {};

// define isPLaying variable
var isPlaying = false;

// call API then get the data
function getSongs(renderSongs, getCurrentSong) {
    fetch(songsApi)
        .then(function(response) {
            return response.json();
        })
        .then(renderSongs, getCurrentSong)

};

// define some constant
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');

// function start
function start() {

    // Listen / handle events (DOM events)
    handleEvents();

    // Load information of the first song 
    // loadCurrentSong();

    // Render UI
    getSongs(renderSongs);

    // Render current song
    getSongs(getCurrentSong);
};

start();

// function handle Events
function handleEvents() {
    const cd = $('.cd');
    const cdWidth = cd.offsetWidth;

    // handle scroll cd
    document.onscroll = function() { 
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        const newCdWidth = cdWidth - scrollTop;

        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth / cdWidth;
    };

    // handle click play button
    playBtn.onclick = function() {
        console.log(isPlaying);
        if (isPlaying) {
            isPlaying = false;
            audio.pause();
            player.classList.remove('playing');
        } else {
            isPlaying = true;
            audio.play();
            player.classList.add('playing');
        } 
    };
};

// function loadCurrentSong
// function loadCurrentSong(songs) {
//     const heading = $('header h2');
//     const cdThumb = $('.cd-thumb');
//     const audio = $('#audio');

//     heading.textContent = this.currentSong.name;
//     // cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
//     // audio.src = this.currentSong.path;

//     console.log(heading, cdThumb, audio);
// };

// function renderUI
function renderSongs(songs) {
    const $ = document.querySelector.bind(document);

    const htmls = songs.map(song => {
        return `
            <div class="song">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `
    })

    $('.playlist').innerHTML = htmls.join('');
};

// function getCurrentSong
function getCurrentSong(songs) {
    var currentSong = songs[this.currentIndex];

    // console.log(currentSong);

    heading.textContent = currentSong.name;
    // cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    // audio.src = this.currentSong.path;

    console.log(heading, cdThumb, audio);
    
    return currentSong;
};
