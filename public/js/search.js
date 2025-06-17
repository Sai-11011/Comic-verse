import {  authAction, setupJump, displaySearch, addSearchTerm, showMessage } from './export.js';

document.addEventListener('DOMContentLoaded', () => {
   
    const searchTermInput = document.getElementById('searchBar');
    const applyFilterButton = document.getElementById('applyFilterButton');
    const searchButton = document.getElementById('searchButton');
    const resultContainer = document.getElementById('result');
    const loadingIndicator = document.getElementById('loading-indicator');

    let currentSearchQuery = ''; 
    let currentFilterString = ''; 

    const BASE_URL = 'https://comicvine.gamespot.com/api/search/?format=json&api_key=a315bf6a5d29be2ea9ba315c1b455cb8444d44af&field_list=name,image,api_detail_url,resource_type,id&limit=100';

    
    applyFilterButton.addEventListener('click', (event) => {
        event.preventDefault(); 
        const checkedFilters = Array.from(
            document.querySelectorAll('input[name="filter"]:checked')
        ).map(checkbox => checkbox.value);
        currentFilterString = checkedFilters.join(',');

        if (currentSearchQuery) {
            fetchResults(currentSearchQuery, currentFilterString);
        } else {
            showMessage("Please enter a search query before applying filters.", "info");
        }
    });

    searchTermInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchButton.click();
        }
    });

    searchButton.addEventListener('click', () => {
        currentSearchQuery = searchTermInput.value.trim();
        if (currentSearchQuery) {
            fetchResults(currentSearchQuery, currentFilterString);
        } else {
            showMessage("Please enter a query to search.", "info");
        }
    });

    async function fetchResults(query, filters = '') {
        if (!query) {
            showMessage("Search query cannot be empty.", "error");
            return;
        }

        let url = `${BASE_URL}&query=${encodeURIComponent(query)}`;

        if (filters) {
            url += `&resources=${encodeURIComponent(filters)}`;
        }

        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            const data = await response.json();

            if (data.error === "OK" && data.results) {

                displaySearch(
                    data,
                    resultContainer,
                );

                addSearchTerm(currentSearchQuery); 
            } else {
                resultContainer.innerHTML = `<p class="no-results">No results found for "${query}".</p>`;
                
            }

        } catch (error) {
            console.error('Error fetching search results:', error);
            showMessage('Failed to fetch search results. Please try again later.', 'error');
            resultContainer.innerHTML = `<p class="error-message">An error occurred while fetching results.</p>`;
        } finally {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }
    }

    authAction('general'); 
});
