import { configure } from "enzyme";
import ReactSixteenAdapter from "enzyme-adapter-react-16";
import raf from "./rafPolyfill"; 

configure({ adapter: new ReactSixteenAdapter() });
