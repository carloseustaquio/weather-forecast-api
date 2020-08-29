import { StormGlass } from "@src/clients/stormGlass";
import axios from "axios";
import stormGlassWeather3HoursFixture from "@test/fixtures/stormglass_weather_3_hours.json";
import stormGlassNormalizedWeather3HoursFixture from "@test/fixtures/stormglass_normalized_weather_3_hours.json";

jest.mock("axios");

describe("StormGlas client", () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  it("should return the normalized forecast from the StormGlass service", async () => {
    const lat = -33.792726;
    const long = 151.123456;

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, long);
    expect(response).toEqual(stormGlassNormalizedWeather3HoursFixture);
  });
});
