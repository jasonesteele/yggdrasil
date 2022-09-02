import { fireEvent, render, screen } from "@testing-library/react";
import sinon from "sinon";
import userFixture from "../../../fixtures/userFixture";
import worldFixture from "../../../fixtures/worldFixture";
import WorldCard from "../../../src/components/world/WorldCard";

const worldDescription = () => {
  return screen.queryByTestId("world-description").innerHTML;
};

const worldOnlineCount = () => {
  return screen.queryByTestId("world-online-counter").firstChild.innerHTML;
};

const worldName = () => {
  return screen.queryByTestId("world-name").innerHTML;
};

describe("components", () => {
  describe("WorldCard", () => {
    it("renders a world", () => {
      render(<WorldCard world={worldFixture()} />);

      expect(worldName()).toEqual("World Name 0");
      expect(worldOnlineCount()).toEqual("0");
      expect(worldDescription()).toEqual("Description of world 0.");
    });

    it("renders a null world", () => {
      render(<WorldCard />);

      expect(worldName()).toEqual("<i>Untitled</i>");
      expect(worldOnlineCount()).toEqual("0");
      expect(worldDescription()).toEqual("<i>No description available</i>");
    });

    it("renders online user count", () => {
      render(
        <WorldCard
          world={worldFixture({
            users: [
              userFixture({ online: true }, 1),
              userFixture({ online: false }, 2),
              userFixture({ online: true }, 3),
            ],
          })}
        />
      );

      expect(worldName()).toEqual("World Name 0");
      expect(worldOnlineCount()).toEqual("2");
      expect(worldDescription()).toEqual("Description of world 0.");
    });

    it("handles a click on the world card", () => {
      const handleWorldSelect = sinon.spy();
      render(<WorldCard world={worldFixture()} onSelect={handleWorldSelect} />);
      fireEvent.click(screen.getByTestId("world-card"));
      expect(handleWorldSelect).toHaveProperty("callCount", 1);
    });
  });
});
