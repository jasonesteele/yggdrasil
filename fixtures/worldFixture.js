import moment from "moment";

const worldFixture = (properties, sequence) => ({
  id: `world-id-${sequence || "0"}`,
  name: `World Name ${sequence || "0"}`,
  description: `Description of world ${sequence || "0"}.`,
  createdAt: moment("2022-06-01T13:45:56Z").toDate(),
  updatedAt: moment("2022-06-02T06:54:32Z").toDate(),
  ...(properties ? properties : {}),
});

export default worldFixture;
