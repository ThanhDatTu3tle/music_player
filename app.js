
// call API
var songsApi = 'http://localhost:3000/songs';

// define currentIndex and object currentSong in order to get information of the current song
localStorage.setItem('index', '0');
var currentIndex = localStorage.getItem('index');;
var currentSong = {};

// define isPLaying variable
var isPlaying = false;

// call API then get the data
function getSongs(getCurrentSong, renderSongs, nextSong) {
    fetch(songsApi)
        .then(function(response) {
            return response.json();
        })
        .then(renderSongs)
        .then(getCurrentSong)
        .then(nextSong)
        .then(handleEvents)

};

// define some constant
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');

// function start
function start() {

    // Listen / handle events (DOM events)
    handleEvents();

    // Render UI
    getSongs(renderSongs);

    // Render current song
    getSongs(getCurrentSong);

    // Render next song
    getSongs(nextSong);

    // handleEvents
    getSongs(handleEvents);

};
start();

// function handle Events
function handleEvents(songs) {
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
            cdThumbAnimate.pause();
        } else {
            isPlaying = true;
            audio.play();
            player.classList.add('playing');
            cdThumbAnimate.play();
        } 
    };

    // when process of the song changing
    audio.ontimeupdate = function() {
        // audio.duration = số giây của bài hát
        // audio.currentTime = số giây hiện tại của bài hát khi bài hát đang phát
        if (audio.duration) {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = progressPercent;
        }
    }

    // handle rewind the song
    progress.onchange = function(e) {
        const seekTime = audio.duration / 100 * e.target.value;
        audio.currentTime = seekTime;
    }

    //handle cd roll/stop
    const cdThumbAnimate = cdThumb.animate([
        { transform: 'rotate(360deg)' }
    ], {
        duration: 10000, //10 giây
        interations: Infinity
    });
    cdThumbAnimate.pause(); // mới zo hong cho quay

    // handle next/prev Song
    nextBtn.onclick = function() {
        nextSong();
    }
};

// function renderUI
function renderSongs(songs) {

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
    var currentSong = songs[currentIndex];
    // console.log(currentSong);

    heading.textContent = currentSong.name;
    cdThumb.style.backgroundImage = `url('${currentSong.image}')`;
    audio.src = currentSong.path;
};

// function nextSong
function nextSong(songs) {
  
    var currentSong = songs[currentIndex];

    var songsLength = songs.length;

    console.log('Current song: ',  currentSong);
    console.log('Index: ', currentIndex)
    if (currentIndex >= songsLength) {
        currentSong = 0;
    }

    getCurrentSong(songs);

    // console.log('Current index: ', currentIndex);
};
