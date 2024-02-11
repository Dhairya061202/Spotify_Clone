console.log("Starting");

let currentSong= new Audio();
let songs;

function convertSecondsToFormat(seconds) {
    // Ensure totalSeconds is a valid number
    if (isNaN(seconds) || seconds < 0) {
        return 'Invalid input';
    }

    const minutes=Math.floor(seconds /60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Convert minutes and seconds to the specified format
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// gets the list of all songs
async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as= div.getElementsByTagName("a")
    let songs=[]
    for (let i=0; i<as.length; i++) {
        const element= as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
    } 
    return songs;
}

const playMusic = (track, pause=false)=>{
    currentSong.src="/songs/" + track;
    if(!pause){
        currentSong.play()
        play.src = "pause.svg";
    }
    document.querySelector(".songInfo").innerHTML=decodeURI(track);
    document.querySelector(".songTime").innerHTML="";
}

async function main(){

    //gets the list of all songs
    songs= await getSongs();   

    // show all the song in playlists
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML + `<li> <img class="invert" src="music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ").replaceAll("/", "").replaceAll("320 Kbps.mp3", "")}</div>
          <div>dp</div>
        </div>
        <div div class="playnow">
          <div>Play Now</div>
          <img class="invert" src="play.svg" alt="">
      </div></li>`;
    }
    //attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e)=>{
        e.addEventListener("click", element =>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        
    })  

    // attach an event listener to play next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg";
        }
        else{
            currentSong.pause();
            play.src = "play.svg";
        }
    })

    // listen for timeupdate event
    currentSong.addEventListener("timeupdate", ()=>{
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songTime").innerHTML=`${convertSecondsToFormat(currentSong.currentTime)}/${ convertSecondsToFormat(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) * 100 + "%"
    })

    // add event listeners to seek bar
    document.querySelector(".seekBar").addEventListener("click", e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left=percent + "%";
        currentSong.currentTime = ((currentSong.duration)* percent)/100
    })

    // add event listeners to previous and next button
    previous.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index-1) >= 0){
            playMusic(songs[index-1])
        }
    })

    next.addEventListener("click", ()=>{
        console.log("next click")
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index+1) > length){
            playMusic(songs[index+1])
        }
    })

    card_play.addEventListener("click", ()=>{
        console.log("card_play")

        let albumSong=document.querySelector(".card").getElementsByTagName("h3")
        
    })
}
main();