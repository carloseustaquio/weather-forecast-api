import { StormGlass } from "@src/clients/StormGlass";
import stormGlassWeather3HoursFixture from "@test/fixtures/stormglass_weather_3_hours.json";
import stormGlassNormalizedWeather3HoursFixture from "@test/fixtures/stormglass_normalized_weather_3_hours.json";
import * as HTTPUtil from "@src/util/request";

jest.mock("@src/util/request");

describe("StormGlas client", () => {
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;

  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;
  it("should return the normalized forecast from the StormGlass service", async () => {
    const lat = -33.792726;
    const long = 151.123456;

    mockedRequest.get.mockResolvedValue({
      data: stormGlassWeather3HoursFixture,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, long);
    expect(response).toEqual(stormGlassNormalizedWeather3HoursFixture);
  });

  it("sohould exclude incomplete data points", async () => {
    const lat = -33.792726;
    const long = 151.123456;

    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: "2020-08-29T00:00:00+00:00",
        },
      ],
    };

    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTTPUtil.Response);
    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, long);
    expect(response).toEqual([]);
  });

  it("should get a generic error from StormGlass service when the request fail before reaching the service", async () => {
    const lat = -33.792726;
    const long = 151.123456;

    mockedRequest.get.mockRejectedValue({ message: "Network Error" });

    const stormGlass = new StormGlass(mockedRequest);
    await expect(stormGlass.fetchPoints(lat, long)).rejects.toThrow(
      "Unexpected error when trying to communicate to StormGlass: Network Error"
    );
  });

  it("should get an StormGlassResponseError when the StormGlass service resonds with error", async () => {
    const lat = -33.792726;
    const long = 151.123456;

    MockedRequestClass.isRequestError.mockReturnValue(true);
    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ["Rate Limit reached"] },
      },
    });

    const stormGlass = new StormGlass(mockedRequest);
    await expect(stormGlass.fetchPoints(lat, long)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
