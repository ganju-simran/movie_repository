let pageIndexState = 1;
let isLoading = false;
const searchSubmit = document.querySelector(".search-input");
const serchText = document.querySelector("#search-text");
let isSearching = false;

// function fetch the movie data
const fetchPageData = (queryText) => {
    const movieCards = document.querySelector(".card-container");
    let htmlCode = `
        <div class="loader">
            <img  alt="loader.gif" src="https://i.gifer.com/origin/dd/dd9538796fae4795531f8219af8a181c.gif">
        </div>
    `
    isLoading = true;
    movieCards.innerHTML = movieCards.innerHTML + htmlCode;
    return fetch(queryText ? `https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=${queryText}&cl=all&p=${pageIndexState}&t=ns&st=adv ` : `https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=&cl=all&p=${pageIndexState}&t=ns&st=adv `, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "3afe754955mshc08cfb8a4e878b2p1f5b3cjsna3f5c2cc9959",
            "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com"
        }
    })
        .then(response =>
            response.json().then(result => {
                if (queryText && result.ITEMS.length == result.COUNT) {
                    isSearching = false;
                }
                pageIndexState += 1;
                renderMovieCards(result, !(pageIndexState > 1));
            })
        )
        .catch(err => {
            console.error(err);
        });
}

// function fetch the movie data once user searches
const fetchSearchData = () => {
    const movieCards = document.querySelector(".card-container");
    movieCards.innerHTML = '';
    pageIndexState = 1;
    const searchValue = serchText.value;
    if (!searchValue) isSearching = false;
    else isSearching = true;
    fetchPageData(searchValue);
}

// function to render cards once movie data is fetched
const renderMovieCards = (movieData, initial = true) => {
    const movieCards = document.querySelector(".card-container");
    movieCards.removeChild(movieCards.lastChild.previousSibling);
    let htmlCode = initial ? '' : movieCards.innerHTML;
    isLoading = false;
    movieData.ITEMS.forEach(element => {
        htmlCode = htmlCode +
            `
            <div class="movie-card">
                    <img alt=${element.title}
                        src=${element.image}>
                    <div class="middle">
                    </div>
            </div>
        `
    });

    movieCards.innerHTML = htmlCode;
}

// event listener on the card container div scroll to call api when scrollbar reaches to the bottom of the div
document.querySelector(".card-container").addEventListener("scroll", function () {
    var myDiv = document.querySelector(".card-container");
    if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight && !isLoading) {
        fetchPageData(isSearching ? serchText.value : null);
    }
});

window.onload = () => {
    // fetch page data is called when page is rendered
    fetchPageData();
};
