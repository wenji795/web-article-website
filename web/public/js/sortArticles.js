// public/js/sortArticles.js
document.addEventListener('DOMContentLoaded', () => {
    const sortFieldSelect = document.getElementById('sortField');
    const sortOrderButton = document.getElementById('sortOrder');

    function fetchAndDisplayArticles() {
        const sortField = sortFieldSelect.value;
        const sortOrder = sortOrderButton.getAttribute('data-order');

        let articles = Array.from(document.querySelectorAll("li.article-li"));

        // Do sorting
        if (sortField === "article_title") {
            articles.sort((a, b) => {
                if (a.getAttribute("data-article-title") === b.getAttribute("data-article-title")) { return 0 }
                return a.getAttribute("data-article-title") < b.getAttribute("data-article-title") ? 1 : -1;
            });
        } else if (sortField === "user_name") {
            articles.sort((a, b) => {
                const nameA = a.getAttribute("data-article-author").toLowerCase(); // 同上，转换为小写
                const nameB = b.getAttribute("data-article-author").toLowerCase();
                if (nameA === nameB) { return 0; }
                return nameA < nameB ? -1 : 1; // 升序排序
            });
        }

        if (document.querySelector("#sortOrder").getAttribute("data-order") === "ASC") {
            articles.reverse();
        }

        let container = document.querySelector("#articlesList");
        container.innerHTML = "";
        container.append(...articles);


    }

    sortFieldSelect.addEventListener('change', fetchAndDisplayArticles);
    sortOrderButton.addEventListener('click', () => {
        const currentOrder = sortOrderButton.getAttribute('data-order');
        const newOrder = currentOrder === 'ASC' ? 'DESC' : 'ASC';
        sortOrderButton.setAttribute('data-order', newOrder);
        fetchAndDisplayArticles(); // 重新获取并显示排序后的文章
    });

    fetchAndDisplayArticles(); // 初始加载文章列表
});

