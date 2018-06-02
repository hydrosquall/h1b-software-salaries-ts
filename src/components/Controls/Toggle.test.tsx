import { shallow } from 'enzyme';
import * as React from 'react';
import Toggle from './Toggle';

describe('Toggle', ()=>{
  const handler = jest.fn();

  it('renders without crashing', () => {
    const wrapper = shallow(<Toggle name="name"
                                    label="description"
                                    value=""
                                    onClick={handler} />);
  });

  it('detects clicks', () => {
    const wrapper = shallow(<Toggle name="name"
      label="description"
      value=""
      onClick={handler} />);
    expect(handler).not.toBeCalled();
    wrapper.simulate('click');
    expect(handler).toBeCalled();
  });
});

