/*----- constants -----*/

/*----- app's state (variables) -----*/
let userArtist; 
/*----- cached element references -----*/
const $body = $('body');
const $artistName = $('#artist-name');
const $artistPortrait = $('#artist-portrait');
const $artistBio = $('#artist-bio');
const $artistOrigin = $('#origin');
const $flag = $('#flag');
const $artistBirth = $('#year-formed');
const $artistDeath = $('#year-disbanded');
const $artistGenre = $('#genre');
const $tAlbums = $('#albums');
const $tEPs = $('#eps');
const $tLiveRecs = $('#live-recs');
const $input = $('input[type="text"]');

/*----- event listeners -----*/

$('form').on('submit', handleGetArtistData);

/*----- functions -----*/



// retrieve ajax from server
// function renderHome(){
//     $body.append(`<main><div class="page-header text-center"><h1>Welcome to Albumpedia. <br> Search for an artist at the top right corner ^</h1></div></main>`)
// }

// function renderMain(){
//     $('main').html(()=>{return`
//     <div class="search-main">
//     <div class="container">
//         <div id="artist-name-container"><h3 id="artist-name"></h3></div>
//         <div id="artist-portrait"><img src="" alt="artist-image" id="artist-img"></div>
//         <div id="bio-container"><p><span id="artist-bio"></span></p></div>
//         <div>
//           <ol>
//               <li><b>Origin: </b><span id="origin"></span> <i id="flag"></i></li>
//               <li><b>Years Active: </b><span id="year-formed"></span> - <span id="year-disbanded"></span></li>
//               <li><b>Genre: </b> <span id="genre"></span></li>
//           </ol>
//         </div>
//     </div>
//     <div class="container2">
//       <section>
//           <h3>Albums</h3>
//           <br>
//           <table>
//             <tbody id="albums"></tbody>
//           </table>
//           <br>
//           <h4>EPs</h4>
//           <br>
//           <table>
//             <tbody id="eps"></tbody>
//           </table>
//           <br>
//           <h4>Live Recordings</h4>
//           <br>
//           <table>
//             <tbody id="live-recs"></tbody>
//           </table>
//           <br>
//       </section>
//     </div>
//   </div>`})
// };

function handleGetArtistData(event) {
    event.preventDefault()
    userArtist = $input.val();
    $.ajax({
        url: `https://www.theaudiodb.com/api/v1/json/${config.API_KEY}/search.php?s=${userArtist}`, // ${userArtist}
    }).then(
        (data) => {
            artistData = data.artists[0];// accesses an object of artist info
            // renderMain();
            renderBio();
        },
        (error) => {
            console.log('error is ' + error);
        }
    );
    $.ajax({
        url: `https://www.theaudiodb.com/api/v1/json/${config.API_KEY}/searchalbum.php?s=${userArtist}`
    }).then(
        (data) => {
            albumData = data.album; // acceses an array of object per album 
            renderRecords();
        },
        (error) => {
            console.log("error is " + error);
        }
    )
}


function generateAlbumHTML(format) {
    return albumData.sort((a, b) => {  // sort is rearranging albums chronologically
        return (a.intYearReleased > b.intYearReleased) ? 1 : -1
    }).map(album => { //map is returning html string
        if (album.strReleaseFormat === format){
            return `<tr>
                        <td id="cover"><img src="${album.strAlbumThumb}" alt="${album.strAlbum}" height="100" width="100"></td>
                        <td id="album-name">${album.strAlbum}</td>
                        <td id="album-year">${album.intYearReleased}</td>
                        <td id="label">${album.strLabel}</td>
                        <td id="review"><span id="click" data-toggle="modal" data-target="#modal1" >Review</span></td>
                    </tr>`;
        }
    });

    
};


function renderBio(){
    $artistName.html(artistData.strArtist);
    $artistPortrait.html(`<img src="${artistData.strArtistThumb}" alt="artist-image" id="artist-img"></img>`);
    // $artistPortrait.attr('src', artistData.strArtistThumb);
    $artistBio.html(artistData.strBiographyEN);
    $('.origin-header').text('Origin: ')
    $artistOrigin.html(artistData.strCountry);
    $flag.attr('class', `${artistData.strCountryCode.toLowerCase()} flag`)
    $('.year-header').text('Years Active: ')
    $('.-').text(' - ')
    $artistBirth.html(artistData.intFormedYear);
    $artistDeath.html(artistData.strDisbanded === null ? "Present" : artistData.strDisbanded);
    $('.genre-header').text('Genre: ')
    $artistGenre.html(artistData.strGenre)
}

function renderRecords(){
    $('.albums-header').html('Albums')
    $('.eps-header').html('EPs')
    $('.live-header').html('Live Recordings')
    $tAlbums.html(generateAlbumHTML("Album"));
    $tEPs.html(generateAlbumHTML("EP"));
    $tLiveRecs.html(generateAlbumHTML("Live"));
}

// //produce the modal
// function renderModal(){
//     $('#album-review').text(albumData.strReview)//needs to select the correct object
//     instance.open()
// }

// default api key is 1
    // Return Artist details from artist name
    // theaudiodb.com/api/v1/json/{APIKEY}/search.php?s={Artist name}
    // Example - theaudiodb.com/api/v1/json/1/search.php?s=coldplay
    
    // Return all Album details from artist name
    // theaudiodb.com/api/v1/json/{APIKEY}/searchalbum.php?s={Artist name}
    
    // Return All Tracks for Album from known TADB_Album_ID
    // track.php?m={albumid}
    // Example - theaudiodb.com/api/v1/json/1/track.php?m=2115888
    
    // Return a Music DVD from artist/mdvd name
    // theaudiodb.com/api/v1/json/{APIKEY}/searchmdvd.php?s={Artist_Name}&a={Music_Dvd_Name}
    
    