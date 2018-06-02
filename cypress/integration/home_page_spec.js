describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });
  it("has correct number of control panels", () => {
    cy
      .get(".controlRows")
      .find(".row")
      .should("have.length", 3); // State, job title, year
  });
  it("Does not have NaN showing up in the text", () => {
    cy
      .contains("NaN")
      .should("have.length", 0); // State, job title, year
  });
});
