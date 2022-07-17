
// call API
var songsApi = 'http://localhost:3000/songs';

// define currentIndex and object currentSong in order to get information of the current song
var currentIndex = 0;
var currentSong = {};

// define isPLaying variable
var isPlaying = false;

// define isRandom variable
var isRandom = false;

// call API then get the data
function getSongs(
    getCurrentSong, 
    renderSongs, 
    nextSong, 
    handleNextSong, 
    prevSong, 
    handlePrevSong, 
    playRandomSong, 
) {
    fetch(songsApi)
        .then(function(response) {
            return response.json();
        })
        .then(renderSongs)
        .then(getCurrentSong)
        .then(nextSong)
        .then(handleNextSong)
        .then(prevSong)
        .then(handlePrevSong)
        .then(playRandomSong)
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
const randomBtn = $('.btn-random');

// function start
function start() {

    // Render UI
    getSongs(renderSongs);

    // Render current song
    getSongs(getCurrentSong);

    // handle NextSong
    getSongs(handleNextSong);

    // Render next song
    getSongs(nextSong);

    // handle PrevSong
    getSongs(handlePrevSong);

    // Render prev song
    getSongs(prevSong);

    // Render random song
    getSongs(playRandomSong);

    // handle random song
    handlePlayRandomSong();

    // Listen / handle events (DOM events)
    handleEvents();
};
start();

//handle cd roll/stop
const cdThumbAnimate = cdThumb.animate([
    { transform: 'rotate(360deg)' }
], {
    duration: 10000, //10 giây
    iterations: 1 / 0
});
cdThumbAnimate.pause(); // mới zo hong cho quay

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
    heading.textContent = currentSong.name;
    cdThumb.style.backgroundImage = `url('${currentSong.image}')`;
    audio.src = currentSong.path;
};

// function handleNextSong
function handleNextSong(songs) {
    nextBtn.onclick = function() {
        if (isRandom) {
            playRandomSong(songs);
            if (isPlaying) {
                audio.play()
            }
        } else {
            nextSong(songs);
            if (isPlaying) {
                audio.play()
            }
        }
    }
};

// function handlePrevSong
function handlePrevSong(songs) {
    prevBtn.onclick = function() {
        if (isRandom) {
            playRandomSong(songs);
            if (isPlaying) {
                audio.play()
            }
        } else {
            prevSong(songs);
            if (isPlaying) {
                audio.play()
            }
        }
    }
};

// function handlePLayRandomSong
function handlePlayRandomSong() {
    randomBtn.onclick = function() {
        isRandom = !isRandom;
        randomBtn.classList.toggle('active', isRandom);
    };
};

// function nextSong
function nextSong(songs) {
    var keys = Object.keys(songs);
    currentIndex++;

    if (currentIndex >= keys.length) {
        currentIndex = 0;
    }

    getCurrentSong(songs);
};

// function prevSong
function prevSong(songs) {

    var keys = Object.keys(songs);
    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = keys.length - 1;
    }

    getCurrentSong(songs);
};

// function playRandomSong
function playRandomSong(songs) {
    var keys = Object.keys(songs);
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * keys.length);
    } while (newIndex === currentIndex)
    currentIndex = newIndex;
    getCurrentSong(songs);
};
