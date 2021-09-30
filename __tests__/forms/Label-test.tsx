import "react-native";
import React from "react";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";
import type { ShallowWrapper } from "enzyme";
import { shallow } from "enzyme";

import Label from "../../src/forms/Label";

test("should maintain snapshot", () =>
  expect(renderer.create(<Label text={"Test Label"} />)).toMatchSnapshot());

describe("Render Tests", () => {
  const label = "Test Label Text";
  let wrapper: ShallowWrapper;

  beforeEach(() => (wrapper = shallow(<Label text={label} />)));

  test("it should create a text element", () =>
    expect(wrapper.exists("Text")).toBe(true));

  test("it should render the label text", () =>
    expect(wrapper.find("Text").render().text()).toContain(label));

  test("it should style the label", () => {
    const appliedStyle = wrapper.find("Text").prop("style");
    expect(appliedStyle).toHaveProperty("fontWeight", "bold");
  });
});
