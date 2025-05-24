import pg from "pg";

// pool.query를 사용하면 쿼리 실행후 커넥션을 자동적으로 반환한다.
// 복수의 쿼리 실행을 하려면 const client = await pool.connect();
// connection.query로 쿼리 실행후 client.release();
// 풀을 종료할때는 pool.end();호출
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});