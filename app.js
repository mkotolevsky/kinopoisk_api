const API_KEY = '8c8e1a50-6322-4135-8875-5d40a5420d86'
const API_URL_POPULAR =
    'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1'
const API_URL_SEARCH =
    'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='
const API_URL_MOVIE_DETAILS =
    'https://kinopoiskapiunofficial.tech/api/v2.2/films/'

getMovies(API_URL_POPULAR)

async function getMovies(url) {
    const resp = await fetch(url, {
        headers: {
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json',
        },
    })
    const respData = await resp.json()
    showMovies(respData)
}

function showMovies(data) {
    const moviesEl = document.querySelector('.movies')
    document.querySelector('.movies').innerHTML = ''

    data.films.forEach((movie) => {
        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')
        movieEl.innerHTML = `
        <div class="movie-cover-inner">
            <img
                src="${movie.posterUrlPreview}"
                alt="${movie.nameRu}"
                class="movie-cover"
            />
        </div>
        <div class="movie-info">
            <div class="movie-title">${movie.nameRu}</div>
            <div class="movie-category">${movie.genres.map(
                (genre) => ` ${genre.genre}`
            )}</div>
                ${
                    movie.rating &&
                    movie.rating <= 10 &&
                    `
                  <div class="movie-average movie-avarage-${getClassByRate(
                      movie.rating
                  )}">${movie.rating}</div>
                  `
                }
                </div>
                  `
        movieEl.addEventListener('click', () => {
            openModal(movie.filmId)
        })
        moviesEl.append(movieEl)
    })
}

function getClassByRate(vote) {
    if (vote >= 7) {
        return 'green'
    } else if (vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

const form = document.querySelector('form')
const search = document.querySelector('.header-search')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`
    if (search.value) {
        getMovies(apiSearchUrl)
        search.value = ''
    }
})

// Modal
const modalEl = document.querySelector('.modal')

async function openModal(id) {
    const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
        headers: {
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json',
        },
    })
    const respData = await resp.json()
    console.log(respData)

    modalEl.classList.add('modal-show')
    document.body.classList.add('stop-scrolling')

    modalEl.innerHTML = `
    <div class="modal-card">
      <img class="modal-movie-backdrop" src="${respData.posterUrl}" alt="${
        respData.nameRu
    }">
      <h2>
        <span class="modal-movie-title">${respData.nameRu}</span>
        <span class="modal-movie-release-year">${respData.year}</span>
      </h2>
      <ul class="modal-movie-info">
        <div class="loader"></div>
        <li class="modal__movie-genre">Жанр: ${respData.genres.map(
            (el) => `<span> ${el.genre}</span>`
        )}</li>
        ${
            respData.filmLength
                ? `<li class="modal-movie-runtime">Продолжительность: ${respData.filmLength} минут</li>`
                : ''
        }
        <li >Сайт: <a class="modal-movie-site" href="${respData.webUrl}">${
        respData.webUrl
    }</a></li>
    ${
        respData.description
            ? `<li class="modal-movie-overview">Описание: ${respData.description}</li>`
            : ''
    }
      </ul>
      <button type="button" class="modal-button-close">Закрыть</button>
    </div>
`
    const btnClose = document.querySelector('.modal-button-close')
    btnClose.addEventListener('click', () => closeModal())
}

function closeModal() {
    modalEl.classList.remove('modal-show')
    document.body.classList.remove('stop-scrolling')
}

window.addEventListener('click', (e) => {
    if (e.target === modalEl) {
        closeModal()
    }
})

window.addEventListener('keydown', (e) => {
    if (e.keyCode === 27) {
        closeModal()
    }
})
