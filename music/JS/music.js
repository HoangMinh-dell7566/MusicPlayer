/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Plays / Pause / seek
 * 4.CD rotate
 * 5. Next / Prev
 * 6. Random
 * 7.Next / repeat when ended
 * 8.Active song 
 * 9.Scroll Active song into view
 * 10. Play song when click
*/
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const playlist = $('.playlist')
const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
var count = 0
var arrayTemp = []

console.log(nextBtn)

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {

    },

    songs: [
        {
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng MTP',
            path: '../media/Muon Roi Ma Sao Con - Son Tung M-TP.mp3',
            image: '../image/muonroiiiii.jpg',
        },
        {
            name: 'Có chắc yêu là đây',
            singer: 'SƠN TÙNG MTP',
            path: '../media/y2mate.com - SƠN TÙNG MTP  CÓ CHẮC YÊU LÀ ĐÂY  OFFICIAL MUSIC VIDEO.mp3',
            image: '../image/cochac.jpg',
        },
        {
            name: 'Một năm mới bình an',
            singer: 'SƠN TÙNG MTP',
            path: '../media/y2mate.com - VIRAL CLIP  MỘT NĂM MỚI BÌNH AN  SƠN TÙNG MTP.mp3',
            image: '../image/nammoi.jpg',
        },
        {
            name: 'Phố đã lên đèn',
            singer: 'Huyền Tâm Môn',
            path: '../media/Pho Da Len Den Cukak Remix_ - Huyen Tam.mp3',
            image: '../image/pholenden.jpg',
        },
        {
            name: 'Ghé Qua',
            singer: 'Dick, Tofu, PC',
            path: '../media/Ghe Qua - Dick_ Tofu_ PC.mp3',
            image: '../image/Ghequa.jpg',
        },
        {
            name: 'Stay',
            singer: 'Justin Bieber, The Kid LAROI',
            path: '../media/Stay - The Kid LAROI_ Justin Bieber.mp3',
            image: '../image/stay.jpg',
        },
        {
            name: 'Người Em Cố Đô',
            singer: 'Rum ft Đaa',
            path: '../media/y2mate.com - Người Em Cố Đô  Rum ft ĐaaCukak Remix Audio Lyrics.mp3',
            image: '../image/nguoiemcodo.jpg',
        },
        {
            name: 'Trò Đùa',
            singer: ' Quang Đăng Trần',
            path: '../media/y2mate.com - Trò Đùa  Quang Đăng Trần Cukak Remix  Audio Lyrics.mp3',
            image: '../image/trodua.jpg',
        },
        {
            name: 'Xích Link',
            singer: 'Nam Kha Nhat Mong',
            path: '../media/Xich Linh Remix_ - Nam Kha Nhat Mong.mp3',
            image: '../image/xichlink.jpg',
        },
        {
            name: 'Sao em vô tình',
            singer: 'rẻ Jack',
            path: '../media/SAO EM VO TINH - JACK x K-ICM ft_ LIAM.mp3',
            image: '../image/Saoemvotinh.jpg',
        },
        {
            name: 'Tie Me Down',
            singer: 'Gryffin',
            path: '../media/y2mate.com - Gryffin  Tie Me Down Slowed Tiktok Lyrics ft Elley Duhé  Hold me up tie me down Tiktok Song.mp3',
            image: '../image/Tiemedown.jpg',
        },
        {
            name: 'Childhood Dreams',
            singer: 'Seraphine',
            path: '../media/Childhood Dreams - Seraphine_ Jasmine Cl.mp3',
            image: '../image/child.jpg',
        },
        {
            name: 'Unstoppable',
            singer: 'Sia',
            path: '../media/y2mate.com - Sia  Unstoppable Lyrics.mp3',
            image: '../image/unstop.jpg',
        },
        {
            name: 'SOMETHING JUST LIKE THIS',
            singer: 'The Chainsmokers',
            path: '../media/y2mate.com - SOMETHING JUST LIKE THIS Megamix  Kygo Coldplay Clean Bandit The Chainsmokers Alessia Cara.mp3',
            image: '../image/Something_Just_Like_This.png',
        },
        {
            name: 'Tình Yêu Ngủ Quên',
            singer: ' Hoàng Tôn ft LyHan',
            path: '../media/y2mate.com - Tình Yêu Ngủ Quên  Hoàng Tôn ft LyHanCukak Remix Audio Lyrics Video.mp3',
            image: '../image/tinhyeunguquen.jpg',
        },
        {
            name: 'Thức giấc',
            singer: 'Da LAB',
            path: '../media/Thuc Giac Cukak Remix_ - Da LAB_ Cukak.mp3',
            image: '../image/thucgiac.jpg',
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
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
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const cdWidth = cd.offsetWidth
        const _this = this

        // xử lý CD rotate / pause
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // quay trong 10s
            iterations: Infinity // lặp lại vô hạn 
        })
        cdThumbAnimate.pause()

        // xử lý phóng to thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // xử lý khi click playl
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        // khi song đc play 
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // khi song đc play 
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                // làm tròn dưới
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // xử lý khi tua song 
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
            audio.play()
        }
        //  khi next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()

            }
            // sau khi bấm next thì sẽ play bài tiếp theo
            audio.play()
            _this.scrollToActiveSong()
        }

        // khi prev bài hát
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()

            }
            // sau khi bấm next thì sẽ play bài tiếp theo
            _this.scrollToActiveSong()
            audio.play()
        }

        // khi bấm random bài hát xử lý Random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // xử lý lặp lại 1 song 
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                // nếu có repeat thì audio sẽ play lặp lại
                audio.play()
            } else {
                nextBtn.click();
            }
        }

        // xử lý lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                // xử lý khi click vào song
                if (songNode) {
                    // dataset sẽ lấy từ data-index
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // xử lí khi click vào option
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            if(this.currentIndex <=3 ) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                    // kéo đến gần phạm vi nhìn thấy
                })
            }else {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                    // kéo đến gần phạm vi nhìn thấy
                })

            }
        }, 300)
    },
    loadCurrentSong() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        if ($('.song.active')) {
            $('.song.active').classList.remove('active');
          }
          const list = $$('.song');
          list.forEach((song) => {
            if (song.getAttribute('data-index') == this.currentIndex) {
              song.classList.add('active');
            }
          });
    },
    loadConfig() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong() {
        // let newIndex
        // do {
        //     newIndex = Math.floor(Math.random() * this.songs.length)
        // } while (this.currentIndex === newIndex);

        // this.currentIndex = newIndex
        // this.loadCurrentSong()
        let newIndex;
                newIndex = Math.floor(Math.random() * this.songs.length);
                
                if(count >0) {
                    do {
                        newIndex = Math.floor(Math.random() * this.songs.length);
                        var isCheck= arrayTemp.includes(newIndex);
                    }
                    while(isCheck == true)
                }
                // Test
                //console.log(count,newIndex);
                //console.log(arrayTemp);

                arrayTemp[count]=newIndex;

                this.currentIndex = newIndex;
                this.loadCurrentSong();
                if(count == this.songs.length-1)
                {
                    arrayTemp=[];
                    count=-1;
                }
                count++;

        // đúng thì lặp nếu = bài cũ thì lặp
    },
    start: function () {
        // gán cấu hình vào config vào ứng dụng
        this.loadConfig()
        // định nghĩa các thuộc tính cho object
        this.defineProperties()
        // xử lý  các event lắng nghe các sự kiện
        this.handleEvents()
        // tải tt bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        // render playlist
        this.render()
        // hiển thị trang thái ban đầu của button repeat và random crepeatBtn.classList.toggle('active',_this.isRepeat)

        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    }
}

app.start();


