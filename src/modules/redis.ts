import Redis from 'ioredis';
import { REDIS_URL } from '../constants';

const redis = new Redis(REDIS_URL);

export default redis;
