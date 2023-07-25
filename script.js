 /**
  * 1. Render songs
  * 2. Scroll top
  * 3. Play / pause / seek
  * 4. CD rotate
  * 5. Next / prev
  * 6. Random
  * 7. Next / Repeat when ended
  * 8. Active song
  * 9. Scroll active song into view
  * 10. Play song when click
  */
 const $ = document.querySelector.bind(document);
 const $$ = document.querySelectorAll.bind(document);

 //  const PLAYER_STORAGE_KEY = 'F8_PLAYER'

 const playBtn = $('.btn-toggle-play');
 const header = $('header h2')
 const cd = $('.cd-thumb')
 const audio = $('#audio');
 const player = $('.player');
 const progress = $('#progress');
 const next = $('.btn-next');
 const prev = $('.btn-prev');
 const repeat = $('.btn-repeat')
 const randomSong = $('.btn-random')
 const playlist = $('.playlist');



 const app = {
     isBackground: false,
     isRepeat: false,
     isPlaying: false,
     isRandom: false,
     currentIndex: 0,
     //  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

     songs: [{

         name: "Anh đã ổn hơn",
         singer: "MCK",
         path: "music/anhdaonhon.mp3",
         image: "https://i1.sndcdn.com/artworks-PXjy5sywELqCfvhr-LVK2bA-t500x500.jpg"
     }, {

         name: "Suie and tie",
         singer: "MCK",
         path: "../music/song1.mp3",
         image: "https://baochauelec.com/cdn/images/tin-tuc/loi-bai-hat-suit-tie-mck-x-hoang-ton-ban-chuan.jpg"
     }, {

         name: "Lời tâm sự số 2",
         singer: "Mike",
         path: "music/tamsuso2.mp3",
         image: "https://i.ytimg.com/vi/Mi5konn17y8/maxresdefault.jpg"
     }, {

         name: "Lời tâm sự số 3",
         singer: "Mike",
         path: "../music/tamsuso3.mp3",
         image: "https://i.ytimg.com/vi/ReSHW-KEuuU/maxresdefault.jpg"
     }, {

         name: "Sofar",
         singer: "Binz",
         path: "music/sofar.mp3",
         image: "https://i.ytimg.com/vi/_MM1MQgFjRM/maxresdefault.jpg"
     }, {
         name: "Nụ hôn Biso",
         singer: "Mike",
         path: "music/nuhon.mp3",
         image: "https://i.ytimg.com/vi/yLGC8yRa39Q/maxresdefault.jpg"
     }, {
         name: "Anh đã từng yêu",
         singer: "Blacka",
         path: "music/anhdatungyeu.mp3",
         image: "https://i.ytimg.com/vi/2fg3GRvRnmY/maxresdefault.jpg"
     }, {
         name: "Có quá nhiều phiền lo",
         singer: "Blacka",
         path: "music/coquanhieuphienlo.mp3",
         image: "https://i1.sndcdn.com/artworks-000198402323-ci4zp6-t500x500.jpg"
     }, {
         name: "Nó muốn Khóc",
         singer: "Blacka",
         path: "music/nomuonkhoc.mp3",
         image: "https://i.ytimg.com/vi/H5mXi8P3CkQ/maxresdefault.jpg"
     }],
     //  setConfig: function(value, key) {
     //      this.config[key] = value;
     //      localStorage.setItem(PLAYER_STORAGE_KEY, this.config)
     //  },
     render: function() {
         const htmls = this.songs.map((song, index) => {
             return `
                        <div class="song ${index=== this.currentIndex?'outstanding': ''}" data-index="${index}">
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
         playlist.innerHTML = htmls.join('')

     },
     handleEvents: function() {

         const cdScroll = $('.cd')
         const cdWidth = cd.offsetWidth;
         const _this = this
         const cdThumbAnimate = cd.animate([{
             transform: 'rotate(360deg)'
         }], {
             duration: 5000,
             iterations: Infinity
         })
         cdThumbAnimate.pause()

         document.onscroll = function() {
             const scrollTop = window.scrollY || document.documentElement.scrollTop
             const newCdWidth = cdWidth - scrollTop;

             cdScroll.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
             cdScroll.style.opacity = newCdWidth / cdWidth
         }
         playBtn.onclick = function() {
             __this = this
             if (_this.isPlaying) {
                 audio.pause();
             } else {
                 audio.play();
             }
         }
         audio.onplay = function() {
             const playSong = $('.song')
             _this.isPlaying = true;
             player.classList.add('playing')
             cdThumbAnimate.play();

         }
         audio.onpause = function() {
                 _this.isPlaying = false;
                 player.classList.remove('playing')
                 cdThumbAnimate.pause()
             }
             /*
                        Khi nhạc đươc play thì thanh range thay đổi theo
                        CurrentTime: thời gian khi đoạn nhạc phát(s)
                        Duration: độ dài của video
                        vd: tổng thời lượng video là 10
                        thời gian phát hiện tại là 1s
        
                        1/10*100=10(phần trăm)
                        
                        5giay: 5/10*100 =50(phan tram)
        
                        =>> Phần trăm = thời gian / thòi lượng *100
                        thời gian = thời lượng*100 / phần trăm
        
                        thoi gian = thoi luong/100* phần trăm
        
                        **/
             //chạy theo thời gian và phằm trăm của thẻ input ranges
         audio.ontimeupdate = function() {
                 if (audio.duration) {
                     const timechangePercent = audio.currentTime / audio.duration * 100
                     progress.value = timechangePercent
                 }
             }
             /*
             Khi kéo thanh range thì phải phát nhạc ngay tại thời gian đó
             -> Tìm ra thời gian theo phần trăm của thanh nhạc ->phát nhạc từ time đó
             Để phát nhạc từ time đó => gán giá trị thời gian thay đổi từ thanh input range(seekTime) gán bằng vị trí hiên tai(audio.currentTime)                */
         progress.onchange = function(e) {
             const seekTime =
                 (e.target.value * audio.duration / 100);
             audio.currentTime = seekTime //
         };
         next.onclick = function() {
             if (_this.isRandom) {
                 _this.playRandomSong();
             } else {
                 _this.nextSong();
             }

             audio.play();
             _this.render();
             _this.scrollToview();
         }
         prev.onclick = function() {
             if (_this.isRandom) {
                 _this.playRandomSong();
             } else {
                 _this.prevSong();
             }
             audio.play();
             _this.render();
             _this.scrollToview()
         }
         randomSong.onclick = function() {
             _this.isRandom = !_this.isRandom
                 //  _this.setConfig('isRandom', _this.isRandom)
             randomSong.classList.toggle('active', _this.isRandom);

         }
         repeat.onclick = function() {
             _this.isRepeat = !_this.isRepeat
                 //  _this.setConfig('isRepeat', _this.isRepeat)
             repeat.classList.toggle('active', _this.isRepeat);

         }
         audio.onended = function() {
             if (_this.isRepeat) {
                 audio.play()
             } else {
                 next.click()
             }
         }
         playlist.onclick = function(e) {

             const songNode = e.target.closest('.song:not(.outstanding)')

             if (songNode || e.target.closest('.option')) {

                 if (songNode) {
                     _this.currentIndex = (Number(songNode.dataset.index))
                     _this.loadCurrentSong()
                     _this.render()
                     audio.play()
                 }
                 if (e.target.closest('.option')) {

                 }
             }
         }
     },
     loadCurrentSong: function() {
         header.innerText = this.currentSong.name;
         cd.style.backgroundImage = `url('${this.currentSong.image}')`
         audio.src = this.currentSong.path;
     },
     currentSong: function() {
         Object.defineProperty(this, 'currentSong', {
             get: function() {
                 return this.songs[this.currentIndex]
             }
         })
     },
     nextSong: function() {
         this.currentIndex++;

         if (this.currentIndex >= this.songs.length) {
             this.currentIndex = 0;

         }

         this.loadCurrentSong();

     },
     prevSong: function() {
         this.currentIndex--;
         if (this.currentIndex < 0) {
             this.currentIndex = this.songs.length - 1;
         }
         this.loadCurrentSong();
     },
     playRandomSong: function() {
         let newIndex
         do {
             newIndex = Math.floor(Math.random() * this.songs.length)
         } while (newIndex === this.currentIndex)
         this.currentIndex = newIndex;
         this.loadCurrentSong()
     },
     scrollToview: function() {
         setTimeout(() => {
             $('.song.outstanding').scrollIntoView({
                 behavior: 'smooth',
                 block: 'end',
                 inline: 'nearest'
             })
         }, 300)
     },

     start: function() {
         this.handleEvents()
         this.currentSong()
         this.loadCurrentSong()
         this.render()
     }
 }
 app.start();
 //Khi heet nhac tu donng next qua bai khac