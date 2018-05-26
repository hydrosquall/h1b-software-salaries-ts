import { configure } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import raf from "./rafPolyfill"; 

configure({ adapter: new Adapter() });
