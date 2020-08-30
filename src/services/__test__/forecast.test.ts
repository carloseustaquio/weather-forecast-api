import { StormGlass } from "@src/clients/StormGlass";
import stormGlassNormalizedResponse from "@test/fixtures/stormglass_normalized_weather_3_hours.json";
import { Beach, BeachPosition, Forecast } from "../Forecast";

jest.mock("@src/clients/StormGlass");

describe("Forecast Service", () => {
  // mocking with prototype
  StormGlass.prototype.fetchPoints = jest
    .fn()
    .mockResolvedValue(stormGlassNormalizedResponse);

  const beaches: Beach[] = [
    {
      lat: -33.792726,
      lng: 151.289824,
      name: "Manly",
      position: BeachPosition.E,
      user: "some-id",
    },
  ];

  it("should return the forecast for a list of beaches", async () => {
    const expectedResponse = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: "Manly",
        position: "E",
        rating: 1,
        swellDirection: 205.81,
        swellHeight: 0.06,
        swellPeriod: 2.75,
        time: "2020-08-29T00:00:00+00:00",
        waveDirection: 134.07,
        waveHeight: 0.2,
        windDirection: 223.77,
        windSpeed: 0.55,
      },
      {
        lat: -33.792726,
        lng: 151.289824,
        name: "Manly",
        position: "E",
        rating: 1,
        swellDirection: 171.1,
        swellHeight: 0.3,
        swellPeriod: 3.37,
        time: "2020-08-29T01:00:00+00:00",
        waveDirection: 133.82,
        waveHeight: 0.25,
        windDirection: 174.5,
        windSpeed: 1.39,
      },
      {
        lat: -33.792726,
        lng: 151.289824,
        name: "Manly",
        position: "E",
        rating: 1,
        swellDirection: 136.39,
        swellHeight: 0.54,
        swellPeriod: 3.98,
        time: "2020-08-29T02:00:00+00:00",
        waveDirection: 133.56,
        waveHeight: 0.29,
        windDirection: 125.23,
        windSpeed: 2.23,
      },
    ];

    const forecast = new Forecast(new StormGlass());
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });
});
