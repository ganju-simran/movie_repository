let pageIndexState = 1;
let isLoading = false;


// function fetch the movie data
const fetchPageData = (pageIndex = pageIndexState) => {
    const movieCards = document.querySelector(".card-container");
    let htmlCode = `
        <div class="loader">
            <img  alt="loader.gif" src="https://i.gifer.com/origin/dd/dd9538796fae4795531f8219af8a181c.gif">
        </div>
    `
    isLoading = true;
    movieCards.innerHTML = movieCards.innerHTML + htmlCode;
    return fetch(`https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=&cl=all&p=${pageIndex}&t=ns&st=adv `, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "3afe754955mshc08cfb8a4e878b2p1f5b3cjsna3f5c2cc9959",
            "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com"
        }
    })
        .then(response =>
            response.json().then(result => {
                pageIndexState += 1;
                renderMovieCards(result, !(pageIndex > 1));
            })
        )
        .catch(err => {
            console.error(err);
        });
}

// function fetch the movie data once user searches
const fetchSearchData = (pageIndex = pageIndexState, searchText ="get:new7") => {
    const movieCards = document.querySelector(".card-container");
    let htmlCode = `
        <div class="loader">
            <img  alt="loader.gif" src="https://i.gifer.com/origin/dd/dd9538796fae4795531f8219af8a181c.gif">
        </div>
    `
    isLoading = true;
    movieCards.innerHTML = movieCards.innerHTML + htmlCode;
    return fetch(`https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=${searchText}-!1900%2C2018-!0%2C5-!0%2C10-!0-!Any-!Any-!Any-!gt100-!%7Bdownloadable%7D&t=ns&cl=all&st=adv&ob=Relevance&p=${pageIndex}&sa=and`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "3afe754955mshc08cfb8a4e878b2p1f5b3cjsna3f5c2cc9959",
            "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com"
        }
    })
        .then(response =>
            response.json().then(result => {
                pageIndexState += 1;
                renderMovieCards(result, !(pageIndex > 1));
            })
        )
        .catch(err => {
            console.error(err);
        });
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
        fetchPageData();
    }
});

window.onload = () => {
    // fetch page data is called when page is rendered
    fetchPageData();
};
