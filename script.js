const newsContainer = document.getElementById('news-container');
const searchBar = document.getElementById('search-bar');
const dateFilter = document.getElementById('date-filter');
const searchButton = document.getElementById('search-button');

// Function to create an article element
function createArticleElement(article) {
    const articleDiv = document.createElement('div');
    articleDiv.classList.add('news-article');

    // Article image
    const img = document.createElement('img');
    img.src = article.urlToImage || 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwingandaprayer.live%2F2018%2F07%2F16%2Fits-a-no-photo-day%2F&psig=AOvVaw3hqPSKQ2oTUCrcSs_6XFYF&ust=1729576091284000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMiT3pbjnokDFQAAAAAdAAAAABAE';
    img.alt = article.title;

    // Article content container
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('news-article-content');

    // Article title
    const title = document.createElement('h2');
    title.textContent = article.title;

    // Article description
    const description = document.createElement('p');
    description.textContent = article.description;

    // Read more link
    const readMore = document.createElement('a');
    readMore.href = article.url;
    readMore.textContent = 'Read more';
    readMore.target = '_blank'; // Open link in new tab

    // Append everything to the articleDiv
    contentDiv.appendChild(title);
    contentDiv.appendChild(description);
    contentDiv.appendChild(readMore);
    articleDiv.appendChild(img);
    articleDiv.appendChild(contentDiv);

    return articleDiv;
}

fetch('api.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load API key and base URL');
        }
        return response.json();
    })
    .then(config => {
        const baseUrl = config.baseUrl;
        const apiKey = config.apiKey;
        
        // Function to fetch news from the API
        function fetchNews(query, date) {
            let url = `api.json?q=${query}&apiKey=${apiKey}`;

           
            if (date) {
                url += `&from=${date}`;
            }

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch news');
                    }
                    return response.json();
                })
                .then(data => {
                    newsContainer.innerHTML = ''; // Clear loading text

                    // Check if there are articles
                    if (data.articles.length === 0) {
                        newsContainer.innerHTML = `<p>No news articles found for "${query}" on "${date || 'any date'}".</p>`;
                    }

                    // Loop through the articles and display them
                    data.articles.forEach(article => {
                        const articleElement = createArticleElement(article);
                        newsContainer.appendChild(articleElement);
                    });
                })
                .catch(error => {
                    newsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
                });
        }

        // Initial fetch for default news
        fetchNews('latest', '');

        // Add event listener to search button
        searchButton.addEventListener('click', () => {
            const query = searchBar.value.trim();
            const date = dateFilter.value;
            if (query) {
                fetchNews(query, date); // Fetch news based on user query and selected date
            } else {
                alert('Please enter a search term');
            }
        });
    })
    .catch(error => {
        console.error('Error loading API key and base URL:', error);
    });
