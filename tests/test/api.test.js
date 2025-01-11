import { expect } from "chai";
import axios from 'axios';

const BASE_URL = 'http://localhost:8198';

describe('nginx', () => {
    it('should return 401 without credentials', async () => {
        const res = await axios.get(`${BASE_URL}`);
        expect(res).to.have.status(401);
    });
});