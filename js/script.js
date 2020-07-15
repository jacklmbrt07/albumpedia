/*----- constants -----*/

/*----- app's state (variables) -----*/
let userArtist; 
/*----- cached element references -----*/
const $artistName = $('#artist-name');
const $artistPortrait = $('#artist-portrait img');
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
// handleGetArtistData();
/*----- functions -----*/
// retrieve ajax from server
function handleGetArtistData(event) {
    event.preventDefault()
    userArtist = $input.val();
    $.ajax({
        url: `https://www.theaudiodb.com/api/v1/json/${config.API_KEY}/search.php?s=${userArtist}`, // ${userArtist}
    }).then(
        (data) => {
            artistData = data.artists[0];// accesses an object of artist info
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
        // return `<li class="list-group-item">
        //             <img src="${album.strAlbumThumb}" alt="${album.strAlbum}" height="100" width="100">   
        //             ${album.strAlbum} - ${album.intYearReleased}
        //         </li>`;
            return `<tr>
                        <td><img src="${album.strAlbumThumb}" alt="${album.strAlbum}" height="100" width="100"></td>
                        <td>${album.strAlbum}</td>
                        <td>${album.intYearReleased}</td>
                        <td>${album.strLabel}</td>
                        <td>Review</td>
                    </tr>`;
        }
    });

    
};


function renderBio(){
    $artistName.html(artistData.strArtist);
    $artistPortrait.attr('src', artistData.strArtistThumb);
    $artistBio.html(artistData.strBiographyEN);
    $artistOrigin.html(artistData.strCountry);
    $flag.attr('class', `${artistData.strCountryCode.toLowerCase()} flag`)
    $artistBirth.html(artistData.intFormedYear);
    $artistDeath.html(artistData.strDisbanded === null ? "Present" : artistData.strDisbanded);
    $artistGenre.html(artistData.strGenre)
}

function renderRecords(){
    $tAlbums.html(generateAlbumHTML("Album")); //$ulAlbums.
    $tEPs.html(generateAlbumHTML("EP"));
    $tLiveRecs.html(generateAlbumHTML("Live"));

    // render data to table

}

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
    
    