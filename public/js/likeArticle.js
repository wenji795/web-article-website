// public/js/likeArticle.js
function likeArticle(articleId, event) {
    event.preventDefault(); // 防止表单提交
    fetch(`/home/like/${articleId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId: articleId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById(`likes-count-${articleId}`).innerText = `Likes: ${data.likeCount}`;
            } else {
                console.log(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}
