import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import MapLayer from "../MapLayer/MapLayer.vue";

describe("MapLayer", () => {
  it("renders properly", () => {
    const wrapper = mount(MapLayer);
    expect(wrapper.text()).toContain("Band");
  });
});
