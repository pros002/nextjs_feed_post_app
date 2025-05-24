import { verifyAuth } from "./auth";
import { pool } from "./db";

// postgres는 결과값을 객체에 저장할때 대소문자 구분 없이 모두 소문자로 키 설정되므로 createdAt이라고 AS에 썼어도 createdat으로 취득해야함.
export const getPosts = async (maxNumber) => {
  let limitClause = "";

  if (maxNumber) {
    limitClause = `LIMIT ${maxNumber}`;
  }

  const { user } = await verifyAuth();

  const stmt = await pool.query(
    `
    SELECT posts.id, image_url AS image, title, content, created_at AS createdat, COUNT(likes.post_id) AS likes, EXISTS(SELECT * FROM likes WHERE likes.post_id = posts.id and likes.user_id = $1) AS isliked
    FROM posts
    INNER JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    GROUP BY posts.id
    ORDER BY createdAt DESC
    ${limitClause}`,
    [user.id]
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return maxNumber ? stmt.rows.slice(0, maxNumber) : stmt.rows;
};

export const storePost = async (post) => {
  const stmt = await pool.query(
    `
    INSERT INTO posts (image_url, title, content, user_id)
    VALUES ($1, $2, $3, $4)`,
    [post.imageUrl, post.title, post.content, post.userId]
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return stmt.rowCount;
};

export const updatePostLikeStatus = async (postId, userId) => {
  const stmt = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM likes
    WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );

  // 숫자가 아닌 문자열로 취득된다.
  const isLiked = stmt.rows[0].count === "0";

  if (isLiked) {
    const stmt = await pool.query(
      `
      INSERT INTO likes (user_id, post_id)
      VALUES ($1, $2)`,
      [userId, postId]
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } else {
    const stmt = await pool.query(
      `
      DELETE FROM likes
      WHERE user_id = $1 AND post_id = $2`,
      [userId, postId]
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
