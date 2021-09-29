const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const title = $('header h2');
const cd = $('.cd');
const cdthumb = $('.cd-thumb');
const player = $('.player');
const playlist = $('.playlist');
const audio = $('#audio');
const playBtn = $(".btn-toggle-play");
const repeatBtn = $(".btn-repeat");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const slideRange = $('input[type="range"]');

var app = {
    currentPlay: 0,
    loop: false,
    random: false,
    listLength: 0,
    listSongs: [],


    songs: [
        {
            "name": "Early Hours",
            "singer": "ikson",
            "path": "./assets/music/EarlyHours.mp3",
            "image": "./assets/img/EarlyHours.jpg"
        },
        {
            "name": "Do It",
            "singer": "ikson",
            "path": "./assets/music/DoIt.mp3",
            "image": "./assets/img/DoIt.jpg"
        },
        {
            "name": "Lights",
            "singer": "ikson",
            "path": "./assets/music/Lights.mp3",
            "image": "./assets/img/Lights.jpg"
        },
        {
            "name": "Fresh",
            "singer": "ikson",
            "path": "./assets/music/Fresh.mp3",
            "image": "./assets/img/Fresh.jpg"
        },
        {
            "name": "Think U Know",
            "singer": "ikson",
            "path": "./assets/music/ThinkUKnow.mp3",
            "image": "./assets/img/ThinkUKnow.jpg"
        },
        {
            "name": "Breeze",
            "singer": "ikson",
            "path": "./assets/music/Breeze.mp3",
            "image": "./assets/img/Breeze.jpg"
        },
        {
            "name": "Paradise",
            "singer": "ikson",
            "path": "./assets/music/Paradise.mp3",
            "image": "./assets/img/Paradise.jpg"
        },
        {
            "name": "Coast Line",
            "singer": "ikson",
            "path": "./assets/music/Coastline.mp3",
            "image": "./assets/img/Coastline.jpg"
        },
        {
            "name": "Sunny",
            "singer": "ikson",
            "path": "./assets/music/Sunny.mp3",
            "image": "./assets/img/Sunny.jpg"
        },
        {
            "name": "New Day",
            "singer": "ikson",
            "path": "./assets/music/NewDay.mp3",
            "image": "./assets/img/NewDay.jpg"
        },
        {
            "name": "Last Summer",
            "singer": "ikson",
            "path": "./assets/music/LastSummer.mp3",
            "image": "./assets/img/LastSummer.jpg"
        },
        {
            "name": "Blue Sky",
            "singer": "ikson",
            "path": "./assets/music/BlueSky.mp3",
            "image": "./assets/img/BlueSky.jpg"
        },
        {
            "name": "Anywhere",
            "singer": "ikson",
            "path": "./assets/music/Anywhere.mp3",
            "image": "./assets/img/Anywhere.jpg"
        }
    
    ],

    initialValue(){
        // songs
        fetch('./assets/json/db.json')
        .then(response => response.json())
        .then(data => songs = data);
        console.log(this.songs);
        this.listLength = this.songs.length;
        //
    },

    render(rendPlaylist = false){
        // tilte
        title.innerText = this.songs[this.currentPlay].name;

        // cd 
        cdthumb.style.backgroundImage = `url('${this.songs[this.currentPlay].image}')`;

        // playlist 
        if(rendPlaylist) {
            var htmls = this.songs.map(song => {return `<div class="song">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
            </div>
            <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>`
            }).join('');
            playlist.innerHTML = htmls; 
            this.listSongs = playlist.querySelectorAll('.song');
            this.listSongs[0].classList.add('active')
        }


        
        // audio
        audio.setAttribute('src', this.songs[this.currentPlay].path);

    },

    handleEvents(){
        var _this = this;

        // rotate the cd
        var cdThumbAnimate = cdthumb.animate([
            {transform: 'rotate(360deg)'}
        ],
            {
                duration: 10000,
                iterations: Infinity,
            }
        ) 
        cdThumbAnimate.pause();

        // dom space button
        $('body').onkeypress = function(e) {
            switch(e.which) {
                case 32: {
                    _this.playMusic();
                    break;
                }
                case 97: {
                    _this.previousTrack();
                    break;
                }
                case 100: {
                    _this.nextTrack();
                    break;
                }
                case 115: {
                    _this.setLoop();
                    break;
                }
                case 119: {
                    _this.setRandom();
                    break;
                }
            }
            e.preventDefault();
        }

        // play music by click button
        playBtn.onclick = function() {
            _this.playMusic();
        }

        // // change icon when player state change
        audio.onplay = function() {
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        audio.onpause = function() {
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // press previous btn
        prevBtn.onclick = function() {
            _this.previousTrack();
        }
        prevBtn.onmousedown = function() {
            this.classList.add('active');
        }
        prevBtn.onmouseup = function() {
            this.classList.remove('active');
        }


        // press next btn
        nextBtn.onclick = function() {
            _this.nextTrack();
        }
        nextBtn.onmousedown = function() {
            this.classList.add('active');
        }
        nextBtn.onmouseup = function() {
            this.classList.remove('active');
        }
        
        // set loop
        repeatBtn.onclick = function() {
            _this.setLoop();
        }
        
        // set random
        randomBtn.onclick = function() {
            _this.setRandom();
        } 

        //scroll and hide cd
        document.onscroll = function() {
            var scrollTop = document.documentElement.scrollTop;
            cd.style.width = scrollTop <= 200? (200 - scrollTop) + 'px': 0;

            cd.style.opacity = (200 - scrollTop) / 200;
        }

        // click on playlist
        this.listSongs.forEach((song, index) => {
            song.addEventListener('click',  function() {
                _this.currentPlay = index;
                _this.render();
                _this.playMusic();
            })
        });


        // change range when audio play
        audio.ontimeupdate = function() {
            slideRange.value = Math.floor(audio.currentTime / audio.duration * 10000);
            if(audio.duration - audio.currentTime < 1) {
                !_this.loop? _this.nextTrack(): "";
            }
        }

        // slide the range = khi tua
        slideRange.onchange = function() {
            audio.currentTime = this.value / 10000 * audio.duration;
        }
    },

    addActiveInstance(){
        console.log(this);
    },

    playMusic() {
        audio.paused ? audio.play(): audio.pause();
        $('.song.active').classList.remove('active');
        this.listSongs[this.currentPlay].classList.add('active');
    },

    scrollIntoView() {
        setTimeout(() => {
           if(this.currentPlay < 3) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                })
           }
           else {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
           }
        }, (300));
    },

    getRandomSongIndex() {
        var newIndex;
        do{
            newIndex = Number.parseInt(Math.random()*this.listLength);
        }
        while(this.currentPlay == newIndex);
        return newIndex;
    },

    previousTrack() {
        this.random? this.currentPlay = this.getRandomSongIndex():
        --this.currentPlay < 0 ? this.currentPlay = this.listLength - 1: '';
        this.render();
        this.playMusic();
        this.scrollIntoView();
    },

    nextTrack(){
        this.random? this.currentPlay = this.getRandomSongIndex():
        this.currentPlay = ++this.currentPlay % this.listLength;  
        this.render();
        this.playMusic();
        this.scrollIntoView();
    },

    setLoop(){
        this.loop = !this.loop;
        audio.loop = this.loop;
        this.loop? repeatBtn.classList.add('active') :
        repeatBtn.classList.remove('active');
    },

    setRandom() {
        this.random = !this.random;
        this.random? randomBtn.classList.add('active') :
        randomBtn.classList.remove('active');
    },

    start(){
        this.initialValue();
        this.render(true);
        this.handleEvents();
    }
}

app.start();
