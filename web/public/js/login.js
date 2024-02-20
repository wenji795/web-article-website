// document.addEventListener('DOMContentLoaded', function() {
//     const loginForm = document.getElementById('loginForm');
//     const errorMessageDiv = document.getElementById('error-message');
//
//     loginForm.addEventListener('submit', function(e) {
//         e.preventDefault(); // 阻止表单的默认提交行为
//
//         const username = document.getElementById('username').value;
//         const password = document.getElementById('password').value;
//
//         fetch('/users/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ username, password })
//         })
//             .then(response => {
//                 // 首先检查响应状态
//                 if (!response.ok) {
//                     throw new Error('Login failed');
//                 }
//                 // 确保响应类型为JSON
//                 const contentType = response.headers.get("content-type");
//                 if (contentType && contentType.indexOf("application/json") !== -1) {
//                     return response.json(); // 解析JSON
//                 } else {
//                     throw new Error('Unexpected response type');
//                 }
//             })
//             .then(data => {
//                 // 在这里添加打印输出来查看收到的数据
//                 console.log('Response data from login:', data);
//
//                 // 现在根据data的内容进行条件判断
//                 if (data.success) {
//                     console.log('Login successful for user:', data.username || 'No username returned');
//                     window.location.href = '/editArticle'; // 登录成功后的重定向
//                 } else {
//                     // 如果登录失败，抛出错误，这将被下面的catch捕获
//                     throw new Error(data.message || 'Login failed without specific message');
//                 }
//             })
//             .catch(error => {
//                 errorMessageDiv.textContent = error.message;
//                 errorMessageDiv.style.display = 'block';
//             });
//
//
//     });
// });
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessageDiv = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单地默认提交行为

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.json()) // 假设所有响应都为JSON格式
            .then(data => {
                if (data.success) {
                    // 如果登录成功，根据后端指示的URL进行重定向
                    window.location.href = data.redirectUrl;
                } else {
                    // 显示登录失败的错误消息
                    alert(data.message);
                }

            })
            .catch(error => {
                errorMessageDiv.textContent = error.message;
                errorMessageDiv.style.display = 'block';
            });

    });
});
