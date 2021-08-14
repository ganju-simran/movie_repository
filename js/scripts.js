let pageIndexState = 1;
let isLoading = false;
const searchSubmit = document.querySelector(".search-input");
const serchText = document.querySelector("#search-text");
let isSearching = false;
let alreadyCalling = false;

const config = {
    root: document.querySelector(".card-container"),
    threshold: 0
};

let observer = new IntersectionObserver(function (entries, self) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const image = entry.target;
            image.src = image.dataset.src;
            image.classList.remove("lazy");
            self.unobserve(entry.target);
        }
    });
}, config);

// function to render cards once movie data is fetched
const renderMovieCards = (movieData, initial = true) => {
    const movieCards = document.querySelector(".card-container");
    movieCards.removeChild(movieCards.lastChild.previousSibling);
    let htmlCode = initial ? '' : movieCards.innerHTML;
    isLoading = false;
    movieData.ITEMS.forEach((element, index) => {
        htmlCode = htmlCode +
            `
            <div role="listitem" class="movie-card" aria-label="movie card">
                    <img alt=${element.title} loading="lazy" class="lazy" data-src=${element.image} />
                    <div class="middle">
                    </div>
            </div>
        `
    });

    movieCards.innerHTML = htmlCode;
    const imgs = document.querySelectorAll('[data-src]');
    imgs.forEach(img => {
        observer.observe(img);
    });
}

// function fetch the movie data
const fetchPageData = (queryText) => {
    alreadyCalling = true;
    const movieCards = document.querySelector(".card-container");
    let htmlCode = `
        <div class="loader">
            <img alt="loading data" src="https://i.gifer.com/origin/dd/dd9538796fae4795531f8219af8a181c.gif">
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
                alreadyCalling = false;
                // if there are no more items for a particular search display no search data
                if (queryText && result.ITEMS.length == result.COUNT) {
                    isSearching = false;
                }
                pageIndexState += 1;
                renderMovieCards(result, !(pageIndexState > 1));
            })
        )
        .catch(err => {
            alreadyCalling = false;
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

// event listener on the card container div scroll to call api when scrollbar reaches to the bottom of the div
document.querySelector(".card-container").addEventListener("scroll", function () {
    let myDiv = document.querySelector(".card-container");
    if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight && !isLoading && !alreadyCalling) {
        fetchPageData(isSearching ? serchText.value : null);
    }
});

window.onload = () => {
    // fetch page data is called when page is rendered
    fetchPageData();
};
