import { expect } from "chai";
import axios from 'axios';

const BASE_URL = `http://${process.env.RUNNING_LOCATION || 'localhost'}:8198`;

describe('nginx', () => {
    it('should return 401 without credentials', async () => {
        let response;
        try {
            const res = await axios.get(`${BASE_URL}`);
            res = res;
        } catch (e) {
            expect(e).to.have.property('response');
            response = e.response;
        }
        expect(response).to.have.property('status');
        expect(response.status).to.eql(401);
    });
});