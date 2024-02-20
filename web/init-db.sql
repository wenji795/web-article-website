-- Your database initialisation SQL here
DROP TABLE IF EXISTS web_like;
DROP TABLE IF EXISTS web_comment;
DROP TABLE IF EXISTS web_article;
DROP TABLE IF EXISTS web_user;

create table web_user (
    user_id INT AUTO_INCREMENT,
    user_name varchar(32) NOT NULL,
    real_name varchar(32) NOT NULL,
    password varchar(128) NOT NULL,
    avatar varchar(128),
    brith_day date,
    description varchar(256),
    create_date datetime NOT NULL,
    update_date datetime NOT NULL,
    primary key (user_id)
);

CREATE TABLE web_article (
    article_id INT AUTO_INCREMENT,
    user_id int(11),
    user_name varchar(32) NOT NULL,
    article_title varchar(256) NOT NULL,
    article_content text NOT NULL,
    create_date datetime NOT NULL,
    update_date datetime NOT NULL,
    like_count int(11) NOT NULL,
    image_path VARCHAR(255), -- 这里添加了image_path列
    PRIMARY KEY (article_id),
    FOREIGN KEY (user_id) REFERENCES web_user(user_id)
);


CREATE TABLE web_comment (
    comment_id INT AUTO_INCREMENT,
    article_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_content TEXT NOT NULL,
    create_date DATETIME NOT NULL,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (article_id) REFERENCES web_article(article_id),
    FOREIGN KEY (user_id) REFERENCES web_user(user_id)

);


create table web_like (
    id int(11),
    user_id int(11) not null,
    user_name char(20) not null,
    article_id int(11) not null,
    article_title varchar(256) not null,
    create_date datetime NOT NULL,
    primary key (id),
    FOREIGN KEY (article_id) REFERENCES web_article(article_id),
    FOREIGN KEY (user_id) REFERENCES web_user(user_id)
);

INSERT INTO web_user (user_id, user_name, real_name, password, avatar, brith_day, description, create_date, update_date) VALUES
(101, 'johnDoe', 'John Doe', 'pass123', 'avatar1.png', '1985-07-12', 'Enthusiastic web enthusiast', '2023-01-01 12:00:00', '2023-01-02 12:00:00'),
(102, 'janeSmith', 'Jane Smith', '1234abcd', 'avatar2.png', '1990-05-24', 'Dedicated programmer and tech lover', '2023-02-01 08:30:00', '2023-02-05 14:45:00'),
(103, 'mikeBrown', 'Mike Brown', 'mikepass', 'avatar3.png', '1978-11-09', 'Avid reader and tech enthusiast', '2023-03-10 09:20:00', '2023-03-12 10:00:00'),
(104, 'lucyGreen', 'Lucy Green', 'lucy1234', 'avatar4.png', '1982-02-17', 'Creative writer and designer', '2023-04-15 16:40:00', '2023-04-17 17:30:00'),
(105, 'tomWhite', 'Tom White', 'tomwhite', 'avatar5.jpg', '1988-09-30', 'Software engineer with a passion for music', '2023-05-20 13:00:00', '2023-05-22 13:30:00'),
(106, 'saraBlue', 'Sara Blue', 'blue1234', 'avatar6.png', '1992-03-22', 'Digital marketer and social media expert', '2023-06-25 10:10:00', '2023-06-27 11:20:00'),
(107, 'davidBlack', 'David Black', 'davidb', 'avatar7.jpg', '1975-12-14', 'Entrepreneur and business strategist', '2023-07-30 15:50:00', '2023-08-01 16:00:00'),
(108, 'emmaWilson', 'Emma Wilson', 'emmaW123', 'avatar8.png', '1994-07-08', 'Graphic designer and art lover', '2023-09-05 14:00:00', '2023-09-07 14:30:00'),
(109, 'alexGray', 'Alex Gray', 'alexgpass', 'avatar9.jpg', '1980-04-18', 'Fitness coach and health enthusiast', '2023-10-10 17:00:00', '2023-10-12 17:30:00'),
(110, 'noraPurple', 'Nora Purple', 'norap', 'avatar10.png', '1986-01-28', 'Professional photographer and traveler', '2023-11-15 18:20:00', '2023-11-17 19:00:00');

INSERT INTO web_article (article_id, user_id, user_name, article_title, article_content, create_date, update_date, like_count) VALUES
(1, 101, 'johnDoe', 'The Future of Web Development', 'Exploring the latest trends in web development...', '2023-01-10 10:00:00', '2023-01-11 15:00:00', 120),
(2, 102, 'janeSmith', 'Introduction to Machine Learning', 'Machine learning is transforming industries...', '2023-02-15 09:30:00', '2023-02-16 10:45:00', 95),
(3, 103, 'mikeBrown', 'The Joy of Reading', 'Discussing the benefits and joys of reading daily...', '2023-03-20 08:20:00', '2023-03-21 09:25:00', 80),
(4, 104, 'lucyGreen', 'Designing for the Web', 'Best practices for web design and user experience...', '2023-04-25 14:40:00', '2023-04-26 15:35:00', 110),
(5, 105, 'tomWhite', 'Music and Coding: A Perfect Match', 'How music can influence coding efficiency and enjoyment...', '2023-05-30 13:00:00', '2023-05-31 14:00:00', 75),
(6, 106, 'saraBlue', 'Social Media Marketing Strategies', 'Effective strategies for marketing on social media...', '2023-06-05 11:10:00', '2023-06-06 12:15:00', 90),
(7, 107, 'davidBlack', 'Entrepreneurship 101', 'Key lessons for aspiring entrepreneurs...', '2023-07-10 16:50:00', '2023-07-11 17:05:00', 65),
(8, 108, 'emmaWilson', 'The Art of Graphic Design', 'Exploring creativity through graphic design...', '2023-08-15 18:00:00', '2023-08-16 19:00:00', 105),
(9, 109, 'alexGray', 'Staying Fit While Working from Home', 'Tips and tricks for maintaining fitness with a busy schedule...', '2023-09-20 17:05:00', '2023-09-21 18:10:00', 85),
(10, 110, 'noraPurple', 'Travel Photography: Capturing the World', 'How to capture breathtaking travel photographs...', '2023-10-25 19:20:00', '2023-10-26 20:25:00', 130);
