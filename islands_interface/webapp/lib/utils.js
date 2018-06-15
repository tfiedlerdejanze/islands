export const boardRange = Array.from({length: 10}, (v, k) => k+1);

export const blankBoard = {
    l_shape: {coordinates: []},
    s_shape: {coordinates: []},
    square: {coordinates: []},
    attol: {coordinates: []},
    dot: {coordinates: []},
};

export const offsets = {
    atoll: [[0, 0], [0, 1], [1, 1], [2, 0], [2, 1]],
    s_shape: [[0, 1], [0, 2], [1, 0], [1, 1]],
    l_shape: [[0, 0], [1, 0], [2, 0], [2, 1]],
    square: [[0, 0], [0, 1], [1, 0], [1, 1]],
    dot: [[0, 0]]
}
