describe('Button filtering', () => {
  it("successfully loads", () => {
    cy.visit("/");
  });

  // Todo... tests should not depend on prior test state. However, reloading the hompage each time can be slow...
  it("no buttons are selected initially", () => {
    cy
      .get(".controlRows")
      .find(".btn-primary")
      .should("have.length", 0);
  });

  it("clicking a filter updates the controls", () => {
    cy
      .get(".controlRows")
      .find(".btn-default").first()
      .click();

    cy
      .get(".controlRows")
      .find(".btn-primary")
      .should("have.length", 1);
  });

  it("toggling the same filter resets the screen", () => {
    cy
      .get(".controlRows")
      .find(".btn-default")
      .first()
      .click();

    cy
      .get(".controlRows")
      .find(".btn-primary")
      .should("have.length", 0);
  });

  it("setting multiple filters behaves correctly", () => {
    cy
      .get(".controlRows")
      .find(".btn-default")
      .first()
      .click();

    cy
      .get(".controlRows")
      .find(".btn-default")
      .last()
      .click();

    cy
      .get(".controlRows")
      .find(".btn-primary")
      .should("have.length", 2);
  });
});