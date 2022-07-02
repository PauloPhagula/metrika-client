describe("metrika app", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001")
  })

  it("displays two main links", () => {
    cy.get(".nav-link").should("have.length", 2)
    cy.get(".nav-link").first().should("have.text", "Dashboard")
    cy.get(".nav-link").last().should("have.text", "New Metric")
  })

  it("displays the dashboard by default", () => {
    cy.get(".nav-link.active").should("have.length", 1)
    cy.get(".nav-link.active").should("have.text", "Dashboard")
  })

  context("can validate new metric form before submitting", () => {
    beforeEach(() => {
      cy.contains("New Metric").click()
      cy.url()
        .should("include", "new")
    })

    it("doesn't accept submitting form with invalid names", () => {
      cy.contains("Save").click()
      cy.get("input[name='name']").should("have.focus")
      cy.url().should("include", "new")
    })

    it("doesn't accept submitting form with invalid value", () => {
      cy.get("input[name='name']").type("abc")
      cy.contains("Save").click()
      // cy.get("input[name='value']").should("have.focus")
      cy.url().should("include", "new")
    })

    it("doesn't accept submitting form with invalid timepoint", () => {
      cy.get("input[name='name']").type("abc")
      cy.get("input[name='metric_value']").type("1")
      cy.contains("Save").click()
      cy.get("input[name='timepoint']").should("have.focus")
      cy.url().should("include", "new")
    })
  })

  it("can add new valid metrics", () => {
    cy.contains("New Metric").click()
    cy.url()
      .should("include", "new")

    cy.get("input[name='name']").type("disk_usage")
    cy.get("input[name='metric_value']").type("75")
    cy.get("input[name='timepoint']").type("2022-06-07T10:21")

    cy.contains("Save").click()
    cy.url().should("include", "/")
  })

  it("can load data on the dashboard", () => {
    cy.get("select[name='metric']").select("disk_usage")
    cy.get("input[name='from']").type("2022-06-01T00:00")
    cy.get("input[name='to']").type("2022-06-30T00:00")
    cy.contains("Refresh").click()

    cy.wait(500)

    cy.get("#chart")
      .should("be.visible")
      .and($chart => {
        expect($chart.height()).to.be.greaterThan(200)
    })
  })
})
