### 0.7.0 2018-06-02

- Set up testing with `cypress.io` / `jest` [#4](https://github.com/hydrosquall/h1b-software-salaries-ts/pull/4)
- Run Tests on Travis [#5](https://github.com/hydrosquall/h1b-software-salaries-ts/pull/5)
- Deploy to GH-Pages on merge to Master [#6](https://github.com/hydrosquall/h1b-software-salaries-ts/pull/6)

### 0.6.0 2018-06-02

- Add zoom-on-filter capabilities[#2](https://github.com/hydrosquall/h1b-software-salaries-ts/pull/2)
- Improve user experience for filter combinations with missing data [#3](https://github.com/hydrosquall/h1b-software-salaries-ts/pull/3)

### 0.5.0 2018-06-02

- Fix [bug](https://github.com/Swizec/react-d3js-step-by-step/issues/2) where adding/removing multiple filters leads to app not working (Fix [#1](https://github.com/hydrosquall/h1b-software-salaries-ts/pull/1))
- Hoist data filtering logic up to `App.jsx`


### 0.4.0 2018-05-28

- Add routing (load specific views by changing the window hash) without React Router
- Deploy to Github

### 0.3.0 2018-05-28

- Filters have been installed for 3 types of metadata. They usually work, but after applying all 3, it's possible to get into a state where nothing gets displayed at all.
- It might be easier to debug this if all the filter logic gets pulled out into redux.

### 0.2.0 2018-05-28

- Add histogram, text description, graph description - non-interactive portion is complete.
- Refine the data processing lodash code from the examples
- Add Eslint

### 0.1.0 / 2018-05-27

- Project Typescript tooling setup
- Data handling / loading
- `County` + `CountyMap` are shaded
