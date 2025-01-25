import { expect } from "chai";
import axios from 'axios';

const BASE_URL = `${process.env.RUNNING_LOCATION || 'localhost'}:8198`;

describe('nginx', () => {
    it('should return 401 without credentials', async () => {
        let response;
        try {
            response = await axios.get(`http://${BASE_URL}`);
        } catch (e) {
            expect(e).to.have.property('response');
            response = e.response;
        }
        expect(response).to.have.property('status');
        expect(response.status).to.eql(401);
    });

    it('should return 200 with credentials', async () => {
        let response;
        try {
            response = await axios.get(`http://test:test@${BASE_URL}`);
        } catch (e) {
            expect(e).to.have.property('response');
            response = e.response;
        }
        expect(response).to.have.property('status');
        expect(response.status).to.eql(200);
    });
});