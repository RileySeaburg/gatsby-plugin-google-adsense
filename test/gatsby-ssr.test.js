import { onRenderBody } from "../src/gatsby-ssr";

describe("gatsby-plugin-ssr", () => {
  describe("onRenderBody", () => {
    describe("in non production env", () => {
      test("does not set tracking script", () => {
        const setHeadComponents = jest.fn();
        const reporter = {
          warn: jest.fn()
        };
        onRenderBody({ reporter, setHeadComponents });
        expect(reporter.warn).toHaveBeenCalledTimes(1);
        expect(setHeadComponents).not.toHaveBeenCalled();
      });
    });
    describe("in production env", () => {
      let env;
      beforeAll(() => {
        env = process.env.NODE_ENV;
        process.env.NODE_ENV = `production`;
      });
      afterAll(() => {
        process.env.NODE_ENV = env;
      });

      const setup = options => {
        const setHeadComponents = jest.fn();
        const setPostBodyComponents = jest.fn();
        const reporter = {
          warn: jest.fn()
        };
        options = Object.assign({}, options);
        onRenderBody(
          { reporter, setHeadComponents, setPostBodyComponents },
          options
        );
        return {
          reporter,
          setHeadComponents,
          setPostBodyComponents
        };
      };

      it("set tracking script without googleAdClientId", () => {
        const { reporter, setHeadComponents, setPostBodyComponents } = setup();
        expect(reporter.warn).toHaveBeenCalledTimes(1);
        expect(setHeadComponents).toHaveBeenCalledTimes(0);
        expect(setPostBodyComponents).toHaveBeenCalledTimes(0);
      });

      it("set tracking script with googleAdClientId", () => {
        const options = {
          googleAdClientId: "abc"
        };
        const { reporter, setHeadComponents, setPostBodyComponents } = setup(
          options
        );
        expect(reporter.warn).toHaveBeenCalledTimes(0);
        expect(setHeadComponents).toHaveBeenCalledTimes(0);
        expect(setPostBodyComponents).toHaveBeenCalledTimes(1);
      });

      it("set tracking script with googleAdClientId in head", () => {
        const options = {
          head: true,
          googleAdClientId: "abc"
        };
        const { reporter, setHeadComponents, setPostBodyComponents } = setup(
          options
        );
        expect(reporter.warn).toHaveBeenCalledTimes(0);
        expect(setHeadComponents).toHaveBeenCalledTimes(1);
        expect(setPostBodyComponents).toHaveBeenCalledTimes(0);
      });
    });
  });
});
