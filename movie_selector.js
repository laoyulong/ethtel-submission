/**
 * @file Solution file to Telerik's matching braces problem
 * @description The problem doesn't prescribe a particular storage medium
 * for housing the strings, so we assume we have them read already.
 * @author npd
 */

/**
 * @XXX(npd): Could just as well plug XHR object, if executed from a browser
 */
const https = require('https');

function between(start, end) {
    let result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
}

/**
 * @description Get movie information from a remote API; By default we start
 * from page #1
 * @param {string} searchTitle - Name of the movie
 * @param {number} pageNumber - Current page; The data set is partitioned in
 * pages with up to 10 movie data objects
 * @returns {Object}
 */
function callRemoteMovieAPI(searchTitle, pageNumber) {
    function getRequestHandler(resolve, reject) {
        const SEARCH_URL = `https://jsonmock.hackerrank.com/api/movies/search/?Title=${searchTitle}&page=${pageNumber}`;

        let request = https.get(SEARCH_URL, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                let response = JSON.parse(data);

                resolve(response);
            });

        }).on("error", reject);
    }

    return new Promise(getRequestHandler);
}

function getMovieTitleCallback(current, index, array) {
    return current.Title;
}

function errorHandler(error) {
    console.log("Error: " + error.message);
}

/**
 * @param {string} searchTitle - Title of the movie/s we are searching for
 * @returns {Object}
 */
function getMovieTitles(searchTitle) {
    function responseHandler(response) {
        let totalPages = parseInt(response.total_pages);
        let pageDelta = totalPages - parseInt(response.page);

        let result = response.data.map(getMovieTitleCallback);

        /**
         * If we have more than one page to process, create multiple Promises...
         */
        if (0 < pageDelta) {
            return Promise.all(between(2, totalPages).map((pageNumber) => {
                callRemoteMovieAPI(searchTitle, pageNumber)
                    .then((combined) => {
                        result = result.concat(
                            combined.data.map(getMovieTitleCallback));
                        /**
                         * and process the combined results...
                         */
                        console.log(result);
                    })
                    .catch(errorHandler);
            }));
        } else {
            /**
             * or process a single resolved Promise.
             */
            console.log(result);
        }
    }

    /**
     * We start searching by querying for the (possibly) first page
     */
    return callRemoteMovieAPI(searchTitle, 1)
        .then(responseHandler)
        .catch(errorHandler);
}

// Test case (Two page response)
//getMovieTitles("spiderman");
