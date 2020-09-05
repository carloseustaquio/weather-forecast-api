import { StormGlass } from "@src/clients/StormGlass";
import stormGlassNormalizedResponse from "@test/fixtures/stormglass_normalized_weather_3_hours.json";
import {
  Beach,
  BeachPosition,
  Forecast,
  ForecastProcessingInternalError,
} from "../Forecast";

jest.mock("@src/clients/StormGlass");

describe("Forecast Service", () => {
  const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;

  it("should return the forecast for a list of beaches", async () => {
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: "Manly",
        position: BeachPosition.E,
        user: "some-id",
      },
    ];
    mockedStormGlassService.fetchPoints.mockResolvedValue(
      stormGlassNormalizedResponse
    );

    const expectedResponse = [
      {
        time: "2020-08-29T00:00:00+00:00",
        forecast: [
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
        ],
      },
      {
        time: "2020-08-29T01:00:00+00:00",
        forecast: [
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
        ],
      },
      {
        time: "2020-08-29T02:00:00+00:00",
        forecast: [
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
        ],
      },
    ];

    const forecast = new Forecast(mockedStormGlassService);
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });

  it("should return an empty list when the beaches array is empty", async () => {
    const forecast = new Forecast();
    const response = await forecast.processForecastForBeaches([]);
    expect(response).toEqual([]);
  });

  it("should throw internal processing error when something goes worng during the rating process", async () => {
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: "Manly",
        position: BeachPosition.E,
        user: "some-id",
      },
    ];

    mockedStormGlassService.fetchPoints.mockRejectedValue(
      "Error fetching data"
    );

    const forecast = new Forecast(mockedStormGlassService);
    await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(
      ForecastProcessingInternalError
    );
  });
});
