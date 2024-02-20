

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('sortField').addEventListener('change', fetchSortedArticles);
    document.getElementById('sortOrder').addEventListener('click', toggleSortOrder);
    fetchSortedArticles(); // 初始加载文章列表
});

function fetchSortedArticles() {
    const sortField = document.getElementById('sortField').value;
    const sortOrder = document.getElementById('sortOrder').getAttribute('data-order');

    fetch(`/articles/sorted?field=${sortField}&order=${sortOrder}`)
        .then(response => response.json())
        .then(articles => {
            updateArticlesList(articles);
        })
        .catch(error => console.error('Error fetching sorted articles:', error));
}

function toggleSortOrder() {
    const sortOrderButton = document.getElementById('sortOrder');
    const currentOrder = sortOrderButton.getAttribute('data-order');
    const newOrder = currentOrder === 'ASC' ? 'DESC' : 'ASC';
    sortOrderButton.setAttribute('data-order', newOrder);
    sortOrderButton.textContent = newOrder === 'ASC' ? 'ASC/DESC' : 'DESC/ASC';
    fetchSortedArticles();
}


function updateArticlesList(articles) {
    const articlesListDiv = document.getElementById('articlesList');
    articlesListDiv.innerHTML = ''; // 清空当前文章列表

    articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article';
        articleDiv.innerHTML = `
            <h2>${article.article_title}</h2>
            <p>Author: ${article.user_name}</p>
            <p>${article.create_date}</p>
            <p>${article.article_content}</p>
        `;
        articlesListDiv.appendChild(articleDiv);
    });
}
