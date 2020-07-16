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
const $modal = $('.modal');


/*----- event listeners -----*/

$('form').on('submit', handleGetArtistData);

$tAlbums.on('click', 'span', toggleReviewModal)


/*----- functions -----*/

//home page

$body.append(`<main><div class="page-header text-center"><h1>Welcome to Albumpedia. <br> Search for an artist at the top right corner ^</h1></div></main>`)

// retrieve ajax from server

function handleGetArtistData(event) {
    event.preventDefault();
    $('.page-header').remove();
    userArtist = $input.val();

    $.ajax({
        url: `https://www.theaudiodb.com/api/v1/json/${config.API_KEY}/search.php?s=${userArtist}`,
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
    );

};

function generateAlbumHTML(format) {
    return albumData.sort((a, b) => {   // sort is rearranging albums chronologically
        return (a.intYearReleased > b.intYearReleased) ? 1 : -1
    }).map((album, index) => { //map is returning html string
        if (album.strReleaseFormat === format){
            return `<tr>
                        <td id="cover">
                            <img 
                                src="${album.strAlbumThumb === null ? 
                                    'https://www.tibs.org.tw/images/default.jpg' : album.strAlbumThumb}" 
                                alt="${album.strAlbum}" 
                                height="100" 
                                width="100">
                        </td>
                        <td id="album-name">${album.strAlbum}</td>
                        <td id="album-year">${album.intYearReleased}</td>
                        <td id="label">${album.strLabel === null ? " " : album.strLabel}</td>
                        <td>
                            <span data-index="${index}">Review</span>
                        </td>
                    </tr>`;
        }
    });
};

function renderBio(){
    $artistName.html(artistData.strArtist);
    $artistPortrait.html(`<img src="${artistData.strArtistThumb}" alt="artist-image" id="artist-img"></img>`);
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

function toggleReviewModal(){
    var i = this.dataset.index
    $('#album-review').html(albumData[i].strReview);
    $modal.modal('toggle');
}