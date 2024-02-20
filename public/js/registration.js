document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault(); // 阻止表单的默认提交行为

        // 收集表单数据
        const formData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            realName: document.getElementById('realName').value,
            birthDate: document.getElementById('birthDate').value,
            description: document.getElementById('description').value,
            avatar: document.querySelector('input[name="avatar"]:checked').value,
        };

        // 验证密码是否一致
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (formData.password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // 发送 POST 请求到后端
        fetch('/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // 发送 JSON 数据
            },
            body: JSON.stringify(formData) // 将 formData 对象转换为 JSON 字符串
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    if (data.message.includes('successfully')) {
                        // 注册成功，可以重定向到登录页或其他页面
                        window.location.href = '/users/login';
                    }
                }
            })
            .catch(error => {
                console.error('Error during registration:', error);
                alert('Registration failed.');
            });
    });

    // 实时检查用户名是否唯一
    const usernameInput = document.getElementById('username');
    const usernameFeedback = document.getElementById('usernameFeedback');

    usernameInput.addEventListener('input', function() {
        fetch(`/users/check-username?username=${usernameInput.value}`)
            .then(response => response.json())
            .then(data => {
                if (data.isTaken) {
                    usernameFeedback.textContent = 'Username is already taken.';
                    registerForm.querySelector('button[type="submit"]').disabled = true;
                } else {
                    usernameFeedback.textContent = '';
                    registerForm.querySelector('button[type="submit"]').disabled = false;
                }
            })
            .catch(error => {
                console.error('Error checking username:', error);
                usernameFeedback.textContent = 'Error checking username.';
            });
    });
});
