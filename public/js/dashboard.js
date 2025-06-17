import { decodeJwt, authAction, loadSearchHistory, loadViewHistory } from './export.js';

document.addEventListener('DOMContentLoaded', function() {
    const usernameDisplay = document.getElementById('usernameDisplay');
    const emailDisplay = document.getElementById('emailDisplay');
    const searchList = document.getElementById('searchList');
    const clearSearch = document.getElementById('clearSearchHistory');
    const viewedItemsContainer = document.getElementById('viewedItems');
    const clearView = document.getElementById('clearViewHistory');

    const idToken = localStorage.getItem('idToken');
    const userEmail = localStorage.getItem('userEmail');
    const displayUsername = localStorage.getItem('displayUsername');
    
    if (!idToken || !userEmail) {
        localStorage.removeItem('idToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('displayUsername');
        
        window.location.href = '/login.html';
        return;
    }

    emailDisplay.textContent = userEmail;
    
    const username = displayUsername || 
                    localStorage.getItem('registeredUsername') || 
                    userEmail.split('@')[0];
    usernameDisplay.textContent = username;

    if (!displayUsername) {
        localStorage.setItem('displayUsername', username);
    }

    authAction('dashboard');

    loadSearchHistory(searchList);

    clearSearch.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your search history?')) {
            localStorage.removeItem('searchHistory');
            loadSearchHistory(searchList);
        }
    });

    loadViewHistory(viewedItemsContainer);

    clearView.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your view history?')) {
            localStorage.removeItem('viewHistory');
            loadViewHistory(viewedItemsContainer);
        }
    });
});