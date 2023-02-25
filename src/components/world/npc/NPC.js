import Movable, {Directions} from "@/components/world/avatar/Movable";

export default class NPC extends Movable {
    constructor(x, y, identifier, name, commands) {
        super(x, y, identifier, name, "", Directions.SOUTH);

        this.commands = commands
    }

    trigger() {

    }
}