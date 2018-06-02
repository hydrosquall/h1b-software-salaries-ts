import fp from 'lodash/fp';

const pipeFromList = fns => fp.pipe(...fns);

export default pipeFromList;
