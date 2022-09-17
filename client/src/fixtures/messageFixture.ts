import moment from "moment";
import userFixture from "./userFixture";

const messageFixture = (
  properties?: Partial<Message>,
  sequence?: number
): Message => ({
  __typename: "Message",
  id: properties?.id || `message-id-${sequence || "0"}`,
  text: properties?.text || `message-text-${sequence || "0"}`,
  createdAt: properties?.createdAt || moment().toDate(),
  user: properties?.user || userFixture(undefined, sequence),
});

export default messageFixture;
