/*----- constants -----*/
// https://www.theaudiodb.com/api/v1/json/5d656564694f534d656564/search.php?s=radiohead
// https://www.theaudiodb.com/api/v1/json/5d656564694f534d656564/searchalbum.php?s=radiohead
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



// $modal.on('show.bs.modal', function (event) {
//     var button = $(event.relatedTarget) // Button that triggered the modal
//     var recipient = button.data('whatever') // Extract info from data-* attributes
//     // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
//     // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
//     var modal = $(this)
//     modal.find('.modal-body').text('New message to ' + button)
//     modal.find('.modal-body input').val(recipient)
//   })

/*----- functions -----*/

//initialize modal


// retrieve ajax from server
$body.append(`<main><div class="page-header text-center"><h1>Welcome to Albumpedia. <br> Search for an artist at the top right corner ^</h1></div></main>`)


function handleGetArtistData(event) {
    $('.page-header').remove();
    event.preventDefault()
    userArtist = $input.val();

    //if !isdetal{
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
    }).map((album, index) => { //map is returning html string
        if (album.strReleaseFormat === format){
            return `<tr>
                        <td id="cover"><img src="${album.strAlbumThumb === null ? 'https://www.tibs.org.tw/images/default.jpg' : album.strAlbumThumb}" alt="${album.strAlbum}" height="100" width="100"></td>
                        <td id="album-name">${album.strAlbum}</td>
                        <td id="album-year">${album.intYearReleased}</td>
                        <td id="label">${album.strLabel === null ? " " : album.strLabel}</td>
                        <td><span data-index="${index}">Review</span></td>
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
    // $body.outerHTML(generateModal());
    // $('#click').on('click', function(){
    //     console.log(event.target.dataset.url)
    //     console.log("clicked")
    // })
}

function toggleReviewModal(){
    console.log('clicked')
    var i = this.dataset.index
    console.log(albumData[i].strReview)
    $('#album-review').html(albumData[i].strReview);
    $modal.modal('toggle');
}

// function setModal(){
//     let i;

//     $('.modal-body').html('Hello World' + albumData[2].strReview);//what is the i
//     console.log('clicked')
// }

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
    
    