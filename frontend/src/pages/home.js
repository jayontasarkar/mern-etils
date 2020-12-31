import { Col } from 'antd';
import React from 'react';
import Plain from './layouts/plain';

const HomePage = () => {
    return (
        <Plain>
            <Col style={{ textAlign: 'center' }}>
                <h1>Welcome to ETILS</h1>
                <div>
                    <img
                        src="hero.png"
                        alt="Hero"
                        style={{ marginTop: '25px', maxWidth: '750px' }}
                    />
                </div>
            </Col>
        </Plain>
    );
}

export default HomePage;