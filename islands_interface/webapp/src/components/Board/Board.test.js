import React from 'react';
import renderer from 'react-test-renderer';
import Board from './Board';

describe('<Board />', () => {
    it('Board component should render correctly.', () => {
        const tree = renderer
            .create(
                <Board />
            )
            .toJSON();

        expect(tree).toMatchSnapshot();
    });
});
