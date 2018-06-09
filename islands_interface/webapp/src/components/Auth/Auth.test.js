import React from 'react';
import renderer from 'react-test-renderer';
import Auth from './Auth';

describe('<Auth />', () => {
    it('Auth component should render correctly.', () => {
        const tree = renderer
            .create(
                <Auth />
            )
            .toJSON();

        expect(tree).toMatchSnapshot();
    });
});
