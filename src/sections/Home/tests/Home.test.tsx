import { MockedProvider } from "@apollo/client/testing";
import { render, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";

import { Home } from "../index";

describe("Home", () => {
  // remove console error with window.scrollTo
  // eslint-disable-next-line
  window.scrollTo = () => {};

  // https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  describe("search input", () => {
    it("renders an empty search input on initial render", async () => {
      const history = createMemoryHistory();
      const { getByPlaceholderText } = render(
        <MockedProvider mocks={[]}>
          <Router history={history}>
            <Home />
          </Router>
        </MockedProvider>,
      );

      await waitFor(() => {
        const searchInput = getByPlaceholderText(
          "Search 'San Francisco'",
        ) as HTMLInputElement;

        expect(searchInput.value).toEqual("");
      });
    });
  });
  // describe("premium listings", () => {});
});
