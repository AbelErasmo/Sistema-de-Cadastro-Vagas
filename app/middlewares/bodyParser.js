import bodyParser from "body-parser";

const bodyParserMidldleware = [
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json()
];

export default bodyParserMidldleware;