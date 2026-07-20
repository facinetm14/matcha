import { hashPassword } from '@/modules/auth/infrastructure/utils/password';
import { UserStatus } from '@/modules/users/domain/consts/user-status.enum';
import { faker } from '@faker-js/faker';
import { uuid } from '@shared/uuid';
import { Pool } from 'pg';

const genders = ['male', 'female', 'non-binary'];
const tagList1 = [
  'Traveling',
  'Cooking',
  'Fitness',
  'Yoga',
  'Reading',
  'Movies',
  'Sports',
  'Dancing',
];
const tagList2 = [
  'Photography',
  'Hiking',
  'Gaming',
  'Art',
  'Pets',
  'Wine Tasting',
  'Coffee',
  'Technology',
];

const SEED_SIZE = 500;

export const pgClient = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.SEEDER_DB_HOST,
  port: +(process.env.DB_PORT ?? '5432'),
  database: process.env.POSTGRES_DB,
});

function cleanUsername(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function seedUsers() {
  const client = await pgClient.connect();

  try {
    console.log(
      `--------------------Seeding users with ${SEED_SIZE} profiles-----------------`,
    );

    const saveUserAttributes = [];

    for (let i = 0; i < SEED_SIZE; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      const randomNum = faker.number.int({ min: 1, max: 9999 });
      const username = cleanUsername(`${firstName}${lastName}${randomNum}`);

      const email = `${username}@yopmail.com`;
      const passwd = await hashPassword(`${email}1A`);

      const gender = faker.helpers.arrayElement(genders);
      const bio = faker.lorem.sentence(8);
      const birthdate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
      const id = uuid();
      const createdAt = new Date();
      const updatedAt = createdAt;
      const status = UserStatus.VERIFIED;
      const isFirstLogin = 'yes';
      const sexualOrientation = 'male female';

      const tag1 = faker.helpers.arrayElement(tagList1);
      const tag2 = faker.helpers.arrayElement(tagList2);

      await client.query(
        `
        INSERT INTO users (
          id,
          username,
          email,
          passwd,
          first_name,
          last_name,
          status,
          created_at,
          updated_at,
          is_first_login,
          gender,
          sexual_orientation,
          bio,
          birth_date
        )
        VALUES (
          $1,
          $2, 
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13,
          $14
        )
        `,
        [
          id,
          username,
          email,
          passwd,
          firstName,
          lastName,
          status,
          createdAt,
          updatedAt,
          isFirstLogin,
          gender,
          sexualOrientation,
          bio,
          birthdate,
        ],
      );

      const insertTag1 = client.query(
        `
        INSERT INTO user_interests (id, user_id, interest)
        VALUES ($1, $2, $3)
        `,
        [uuid(), id, tag1],
      );

      const insertTag2 = client.query(
        `
        INSERT INTO user_interests (id, user_id, interest)
        VALUES ($1, $2, $3)
        `,
        [uuid(), id, tag2],
      );

      const lat = faker.location.latitude({ min: 48.5, max: 49.9 });
      const lng = faker.location.longitude({ min: 1.8, max: 3.9 });

      const insertLocation = client.query(
        `
          INSERT INTO users_location(id, user_id, shared_by_user_at, lat, lng)
          VALUES($1, $2, $3, $4, $5)
          `,
        [uuid(), id, createdAt, lat, lng],
      );

      saveUserAttributes.push(...[insertTag1, insertTag2, insertLocation]);
    }

    await Promise.all(saveUserAttributes);

    console.log('Done! 500 users inserted-----------------');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    client.release();
  }
}

seedUsers();
